import { draggableItemLogic } from "@/logic/draggable-item.logic";
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

@Component
export default class DragTrackerMixin extends Vue {
  mouseFirstTopOffset: number = 0;

  calculateMouseFirstTopOffset(ev: MouseEvent, topOffset: number) {
    this.mouseFirstTopOffset = draggableItemLogic.calculateRelativeTop(
      ev.pageY,
      topOffset
    );
  }

  createMouseMoveListener() {
    document.addEventListener("mousemove", this.mouseMove);
  }

  createMouseUpListener() {
    document.addEventListener("mouseup", this.mouseUp);
  }

  mouseMove(ev: MouseEvent) {
    ev.preventDefault();
  }

  mouseUp() {
    this.removeListeners();
  }

  removeListeners() {
    this.removeMouseMoveListener();
    this.removeMouseUpListener();
  }

  removeMouseMoveListener() {
    document.removeEventListener("mousemove", this.mouseMove);
  }

  removeMouseUpListener() {
    document.removeEventListener("mouseup", this.mouseUp);
  }

  beforeDestroy() {
    this.removeListeners();
  }
}
