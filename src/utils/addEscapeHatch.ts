interface IAddEscapeHatch {
  element: Element;
  exceptionByElement?: Element;
  onExit?: () => void;
  onRemove?: Function;
  onStart?: (e: IEvent) => boolean;
  allowToggle?: boolean;
  isKeyDown?: boolean;
}

type TListeners = {
  removeOnClick: (e: TouchEvent | MouseEvent) => void;
  removeOnEscapeKey: (e: KeyboardEvent) => void;
  removeOnKeyUp: (e: KeyboardEvent) => void;
};
interface IEvent {
  event: MouseEvent | TouchEvent | KeyboardEvent;
  element: Element | null;
  parentOfRemovedElement: Element | null;
  keepElementRef: () => void;
  removeAll: () => void;
}
interface IRef {
  stopPropagation?: boolean;
  nodes: {
    onExitWithTearDown: Function;
    onStart?: (e: IEvent) => boolean;
    onExit?: () => void;
    element: Element;
  }[];
  onTouch?: (e: TouchEvent) => void;
  usedClick: boolean;
  currentIdx: number;
}

let ref = <IRef>{
  nodes: [],
  currentIdx: 0,
  usedClick: false
};

const customEvent = <IEvent>{
  removeAll: () => {
    for (let i = ref.nodes.length - 1; i >= 0; i--) {
      ref.nodes[i].onExitWithTearDown();
    }
  }
};

const stopPropagation = () => {
  if (ref.stopPropagation) {
    ref.stopPropagation = false;
    return true;
  }

  return false;
};

const onExitWithTearDown = () => {
  const idx = ref.nodes.length - 1;
  if (!ref.nodes.length) return null;
  const { onExit } = ref.nodes[idx];
  if (onExit) onExit();
  ref.nodes.pop();
};
const removeListeners = ({
  removeOnClick,
  removeOnEscapeKey,
  removeOnKeyUp
}: TListeners) => {
  document.removeEventListener("click", removeOnClick, true);
  document.removeEventListener("keydown", removeOnEscapeKey, true);
  document.removeEventListener("keyup", removeOnKeyUp, true);
  if (ref.onTouch) {
    document.removeEventListener("touchstart", ref.onTouch!, true);
  }
};

const addListeners = ({
  removeOnClick,
  removeOnEscapeKey,
  removeOnKeyUp
}: TListeners) => {
  document.addEventListener("click", removeOnClick, true);
  document.addEventListener("keydown", removeOnEscapeKey, true);
  document.addEventListener("keyup", removeOnKeyUp, true);

  if (ref.usedClick) return null;

  ref.onTouch = () => {
    let isMove = false;
    const onMove = () => (isMove = true);
    const onEnd = (e: TouchEvent) => {
      const removeAllTouchEvents = () => {
        document.removeEventListener("touchmove", onMove, true);
        document.removeEventListener("touchend", onEnd, true);
      };
      if (isMove) {
        removeAllTouchEvents();
      }
      removeOnClick(e);
      removeAllTouchEvents();
    };
    document.addEventListener("touchmove", onMove, true);
    document.addEventListener("touchend", onEnd, true);
  };
  document.addEventListener("touchstart", ref.onTouch, true);
};

const parentContains = (element: Element) => {
  if (!ref.nodes.length) return false;

  const parent = ref.nodes[ref.nodes.length - 1].element;

  return parent.contains(element);
};
let areEventListenersAdded = false;

export default function addEscapeHatch({
  element,
  onExit,
  onStart,
  onRemove,
  allowToggle = true
}: IAddEscapeHatch) {
  if (parentContains(element)) {
    ref.nodes.pop();

    console.log("event already exist");
    return null;
  }

  const removeOnClick = (e: TouchEvent | MouseEvent) => {
    const clickedTarget = e.target as HTMLElement;
    customEvent.event = e;
    ref.usedClick = true;

    for (let i = ref.nodes.length - 1; i >= 0; i--) {
      const { onStart, element } = ref.nodes[i];
      if (onStart && !onStart(customEvent)) continue;
      if (element.contains(clickedTarget)) {
        console.log("same");
        continue;
      }
      console.log("remove listeners");
      onExitWithTearDown();
    }
    console.log(`Callback list length: ${ref.nodes.length}`);
    customEvent.parentOfRemovedElement = null;
    if (!ref.nodes.length) {
      removeListeners({ removeOnClick, removeOnEscapeKey, removeOnKeyUp });
      areEventListenersAdded = false;
    }
  };
  const removeOnEscapeKey = (e: KeyboardEvent) => {
    const clickedTarget = e.target as HTMLElement;
    customEvent.event = e;

    console.log("keydown");

    for (let i = ref.nodes.length - 1; i >= 0; i--) {
      if (e.key.match(/escape/i)) {
        onExitWithTearDown();
        continue;
      }

      if (!e.key.match(/enter/i)) return null;
      const { onStart, element } = ref.nodes[i];
      if (onStart && !onStart(customEvent)) continue;
      if (element.contains(clickedTarget)) {
        console.log("same");
        continue;
      }
      console.log("remove listeners");
      onExitWithTearDown();
    }
    console.log(`Callback list length: ${ref.nodes.length}`);
    customEvent.parentOfRemovedElement = null;
    if (!ref.nodes.length) {
      removeListeners({ removeOnClick, removeOnEscapeKey, removeOnKeyUp });
      areEventListenersAdded = false;
    }
  };
  const removeOnKeyUp = (e: KeyboardEvent) => {
    if (stopPropagation()) return null;
    const clickedTarget = e.target as HTMLElement;
    customEvent.event = e;

    console.log("keyup");

    for (let i = ref.nodes.length - 1; i >= 0; i--) {
      if (!e.key.match(/tab/i)) return null;

      const { onStart, element } = ref.nodes[i];

      console.log("tabbing");
      if (onStart && !onStart(customEvent)) continue;
      if (element.contains(clickedTarget)) {
        console.log("same");
        continue;
      }
      console.log("remove listeners");
      onExitWithTearDown();
    }
    console.log(`Callback list length: ${ref.nodes.length}`);
    customEvent.parentOfRemovedElement = null;
    ref.stopPropagation = false;
    if (!ref.nodes.length) {
      removeListeners({ removeOnClick, removeOnEscapeKey, removeOnKeyUp });
      areEventListenersAdded = false;
    }
  };
  console.log("added");
  // ref.element = element;
  ref.nodes.push({
    element,
    onStart,
    onExit,
    onExitWithTearDown
  });
  // event.stopPropagation doesn't stop created keyup listener from fireing
  ref.stopPropagation = true;

  if (!areEventListenersAdded) {
    addListeners({ removeOnClick, removeOnEscapeKey, removeOnKeyUp });
    areEventListenersAdded = true;
  }

  // return {
  //   remove() {
  //     if (onRemove) onRemove();

  //     // removeListeners();
  //     ref.nodes.pop();
  //   }
  // };
}