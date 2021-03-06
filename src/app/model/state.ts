import { TRoomClient } from "../ts/colyseusTypes";
import { TPosition } from "../ts/index";

const serverDomain = process.env.MULTIPLAYER_ENDPOINT || "localhost:3000";

export const state: TState = {
  players: [
    {
      id: "P1",
      score: 0,
      name: "Player 1",
      color: "sky_blue,cyan",
      shape: "cross",
      svgShapes: <TShapes>{},
      getSvgShape() {
        return this.svgShapes[this.shape];
      },
      mark: "X",
      isAI: false,
      difficulty: null,
    },
    {
      id: "P2",
      score: 0,
      name: "Player 2",
      color: "red,orange",
      shape: "circle",
      svgShapes: <TShapes>{},
      getSvgShape() {
        return this.svgShapes[this.shape];
      },
      mark: "O",
      isAI: false,
      difficulty: "HARD",
    },
  ],
  game: {
    gameOver: false,
    gameStart: false,
    gameRunning: false, // when gameRunning is false; such as when menu start or play again
    gameTie: false,
    startAgain: false,
    playerTurn: "P1",
    firstMove: "alternate",
    firstMovePlayer: "P1",
    winner: null,
    loser: null,
    hasAI: false,
    winPosition: "",
    difficulties: ["MEDIUM", "HARD", "CHEATER"],
    markedPositions: [],
    board: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ],
    getCurrentPlayer() {
      const {
        game: { playerTurn },
        players,
      } = state;
      return players.find((player) => player.id === playerTurn)!;
    },
  },
  onlineMultiplayer: {
    serverDomain,
    serverUrl: `${location.protocol}//${serverDomain}`,
    serverWS: `ws://${serverDomain}`,
    active: false,
    password: "",
    room: null,
    roomCode: null,
    mainPlayer: "P1",
    opponentPlayer: "P2",
    hasPickedSkin: false,
    pickedItems: {
      color: "",
      shape: "",
    },
  },
};

// @ts-ignore
// window.$state = state;

export type TBoard = (number | "X" | "O")[][];

export type TShapes = {
  circle: string;
  cross: string;
  triangle: string;
  heart: string;
  // square: string;
  // kite: string;
  [key: string]: string;
};

export type TColors =
  | "sky_blue,cyan"
  | "green,yellow"
  | "red,orange"
  | "magenta,pink"
  | "purple,blue"
  | "white,grey";

export type TPlayer = {
  id: string;
  name: string; // default Player [num]
  score: number;
  shape: string;
  // shapes
  svgShapes: TShapes;
  getSvgShape: () => string;
  color: TColors;
  isAI: boolean;
  mark: "X" | "O";
  difficulty: string | null;
};

export type TGame = {
  playerTurn: string; // Player id
  getCurrentPlayer: () => TPlayer;
  firstMovePlayer: string; // Player id
  firstMove: "alternate" | "winner" | "loser";
  gameOver: boolean;
  gameStart: boolean;
  gameRunning: boolean;
  gameTie: boolean;
  startAgain: boolean;
  winner: string | null; // Player id
  loser: string | null; // Player id
  hasAI: boolean;
  board: TBoard;
  difficulties: ("MEDIUM" | "HARD" | "CHEATER")[];
  /** why an array? To allow the AI to cheat and take several positions in one turn */
  markedPositions: TPosition[];
  winPosition: string;
};

type TOnlineMultiplayer = {
  active: boolean;
  serverDomain: string;
  serverUrl: string;
  serverWS: string;
  password: string;
  room: null | TRoomClient;
  roomCode: null | string;
  mainPlayer: string; // Player id
  opponentPlayer: string; // Player id
  hasPickedSkin: boolean;
  pickedItems: {
    color: string;
    shape: string;
    [key: string]: string;
  };
};

export type TState = {
  players: TPlayer[];
  game: TGame;
  onlineMultiplayer: TOnlineMultiplayer;
};
