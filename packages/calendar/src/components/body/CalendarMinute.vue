<template>
  <div
    @click="!disabled ? click($event) : undefined"
    @mousedown="!disabled ? mouseDown($event) : undefined"
    class="calendar-hour__minute"
    :class="computedClass"
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { calendarDayItemLogic } from "@/logic/calendar-day-item.logic";
import { draggableItemLogic } from "@/logic/draggable-item.logic";
import { timeLogic } from "@/logic/time.logic";
import { CalendarDayItem } from "types/logic/calendar-day-item";
import { CalendarHour } from "types/logic/calendar-hour";
import { MinuteInterval } from "types/logic/minute-interval";
import { Vue, Component, Prop, Mixins, Emit } from "vue-property-decorator";
import DragTrackerMixin from "../DragTrackerMixin";
import { areaSelectLogic } from "@/logic/area-select.logic";
import { EnumCalendarDayItemPosition } from "../../../types/statics/calendar-day-item-position.enum";
import { resizeLogic } from "@/logic/resize.logic";
import { calendarDayLogic } from "@/logic/calendar-day.logic";

@Component
export default class CalendarMinuteComponent extends Mixins(DragTrackerMixin) {
  @Prop({ required: true }) readonly minute: MinuteInterval;
  @Prop({ type: Boolean, default: false }) readonly isClickable: boolean;
  @Prop({ type: Boolean, default: false }) readonly isAreaSelectable: boolean;
  @Prop({ type: Boolean, default: false }) readonly disabled: boolean;
  @Prop({ required: true, type: String }) readonly startTime: string;
  @Prop({ required: true, type: String }) readonly endTime: string;
  @Prop({ required: true, type: Number }) readonly hourHeight: number;
  @Prop({ required: true, type: Number }) readonly minuteInterval: number;
  @Prop({ default: EnumCalendarDayItemPosition.Relative })
  readonly newItemPosition: EnumCalendarDayItemPosition;
  @Prop({ required: true }) readonly items: CalendarDayItem[];

  lastTopOffset: number = 0;
  isSelecting: boolean = false;

  limits: { top: number; bottom: number } = {
    top: 0,
    bottom: 0,
  };

  get topOffset() {
    return calendarDayItemLogic.calculateDistance({
      from: this.startTime,
      to: this.minute.from,
      hourHeight: this.hourHeight,
    });
  }

  get computedClass() {
    return {
      clickable: this.isClickable && !this.disabled,
    };
  }

  click() {
    if (this.disabled || !this.isClickable) return;

    this.$emit("click", this.minute);
  }

  minuteHeight() {
    return this.$el.clientHeight ?? 0;
  }

  calculateLimits() {
    const containerHeight = calendarDayItemLogic.calculateDistance({
      from: this.startTime,
      to: this.endTime,
      hourHeight: this.hourHeight,
    });

    const blockingItems = calendarDayLogic.filterBlockingItems(
      { id: 0, position: this.newItemPosition } as CalendarDayItem,
      this.items
    );

    this.limits = areaSelectLogic.findLimits({
      containerHeight,
      currentPosition: this.topOffset,
      items: blockingItems,
    });
  }

  mouseDown(ev: MouseEvent) {
    if (this.disabled || !this.isAreaSelectable) return;

    this.calculateLimits();
    this.calculateMouseFirstTopOffset(ev, this.topOffset);
    this.createMouseMoveListener();
    this.createMouseUpListener();
  }

  mouseMove(ev: MouseEvent) {
    ev.preventDefault();
    const newTopOffset = this.calculateNewTopOffset(ev.pageY);

    if (!this.isNewTopOffsetValid(newTopOffset)) return;

    const clone = this.createClone(newTopOffset);
    this.selectArea(clone);

    this.lastTopOffset = newTopOffset;
    this.isSelecting = true;
  }

  isNewTopOffsetValid(newTopOffset: number) {
    return areaSelectLogic.isNewTopOffsetValid({
      newTopOffset,
      lastTopOffset: this.lastTopOffset,
      firstTopOffset: this.topOffset,
      minuteHeight: this.minuteHeight(),
      limits: this.limits,
    });
  }

  isHeightValid(newTopOffset: number) {
    return areaSelectLogic.isHeightValid({
      firstTopOffset: this.topOffset,
      newTopOffset,
      minuteHeight: this.minuteHeight(),
    });
  }

  calculateNewTopOffset(pageY: number) {
    let newTopOffset = draggableItemLogic.calculateNewTop(
      pageY,
      this.mouseFirstTopOffset
    );

    newTopOffset = draggableItemLogic.snapToMinute({
      topOffset: newTopOffset,
      minuteInterval: this.minuteInterval,
      hourHeight: this.hourHeight,
    });

    return newTopOffset;
  }

  createClone(newTopOffset: number): CalendarDayItem {
    let item = calendarDayItemLogic.createDefaultModel();
    item.position = this.newItemPosition;

    const positions = areaSelectLogic.calculatePositions(
      newTopOffset,
      this.topOffset
    );

    item = calendarDayItemLogic.updateItemTimeValues({
      item,
      newTopOffset: positions.topOffset,
      hourHeight: this.hourHeight,
      startTime: this.startTime,
      newHeight: positions.height,
    });

    return item;
  }

  mouseUp() {
    this.removeListeners();

    if (!this.isHeightValid(this.lastTopOffset) || !this.isSelecting) return;

    const clone = this.createClone(this.lastTopOffset);
    this.lastTopOffset = 0;
    this.isSelecting = false;

    this.selectAreaFinish(clone);
  }

  @Emit()
  selectArea(item: CalendarDayItem) {}

  @Emit()
  selectAreaFinish(item: CalendarDayItem) {}
}
</script>
<style lang="scss">
@import "@/style/definitions.scss";

.calendar-hour__minute {
  flex: 1;
  box-sizing: border-box;
  &:not(:last-child) {
    border-bottom: 1px dashed $border-color-soft;
  }
  &.clickable {
    @include clickable;
  }
}
</style>
