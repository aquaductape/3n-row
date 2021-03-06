import { TPlayer } from "../../model/state";
import { TSkin } from "../../ts";
import { colorMap } from "../constants/constants";

type TPlayerData = {
  currentPlayer: TPlayer;
  players: TPlayer[];
};

export const btnItem = ({
  item,
  type,
  playerData,
  opponentSkin,
}: {
  item: string;
  type: TSkin;
  playerData: TPlayerData;
  opponentSkin: {
    color: string;
    shape: string;
  };
}) => {
  const { currentPlayer } = playerData;
  const { svgShapes: shapes } = currentPlayer;

  if (type === "color") {
    const [primaryColor, secondaryColor] = item.split(",");
    const [primaryColorHex, secondaryColorHex] = colorMap[item];
    const disabled = opponentSkin.color === item;
    // already selected by Opponent
    const classBase = "color-item";
    // const classSelected = playerColor === item ? "color-item--selected" : "";
    const classDisabled = disabled ? "disabled" : "";
    const classItem = `${classBase} ${classDisabled}`;
    const classItemInner = `${classBase}-inner`;
    const classItemBg = `${classBase}-bg`;

    return `
      <li class="${classBase}-container">
        <button 
          class="${classItem}"
          data-color="${item}"
          data-disabled="${disabled}"
          ${disabled ? "disabled" : ""}
          aria-label="choose gradient color of shape. Primary Color ${primaryColor}, Secondary Color ${secondaryColor}"
        >
          <div class="${classItemBg}" data-pick-item-inner="${type}">
            <div class="${classItemInner}"  style="background: linear-gradient(0deg, ${secondaryColorHex}, ${primaryColorHex});">
            </div>
          </div>
        </button>
        

      </li>
        `;
  }

  if (type === "shape") {
    // already selected by other player
    const disabled = opponentSkin.shape === item;
    // const classSelected = playerColor === item ? "color-item--selected" : "";
    const classDisabled = disabled ? "disabled" : "";
    const classBase = "shape-item";
    // const classSelected = playerShape === item ? "shape-item--selected" : "";
    const classItem = `${classBase} ${classDisabled}`;
    const classItemInner = `${classBase}-inner`;
    const classItemBg = `${classBase}-bg`;
    const shape = shapes[item].replace(
      /filter="url\(#drop-shadow-filter\)"/g,
      ""
    );

    return `
      <li class="${classBase}-container">
        <button 
          class="${classItem}" 
          data-shape="${item}" 
          data-disabled="${disabled}"
          ${disabled ? "disabled" : ""}
          aria-label="choose shape: ${item}"
        >
          <div class="${classItemBg}" data-pick-item-inner="${type}">
            <div class="${classItemInner}">
              ${shape}
            </div>
          </div>
        </button>


      </li>
      `;
  }
};
