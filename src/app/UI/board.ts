import { dom } from "./dom";
import gameData from "../gameData";
import { randomTurnTexts } from "../dialog";
import { setTilesAriaAll, addAriaLabel, setTilesAriaPlayerTurn } from "./aria";
import { isAiEnabled } from "../ai/ai";

const line = document.querySelector(dom.class.line);
const gameStart = <HTMLDivElement>document.getElementById(dom.id.gameStart);
const stats = <HTMLDivElement>document.querySelector(dom.class.stats);

export const postStats = () => {
  if (!stats || gameData.gameOver || gameData.gameTie) return null;
  if (gameData.currentPlayer().ai) {
    stats.innerHTML = "";
    return;
  }
  stats.innerHTML = randomTurnTexts(gameData.currentPlayer().displayName);
};

const cleanUp = (e: Event) => {
  e.preventDefault();

  let player = gameData.player1.turn ? gameData.player1 : gameData.player2;
  if (isAiEnabled()) {
    player = gameData.player1;
    gameData.player1.turn = true;
    gameData.player2.turn = false;
    gameData.aiFinished = true;
  }
  if (!stats || !line) return null;
  stats.innerHTML = `Go ${player.displayName}!`;
  line.innerHTML = "";

  gameData.gameOver = false;
  gameData.gameTie = false;
  gameData.winPosition = "";

  let count = 0;
  gameData.board = gameData.board.map(item => item.map(_ => count++));

  setTilesAriaAll({ restart: true });
  gameStart.innerHTML = "";
};

export const playAgainBtn = () => {
  gameStart.innerHTML = dom.html.btnPlayAgain;

  const btn = <HTMLDivElement>document.getElementById("btn-play_again");

  btn.addEventListener("click", cleanUp);
};

export const isCellMarkedDOM = (cell: HTMLDivElement) => {
  const fillFirstChild = cell.firstElementChild;
  if (!fillFirstChild) return null;

  return fillFirstChild.innerHTML.length > 0;
};

export const markBoardDOM = (cell: HTMLDivElement) => {
  if (isCellMarkedDOM(cell)) {
    return null;
  }
  const player = gameData.currentPlayer();

  const fillFirstChild = cell.firstElementChild;
  if (!fillFirstChild) return null;

  fillFirstChild.innerHTML = player.svgMark;

  addAriaLabel(player, cell);
  setTilesAriaPlayerTurn();
};

export const cleanUpGameStart = () => {
  gameStart.innerHTML = "";
};

export const announceWinner = () => {
  if (!stats) return null;
  if (gameData.gameTie) {
    stats.innerHTML = "Cat's Game!";
    return null;
  }
  const player = gameData.currentPlayer();
  stats.innerHTML = `${player.displayName} won!`;
  gameData.gameOver = true;
  setTilesAriaAll();
};

export const getColumnRow = (e: Event) => {
  const target = <HTMLDivElement>e.currentTarget;
  const targetParent = <HTMLDivElement>target.parentElement;

  const stringRow = <string>targetParent.getAttribute("data-row");
  const stringCol = <string>target.getAttribute("data-column");
  const cell = <HTMLDivElement>e.currentTarget;
  const row = parseInt(stringRow);
  const column = parseInt(stringCol);

  return { row, column, cell };
};

export const getCell = (row: number, column: number) => {
  const cellParent = <HTMLDivElement>(
    document.querySelector(`[data-row="${row}"]`)
  );
  return <HTMLDivElement>cellParent.querySelector(`[data-column="${column}"]`);
};