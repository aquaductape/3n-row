import { createHTMLFromString, uniqueIds } from "../../utils/index";
import { dom } from "./dom";
import gameData, { Player } from "../gameData";

const shapesDefs = [
  "cross",
  "circle",
  "triangle",
  "heart",
  "crossLeftDot",
  "crossRightDot"
];

export const addSVGDefs = () => {
  const player1 = gameData.player1;
  const player2 = gameData.player2;
  const player1Id = player1.id;
  const player2Id = player2.id;
  const player1Shapes = getStrShapesAll(player1Id);
  const player2Shapes = getStrShapesAll(player2Id);
  const defs = createDef(player1Shapes, player2Shapes);
  const defsEl = createHTMLFromString(defs);
  const body = <Element>document.querySelector("body");
  body.appendChild(defsEl);

  setAllColors(player1);
  setAllColors(player2);
};

const createDef = (...defs: string[]) => {
  return dom.svg.defs.openingDef + defs.join("") + dom.svg.defs.closingDef;
};

const getStrShapesAll = (id: string) => {
  return shapesDefs
    .map(shape =>
      uniqueIds({
        id: `-${shape}-${id}`,
        svg: dom.svg.defs[shape]
      })
    )
    .join("");
};

export const setAllColors = (player: Player) => {
  for (let shape of shapesDefs) {
    setColor(player, shape);
  }
};

const setColor = (player: Player, shape: string) => {
  const shapePrimary = `.${dom.class.shapeColorPrimary}-${shape}-${player.id}`;
  const shapeSecondary = `.${dom.class.shapeColorSecondary}-${shape}-${player.id}`;
  const colorPrimary = <NodeListOf<HTMLElement>>(
    document.querySelectorAll(shapePrimary)
  );
  const colorSecondary = <NodeListOf<HTMLElement>>(
    document.querySelectorAll(shapeSecondary)
  );
  colorPrimary.forEach(el => {
    el.style.stopColor = player.primaryColor;
  });
  colorSecondary.forEach(el => {
    el.style.stopColor = player.secondaryColor;
  });
};