<template>
  <div @mousedown.stop="mouseDown" class="vertica-resize-handle"></div>
</template>
<script lang="ts">
import { draggableItemLogic } from "@/logic/draggable-item.logic";
import { Component, Emit, Mixins, Prop, Vue } from "vue-property-decorator";
import DragTrackerMixin from "./DragTrackerMixin";

@Component
export default class VerticalResizeHandlerComponent extends Mixins(
  DragTrackerMixin
) {
  @Prop({ type: Number, required: true }) readonly minTopOffset: number;
  @Prop({ type: Number, required: true }) readonly topOffset: number;
  @Prop({ type: Number, required: true }) readonly minuteInterval: number;
  @Prop({ type: Number, required: true }) readonly hourHeight: number;

  mouseDown(ev: MouseEvent) {
    this.calculateMouseFirstTopOffset(ev, this.topOffset);
    this.resizeStart();
    this.createMouseMoveListener();
    this.createMouseUpListener();
  }

  mouseMove(ev: MouseEvent) {
    ev.preventDefault();
    const newTopOffset = this.calculateNewTopOffset(ev.pageY);

    if (this.isNewTopOffsetValid(newTopOffset)) this.resize(newTopOffset);
  }

  isNewTopOffsetValid(newTopOffset: number) {
    return this.topOffset != newTopOffset && newTopOffset >= this.minTopOffset;
  }

  calculateNewTopOffset(pageY: number) {
    let newTopOffset = draggableItemLogic.calculateNewTop(
      pageY,
      this.mouseFirstTopOffset
    );

    return draggableItemLogic.snapToMinute({
      topOffset: newTopOffset,
      minuteInterval: this.minuteInterval,
      hourHeight: this.hourHeight,
    });
  }

  mouseUp() {
    this.removeListeners();
    this.resizeEnd();
  }

  @Emit()
  resizeStart() {}

  @Emit()
  resize(offset: number) {}

  @Emit()
  resizeEnd() {}
}
</script>
<style scoped>
.vertica-resize-handle {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 5px;
  max-height: 100%;
  cursor: n-resize;
}
</style>
