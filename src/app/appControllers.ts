import {
  toggleOptions,
  randomShapeAndColorAi
} from "./views/playerOptions/playerOptions";

import { dom } from "./views/dom";
import gameData from "./models/gameData";
import { startGame, moveHuman } from "./models/gameLogic";
import {
  cleanUpGameStart,
  getColumnRow,
  cleanUp,
  isCellMarkedDOM
} from "./views/board";
import { isAiFinished, isAiEnabled, startAi } from "./models/ai/ai";
import addEscapeHatch from "../utils/addEscapeHatch";

export const valideKeyInput = (e: Event) => {
  const event = <KeyboardEvent>e;
  const eventType = event.type;
  if (eventType === "keydown") {
    const key = event.key;
    if (key !== "Enter" && key !== " ") return false;
  }
  return true;
};

export const onPlayer1BtnOptions = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  e.stopPropagation();

  console.log("player1 btn start");
  const playerId = gameData.player1.id;
  const target = e.currentTarget as HTMLElement;

  toggleOptions({ target, playerId });

  addEscapeHatch({
    element: target,
    onStart: e => {
      const clickedTarget = e.event.target as HTMLElement;
      console.log(clickedTarget);
      if (clickedTarget.closest("." + dom.class.dropDownOptions)) {
        return false;
      }

      return true;
    },
    onExit: () => {
      console.log("onexit player1");
      toggleOptions({ target, playerId });
    }
  });
};

export const onPlayer2BtnOptions = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  e.stopPropagation();

  console.log("player2 btn start");
  const playerId = gameData.player2.id;
  const optionsAiStr = dom.html.optionsAI;
  const target = e.currentTarget as HTMLElement;

  toggleOptions({ target, playerId, aiHTML: optionsAiStr });

  addEscapeHatch({
    element: target,
    onStart: e => {
      const clickedTarget = e.event.target as HTMLElement;
      console.log("onStart playerbtn2", clickedTarget);
      console.log("player2 element", e.element);
      if (clickedTarget.closest("#" + dom.id.optionsRestart)) {
        return true;
      }
      if (clickedTarget.closest("." + dom.class.dropDownOptions)) {
        return false;
      }

      return true;
    },
    onExit: () => {
      toggleOptions({ target, playerId, aiHTML: optionsAiStr });
      console.log("onexit player2");
    }
  });
};

export const onBtnAi = (e: Event) => {
  // toggleDropDown();
  // onDropDownSettings();
  startGame({
    ai: true,
    difficulty: "IMPOSSIBLE"
  });
  cleanUpGameStart();
};

export const onBtnHuman = (e: Event) => {
  startGame();
  cleanUpGameStart();
};

export const onAction = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  const target = <HTMLElement>e.target;

  if (gameData.gameOver || !isAiFinished() || isCellMarkedDOM(target)) {
    return null;
  }

  cleanUpGameStart();

  const { row, column, cell } = getColumnRow(e);
  moveHuman(row, column, cell);

  if (isAiEnabled()) {
    startAi();
  }
};

export const onPlayAgain = (e: Event) => {
  cleanUp(e);
  randomShapeAndColorAi();
};
