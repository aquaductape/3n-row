import { IPlayer } from "../../../../models/index";
import { createHTMLFromString } from "../../../../utils/index";
import { controllerColorList } from "../controllers/colorList";

export const colors = [
  ["#0cf", "#5fd"],
  ["#39f300", "#f3ff08"],
  ["#ff0051", "#ffc300"],
  ["#ff005b", "#ff00e4"],
  ["#e600ff", "#5f55ff"],
  ["#fff", "#ccc"]
];

export const renderColorsList = (colorGroup: HTMLElement, player: IPlayer) => {
  for (let [primaryColor, secondaryColor] of colors) {
    const elStr = `<li class="color-list" tabindex="0"><div style="background: ${primaryColor}; height: 50%;"class="primary-color"></div><div style="background: ${secondaryColor}; height: 50%;"class="secondary-color"></div>`;
    const el = createHTMLFromString(elStr);

    controllerColorList(el, primaryColor, secondaryColor, player);

    colorGroup.appendChild(el);
  }
};