import { dom } from "../dom";
import { createHTMLFromString, collapseAria } from "../../../utils/index";
import { controllerList } from "./controllers/list";
import { valideKeyInput } from "../../appControllers";
import { ariaExpandDropdown, ariaCollapseDropdown } from "./views/aria";
import addEscapeHatch from "../../../utils/addEscapeHatch";

export const onDropDown = (e: Event) => {
  if (!valideKeyInput(e)) return null;
  const target = e.currentTarget as HTMLElement;
  e.preventDefault();
  e.stopPropagation();

  const btnDropDown = <HTMLDivElement>(
    document.querySelector("." + dom.class.btnDifficultyDDContainer)
  );
  if (!btnDropDown) return null;

  const createDropDown = () => {
    const dropDown = document.querySelector("." + dom.class.dropDownDifficulty);
    if (!dropDown) {
      const string = dom.html.btnBotDropdown;
      const el = <HTMLElement>createHTMLFromString(string);
      btnDropDown.appendChild(el);
      const isWithinView = withinViewPort(el);
      moveElement(el, isWithinView ? "bottom" : "top");
      onDropDownSettings();
      ariaExpandDropdown();
    }
  };

  addEscapeHatch({
    target,
    build: createDropDown,
    onStart: e => {
      const targetGlobal = e.event.target as HTMLElement;
      if (e.event.type === "keyup") {
        if (targetGlobal.closest("." + dom.class.dropDownDifficulty)) {
          return false;
        }
      }
      return true;
    },
    onExit: () => {
      const dropDown = document.querySelector(
        "." + dom.class.dropDownDifficulty
      )!;
      btnDropDown.removeChild(dropDown);
      ariaCollapseDropdown();
    }
  });
};

export const removeDropDown = ({ refocus }: { refocus?: boolean } = {}) => {
  const btnDropDown = <HTMLDivElement>(
    document.querySelector("." + dom.class.btnDifficultyDDContainer)
  );
  const dropDown = document.querySelector("." + dom.class.dropDownDifficulty);
  if (!dropDown || !btnDropDown) return null;
  btnDropDown.removeChild(dropDown);
  if (refocus) {
    const btn = <HTMLElement>btnDropDown.firstElementChild;
    btn.focus();
  }
};

export const onDropDownSettings = () => {
  const settings = document.querySelector(dom.class.dropDownSettings);
  if (!settings) return null;
  const list = Array.from(settings.children);
  // const list = [...settings.children]

  list.forEach(list => controllerList(list as HTMLElement));
};

export const withinViewPort = (el: HTMLElement, spacing: number = 5) => {
  const browserInnerHeight =
    window.innerHeight || document.documentElement.clientHeight;

  const { bottom } = el.getBoundingClientRect();
  const isTop = el.classList.contains("position-top");
  const topTranslate = 1.3;

  if (isTop) {
    return bottom * topTranslate + spacing < browserInnerHeight;
  }

  return bottom + spacing < browserInnerHeight;
};

export const moveElement = (el: Element, position: "top" | "bottom") => {
  if (position === "top") {
    el.classList.add("position-top");
    el.classList.remove("hide-v");
  } else {
    el.classList.remove("position-top");
    el.classList.remove("hide-v");
  }
};
