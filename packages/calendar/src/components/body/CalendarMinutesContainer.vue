<template>
  <div class="calendar-hours">
    <calendar-minute
      v-for="minute in allMinutes"
      @select-area="selectArea"
      @select-area-finish="selectAreaFinished"
      @click="minuteClick"
      :key="`${minute.hour.value}_${minute.text}`"
      :minute="minute"
      :is-clickable="isMinutesClickable"
      :is-area-selectable="isAreaSelectable"
      :start-time="startTime"
      :end-time="endTime"
      :hour-height="hourHeight"
      :minute-interval="minuteInterval"
      :disabled="isActionsDisabled"
      :new-item-position="newItemPosition"
      :items="items"
      :style="minuteStyle(minute.interval)"
      class="calendar-hour__minute"
    >
      <slot name="minute" :minute="minute" :hour="minute.hour"></slot>
    </calendar-minute>

    <calendar-item
      v-for="item in items"
      :key="item.id"
      :item="item"
      :hour-height="hourHeight"
      :minute-interval="minuteInterval"
      :is-clone-visible.sync="isCloneVisible"
      :clone-item.sync="cloneItem"
      :start-time="startTime"
      :end-time="endTime"
      :disabled="isActionsDisabled"
      @move="itemMove"
      @click="itemClick"
      @drop="itemDrop"
      @resize="resize"
      @mouse-over="mouseOver"
      @mouse-leave="mouseLeave"
    >
      <template>
        <slot name="item" :item="item"></slot>
      </template>
    </calendar-item>

    <calendar-item
      v-if="isCloneVisible"
      is-ghost
      key="ghost"
      :item="cloneItem"
    />
  </div>
</template>
<script lang="ts">
import { calendarDayLogic } from "@/logic/calendar-day.logic";
import { CalendarDayItem } from "types/logic/calendar-day-item";
import { CalendarEvent } from "types/logic/calendar-event";
import { calendarHourLogic } from "@/logic/calendar-hour.logic";
import {
  Component,
  Emit,
  Mixins,
  Prop,
  Vue,
  Watch,
} from "vue-property-decorator";
import CalendarHourMixin from "./CalendarHourMixin";
import CalendarItemComponent from "@/components/item/CalendarItem.vue";
import { calendarDayItemLogic } from "@/logic/calendar-day-item.logic";
import { CalendarDayEventOptions } from "../../../types/components/calendar-day-event-options";
import CalendarMinuteComponent from "./CalendarMinute.vue";
import { EnumCalendarDayItemPosition } from "../../../types/statics/calendar-day-item-position.enum";
import { MinuteInterval } from "types/logic";

@Component({
  components: {
    "calendar-item": CalendarItemComponent,
    "calendar-minute": CalendarMinuteComponent,
  },
})
export default class CalendarMinutesContainerComponent extends Mixins(
  CalendarHourMixin
) {
  @Prop({ required: true, default: () => [] }) readonly events: CalendarEvent[];
  @Prop({ type: Number, default: 4 })
  readonly horizontalMarginBetweenItems!: number;
  @Prop({ type: Number, default: 20 })
  readonly hourPaddingRight: number;
  @Prop({ type: Boolean, default: false }) readonly isActionsDisabled: boolean;
  @Prop({ type: Boolean, default: false }) readonly isMinutesClickable: boolean;
  @Prop({ type: Boolean, default: false }) readonly isAreaSelectable: boolean;
  @Prop({ default: EnumCalendarDayItemPosition.Relative })
  readonly newItemPosition: EnumCalendarDayItemPosition;

  items: CalendarDayItem[] = [];
  allMinutes: MinuteInterval[] = [];

  isCloneVisible: boolean = false;
  cloneItem: CalendarDayItem = calendarDayItemLogic.createDefaultModel();

  get minuteStyle() {
    return (interval: number) => {
      const currentMinuteInPixel = (interval * this.hourHeight) / 60;
      return { height: `${currentMinuteInPixel}px` };
    };
  }

  get mappedEvents() {
    return calendarHourLogic.mapEvents(
      this.events,
      this.endTime,
      this.startTime
    );
  }

  get minutes() {
    return calendarHourLogic.createAllMinutes(
      this.startTime,
      this.endTime,
      this.minuteInterval
    );
  }

  async mounted() {
    await this.$nextTick();
    this.createAllMinutes();
    this.createItems();
  }

  @Watch("events", { deep: true })
  onEventsChanged() {
    this.createItems();
  }

  createAllMinutes() {
    this.allMinutes = this.minutes;
  }

  calculateAvailableWidth(): number {
    return this.getContainerWidth() ?? 0;
  }

  createItems() {
    const availableWidth = this.calculateAvailableWidth();

    this.items = calendarDayLogic.createItems({
      events: this.mappedEvents,
      startTime: this.startTime,
      hourHeight: this.hourHeight,
      containerWidth: availableWidth,
      marginBetweenItems: this.horizontalMarginBetweenItems,
      hourPaddingRight: this.hourPaddingRight,
    });
  }

  clearClone() {
    this.cloneItem = calendarDayItemLogic.createDefaultModel();
  }

  hideClone() {
    this.isCloneVisible = false;
  }

  getContainerWidth() {
    return this.$el?.clientWidth ?? 0;
  }

  filterCollidedItems(item: CalendarDayItem) {
    return calendarDayLogic.filterCollidedItems(item, this.items);
  }

  filterBlockingCollidedItems(item: CalendarDayItem) {
    return calendarDayLogic.filterBLockingCollidedItems(item, this.items);
  }

  itemMove(item: CalendarDayItem, el: HTMLElement) {
    const blockingCollidedItems = this.filterBlockingCollidedItems(
      this.cloneItem
    );

    this.cloneItem.cannotDrop = !!blockingCollidedItems.length;
  }

  itemClick(item: CalendarDayItem, el: HTMLElement) {
    const collidedItems = this.filterCollidedItems(item);

    const options: CalendarDayEventOptions = {
      item,
      collidedItems,
      el,
    };
    this.$emit("item-click", options);
    this.clearClone();
  }

  itemDrop(item: CalendarDayItem, el: HTMLElement) {
    const collidedItems = this.filterCollidedItems(item);
    const blockingCollidedItems = this.filterBlockingCollidedItems(item);

    const options: CalendarDayEventOptions = {
      item,
      collidedItems,
      blockingCollidedItems,
      el,
    };
    this.$emit("item-drop", options);
    this.clearClone();
  }

  resize(item: CalendarDayItem, el: HTMLElement) {
    const collidedItems = this.filterCollidedItems(item);

    const options: CalendarDayEventOptions = {
      item,
      collidedItems,
      el,
    };
    this.$emit("item-resize", options);
    this.clearClone();
  }

  selectArea(item: CalendarDayItem) {
    const availableWidth = this.calculateAvailableWidth();

    item.width = availableWidth;

    this.cloneItem = item;
    this.isCloneVisible = true;
  }

  selectAreaFinished(item: CalendarDayItem) {
    const collidedItems = this.filterCollidedItems(item);

    const options: CalendarDayEventOptions = {
      item,
      collidedItems,
    };
    this.$emit("area-select", options);
    this.clearClone();
    this.hideClone();
  }

  mouseOver(item: CalendarDayItem, el: HTMLElement) {
    this.$emit("mouse-over", item, el);
  }

  mouseLeave(item: CalendarDayItem, el: HTMLElement) {
    this.$emit("mouse-leave", item, el);
  }

  @Emit()
  minuteClick(minute: MinuteInterval) {}
}
</script>
<style scoped lang="scss">
@import "@/style/definitions.scss";

.calendar-hours {
  flex: 1;
  position: relative;
  .calendar-hour__minute {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-content: space-around;
  }
}
</style>
