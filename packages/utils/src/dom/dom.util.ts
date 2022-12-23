import { positionCalculator } from "../position-calculate/position-calculate.util";

export class DomUtil {
  findParentElement(el: HTMLElement, classValue?: string, id?: string): HTMLElement | null {
    if (!classValue && !id) return null;

    let parentEl = el.parentElement;
    while (parentEl) {
      if (
        (id && parentEl.getAttribute("id") == id) ||
        (classValue && parentEl.classList && parentEl.classList.contains(classValue))
      ) {
        break;
      } else {
        parentEl = parentEl.parentElement;
      }
    }

    return parentEl;
  }

  randomColor() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    return `rgb(${r},${g},${b})`;
  }

  touchPositionInelement(event: TouchEvent, parent: HTMLElement) {
    let canvasOffset = positionCalculator.offset(parent);
    let firstTouch = event.touches[0];
    let x = firstTouch.clientX - canvasOffset.left;
    let y = firstTouch.clientY - canvasOffset.top;
    return { x, y };
  }

  checkIsAtTheBottom(options: { offsetHeight: number; scrollTop: number; margin: number; scrollHeight: number }) {
    return options.offsetHeight + options.scrollTop + options.margin >= options.scrollHeight;
  }

  handleInfineteScroll(element: HTMLElement, callback: (scrollTop?: number) => void, margin: number = 20) {
    let prevScrollTop = 0;
    const listener = (e: Event) => {
      let scrollTop = element.scrollTop;
      let offsetHeight = element.offsetHeight;
      let scrollHeight = element.scrollHeight;

      const isNewScrollBigger = scrollTop > prevScrollTop;

      const isAtTheBottom = this.checkIsAtTheBottom({
        scrollHeight,
        scrollTop,
        offsetHeight,
        margin,
      });

      if (isAtTheBottom && isNewScrollBigger) {
        callback(scrollTop);
      }
      prevScrollTop = scrollTop;
    };
    element.addEventListener("scroll", listener);
    return listener;
  }

  removeScrollEvent(el:HTMLElement,listener:(e:Event) => void){
    el.removeEventListener('scroll',listener)
  }
}

export const domUtil = new DomUtil();
