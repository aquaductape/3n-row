import { flattenArr, randomItemFromArr } from "../../utils/index";
import { state, TBoard, TPlayer } from "../state";
import miniMax, { didWin } from "./minMax";

export type TFlattenBoard = (number | "X" | "O")[];

export type cellCostItem = {
  score: number;
  cell: { row: number; column: number };
};

export interface IMove {
  index: number;
  score: number;
}

export interface IOptionsCheckBoard {
  terminal_state: boolean;
}

export const delayAi = (time: number = 900) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), time);
  });
};

const willPickRandom = () => {
  return Math.floor(Math.random() * 3) === 0;
};

const pickRandom = (board: TFlattenBoard): number => {
  const randomIdx = Math.floor(Math.random() * board.length) + 1;

  if (typeof board[randomIdx] !== "number") return pickRandom(board);
  return randomIdx;
};

// returns the available spots on the board
const emptyIndexies = (board: TFlattenBoard): number[] => {
  return board.filter((s) => s !== "O" && s !== "X") as number[];
};

export const decideMove = (player: TPlayer) => {
  if (player.difficulty === "CHEATER") {
    const moveOneIdx = moveIdxResult(player);
    const moveTwoIdx = extraMoveIndxFromCheater({
      player,
      prevIndex: moveOneIdx,
    });
    const moves = [moveOneIdx];
    if (moveTwoIdx != null) moves.push(moveTwoIdx);

    return moves.map((move) => convertIdxToRowCol(move));
  }

  return convertIdxToRowCol(moveIdxResult(player));
};

const extraMoveIndxFromCheater = ({
  player,
  prevIndex,
}: {
  player: TPlayer;
  prevIndex: number;
}) => {
  const {
    game: { board },
  } = state;

  const flattenBoard = flattenArr(board);
  const emptyCells = emptyIndexies(
    flattenBoard.filter((cell) => cell !== prevIndex)
  );

  if (emptyCells.length === 0) return null;
  if (emptyCells.length > 6 || emptyCells.length < 4) return null;

  return randomItemFromArr(emptyCells);
};

const moveIdxResult = (player: TPlayer) => {
  const {
    game: { board },
  } = state;
  const flattenBoard = flattenArr(board);
  const playerMark = player.mark;
  const emptyCells = emptyIndexies(flattenBoard);
  if (emptyCells.length === 0) return 0;

  if (player.difficulty === "MEDIUM" || player.difficulty === "CHEATER") {
    if (emptyCells.length === 4 || emptyCells.length === 5) {
      return randomItemFromArr(emptyCells);
    }
  }

  // The AI DOES NOT use the miniMax algorithm!!!
  // I wanted to make the Ai to be difficult but not impossible
  // But the miniMax js implementations from what I found online
  // are prone to fail if the previous move was not optimal (such as first move on edge, instead of corner or center)
  // Luckily since there's not a lot of combinations, I set
  // the default behavior to pick randoma and if it sees a win or prevent a lose
  // on that turn, it will prioritize that cell.
  // Result is a strong but not unbeatable boring AI
  let defenseIndex = defensiveDepth1(flattenBoard);
  let offensiveIndex = offensiveDepth1(flattenBoard);
  if (offensiveIndex != null) return offensiveIndex;
  if (defenseIndex != null) return defenseIndex;

  return randomItemFromArr(emptyCells);
};

const pickEdges = (board: TFlattenBoard) => {
  // 0 1 2
  // 3 4 5
  // 6 7 8
  const edges = [1, 3, 5, 7];
  const newBoard = edges.filter((edge) => board.includes(edge));
  return randomItemFromArr(newBoard);
};

const randomRoundAmount = (rounds: number = 0) => {
  return Math.floor(Math.random() * rounds);
};

const convertIdxToRowCol = (idx: number) => {
  const column = idx % 3;
  let row = 0;

  if (idx > 5) {
    row = 2;
    return { row, column };
  }
  if (idx > 2) {
    row = 1;
    return { row, column };
  }

  return { row, column };
};

const defensiveDepth1 = (board: TFlattenBoard) => {
  const human = "X" as "X";
  const newBoard = [...board];
  let itemHolder = null;

  for (let i = 0; i < newBoard.length; i++) {
    const item = newBoard[i];
    if (typeof item !== "number") continue;
    itemHolder = item;
    newBoard[i] = human;

    if (didWin(newBoard, human)) {
      return i;
    } else {
      newBoard[i] = itemHolder;
    }
  }
  return null;
};

const offensiveDepth1 = (board: TFlattenBoard) => {
  const ai = "O" as "O";
  const newBoard = [...board];
  let itemHolder = null;

  for (let i = 0; i < newBoard.length; i++) {
    const item = newBoard[i];
    if (typeof item !== "number") continue;
    itemHolder = item;
    newBoard[i] = ai;

    if (didWin(newBoard, ai)) {
      return i;
    } else {
      newBoard[i] = itemHolder;
    }
  }
  return null;
};
