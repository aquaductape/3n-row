import { TPlayer, TState } from "../../model/state";
import { colorMap } from "../constants/constants";
import { svgStringWithUniqueIds } from "../utils/index";
import View from "../View";

class SvgDefsView extends View {
  data: TPlayer[];
  constructor() {
    super({ root: ".svg-defs-container" });
    this.data = [];
  }

  private shapeDefsMarkup() {
    const players = this.data;
    const defsContainer = (...defs: string[]) => {
      return (
        defsCollection.openingDef + defs.join("") + defsCollection.closingDef
      );
    };

    const getStrShapesAll = (id: string) => {
      return shapesDefs
        .map((shape) =>
          svgStringWithUniqueIds({
            id: `-${shape}-${id}`,
            svg: defsCollection[shape],
          })
        )
        .join("");
    };

    const createSVGGraphicsInsideDefs = (players: TPlayer[]) => {
      const playerShapes = players
        .map((player) => getStrShapesAll(player.id))
        .join("");

      return defsContainer(playerShapes);
    };

    return createSVGGraphicsInsideDefs(players);
  }

  private clipPathDefsMarkup() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg">
        <circle id="clipPath-dropdown-P1-circle" cx="0" cy="60px" r="0px" fill="red"/>
        <circle id="clipPath-dropdown-P2-circle" cx="100%" cy="60px" r="0px" fill="red"/>
    </svg>
    `;
  }
  private dropShadowMarkup() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${defsCollection.dropShadow}
      </defs>
    </svg>
    `;
  }
  protected generateMarkup() {
    return `
      <div class="shape-defs-container">
        ${this.shapeDefsMarkup()}
      </div>
      <div class="clip-path-container">
        ${this.clipPathDefsMarkup()}
      </div>
      <div class="drop-shadow-container">
        ${this.dropShadowMarkup()}
      </div>
    `;
  }

  private setColorOfPlayer(player: TPlayer, shape: string) {
    if (!player.color) return;

    const [primaryColor, secondaryColor] = colorMap[player.color];
    const shapeColorPrimary = `.color-primary-${shape}-${player.id}`;
    const shapeColorSecondary = `.color-secondary-${shape}-${player.id}`;
    const colorPrimary = <NodeListOf<SVGElement>>(
      document.querySelectorAll(shapeColorPrimary)
    );
    const colorSecondary = <NodeListOf<HTMLElement>>(
      document.querySelectorAll(shapeColorSecondary)
    );
    colorPrimary.forEach((el) => {
      el.setAttribute("stop-color", primaryColor);
    });
    colorSecondary.forEach((el) => {
      el.setAttribute("stop-color", secondaryColor);
    });
  }

  // override to set colors immediately after render
  render(data: TPlayer[]) {
    super.render(data);
    this.setColors();
  }

  updateDropShadow(color: string) {
    const feFlood = this.parentEl.querySelector(
      "#drop-shadow-filter feFlood"
    ) as SVGElement;
    feFlood.style.floodColor = color;
  }

  updateShapeColors(data: TPlayer[]) {
    this.data = data;

    const shapeDefsContainer = this.parentEl.querySelector(
      ".shape-defs-container"
    ) as HTMLElement;
    shapeDefsContainer.innerHTML = this.shapeDefsMarkup();
    this.setColors();
  }

  private setColor(player: TPlayer) {
    for (let shape of shapesDefs) {
      // this.setColorOfPlayer(player, shape);
      this.setColorOfPlayer(player, shape);
    }
  }

  setColors() {
    const players = this.data;

    players.forEach((player) => this.setColor(player));
  }
}
type TDefsCollection = {
  openingDef: string;
  closingDef: string;
  primaryColor: string;
  secondaryColor: string;
  circle: string;
  cross: string;
  triangle: string;
  heart: string;
  square: string;
  kite: string;
  dropShadow: string;
  [key: string]: string;
};

const defsCollection: TDefsCollection = {
  openingDef: `<svg xmlns="http://www.w3.org/2000/svg" class="defs-collection" height="0" width="0" viewBox="0 0 32 32">
    <defs>`,
  closingDef: `</defs></svg>`,
  primaryColor: `<linearGradient id="a">
      <stop class="color-primary" stop-color="#000"/>
    </linearGradient>`,
  secondaryColor: `<linearGradient id="a">
    <stop class="color-secondary" stop-color="#000"/>
  </linearGradient>`,
  circle: `<linearGradient id="a">
    <stop offset="0" class="color-primary" stop-color="#ff4900"/>
    <stop offset="1" class="color-secondary" stop-color="#ffc300"/>
  </linearGradient>
  <linearGradient xlink:href="#a" id="b" x1="53.5009" y1="-2.4148" x2="53.5009" y2="13.775" gradientUnits="userSpaceOnUse"/>`,
  cross: `
  <linearGradient id="b">
    <stop class="color-primary" offset="0" stop-color="currentColor"/>
    <stop class="color-secondary" offset="1" stop-color="currentColor"/>
  </linearGradient>
  <linearGradient id="a">
    <stop class="color-secondary" offset="0" stop-color="currentColor"/>
    <stop class="color-primary" offset="1" stop-color="currentColor"/>
  </linearGradient>
  <linearGradient gradientUnits="userSpaceOnUse" y2="19.9728" x2="6.4856" y1="13.2292" x1="13.2292" id="d" xlink:href="#a"/>
  <linearGradient gradientUnits="userSpaceOnUse" y2="22.7431" x2="21.9646" y1="11.6221" x1="11.6221" id="c" xlink:href="#b"/>`,
  triangle: `
    <linearGradient id="a">
      <stop class="color-primary" offset="0" stop-color="#0cf"/>
      <stop class="color-secondary" offset="1" stop-color="#5fd"/>
    </linearGradient>
    <linearGradient y2="22.7431" x2="21.9646" y1="11.6221" x1="11.6221" gradientTransform="rotate(135 12.262 17.1198)" gradientUnits="userSpaceOnUse" id="b" xlink:href="#a"/>
    <linearGradient y2="2.5327" x2="14.1158" y1="17.7946" x1="17.659" gradientTransform="rotate(-105 11.2177 15.5445)" gradientUnits="userSpaceOnUse" id="c" xlink:href="#a"/>
    <linearGradient y2="5.1297" x2="6.2886" y1="16.1127" x1="17.2162" gradientTransform="rotate(15 18.6084 26.6946)" gradientUnits="userSpaceOnUse" id="d" xlink:href="#a"/>
`,
  heart: `
    <linearGradient id="e">
      <stop class="color-primary" offset="0" stop-color="#ff005b"/>
      <stop class="color-secondary" offset="1" stop-color="#ff00e4" stop-opacity=".9843"/>
    </linearGradient>
    <linearGradient gradientUnits="userSpaceOnUse" y2="20.5725" x2="15.9935" y1="4.2042" x1="12.8753" id="f" xlink:href="#e"/>`,
  square: `
    <linearGradient id="b">
      <stop class="color-secondary" offset="0" stop-color="#5fd"/>
      <stop class="color-primary" offset="1" stop-color="#3befe8"/>
    </linearGradient>
    <linearGradient id="a">
      <stop class="color-secondary" offset="0" stop-color="#5fd"/>
      <stop class="color-primary" offset="1" stop-color="#0cf"/>
    </linearGradient>
    <linearGradient xlink:href="#a" id="f" gradientUnits="userSpaceOnUse" gradientTransform="rotate(45 3.692 13.23)" x1="4.126" y1="10.97" x2="12.653" y2="12.746"/>
    <linearGradient xlink:href="#a" id="e" gradientUnits="userSpaceOnUse" gradientTransform="rotate(-45 19.973 6.486)" x1="24.009" y1="1.258" x2="6.456" y2="18.869"/>
    <linearGradient xlink:href="#a" id="d" gradientUnits="userSpaceOnUse" gradientTransform="rotate(-135 13.23 9.279)" x1="17.574" y1="10.419" x2="12.49" y2="9.696"/>
    <linearGradient xlink:href="#a" id="c" gradientUnits="userSpaceOnUse" gradientTransform="rotate(-45 13.23 22.766)" x1="15.711" y1="2.769" x2="11.511" y2="15.047"/>
    <linearGradient xlink:href="#b" id="g" x1="19.962" y1="1.869" x2="19.962" y2="7.468" gradientUnits="userSpaceOnUse" gradientTransform="translate(-6.753 6.725)"/>
  `,
  kite: `
    <linearGradient id="a">
    <stop class="color-secondary" offset="0" stop-color="#5fd"/>
     <stop class="color-primary" offset="1" stop-color="#0cf"/>
    </linearGradient>
    <linearGradient xlink:href="#a" id="g" gradientUnits="userSpaceOnUse" gradientTransform="rotate(45 45.101 49.789)" x1="20.896" y1="8.919" x2="13.883" y2="6.051"/>
    <linearGradient xlink:href="#a" id="f" gradientUnits="userSpaceOnUse" gradientTransform="rotate(135 31.877 12.388)" x1="14.14" y1="10.931" x2="14.156" y2="4.928"/>
  `,
  dropShadow: `
    <filter id="drop-shadow-filter" height="100" width="100" filterUnits="userSpaceOnUse"  color-interpolation-filters="sRGB">
      <feFlood flood-opacity="1" flood-color="#000" result="flood"/>
      <feComposite in="flood" in2="SourceGraphic" operator="in" result="composite1"/>
      <feGaussianBlur in="composite1" result="blur"/>
      <feOffset dy="1.8" result="offset"/>
      <feComposite in="SourceGraphic" in2="offset" result="composite2"/>
    </filter>
    <filter id="drop-shadow-filter-slash" height="100" width="100" filterUnits="userSpaceOnUse"  color-interpolation-filters="sRGB">
      <feFlood flood-opacity="1" flood-color="rgba(0, 0, 0, 0.35)" result="flood"/>
      <feComposite in="flood" in2="SourceGraphic" operator="in" result="composite1"/>
      <feGaussianBlur in="composite1" result="blur"/>
      <feOffset dy="0.7" result="offset"/>
      <feComposite in="SourceGraphic" in2="offset" result="composite2"/>
    </filter>    

    `,
};

const shapesDefs = [
  "cross",
  "circle",
  "triangle",
  "heart",
  // "square",
  // "kite",
  "primaryColor",
  "secondaryColor",
];

export default new SvgDefsView();
