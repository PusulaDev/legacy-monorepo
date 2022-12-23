import cloneDeep from "lodash.clonedeep";
import { EnumCalendarDayItemPosition } from "../../types/statics/calendar-day-item-position.enum";
import { timeLogic } from "./time.logic";
import {
  CalendarDayItem,
  CalendarDayItemPosition,
} from "../../types/logic/calendar-day-item";

class CalendarDayItemLogic {
  readonly defaultItemColor: string = "rgba(255,255,255,0.5)";

  createDefaultModel = (): CalendarDayItem => ({
    id: 0,
    color: this.defaultItemColor,
    from: "",
    to: "",
    height: 0,
    leftOffset: 0,
    order: 0,
    position: EnumCalendarDayItemPosition.Relative,
    title: "",
    isBordered: false,
    isClickable: false,
    topOffset: 0,
    width: 0,
    zIndex: 0,
    borderColor: "",
    borderRadius: "",
    cannotDrop: false,
  });

  isBlocking(
    source: EnumCalendarDayItemPosition,
    target: EnumCalendarDayItemPosition
  ): boolean {
    return source === EnumCalendarDayItemPosition.Absolute
      ? false
      : target === EnumCalendarDayItemPosition.Static;
  }

  calculateHeightPerMinute(heightPerHour: number): number {
    return heightPerHour / 60;
  }

  calculateDistance(options: {
    from: string;
    to: string;
    hourHeight: number;
  }): number {
    const totalFromMinutes = timeLogic.totalMinutesInTimeSpan(options.from);
    const totalToMinutes = timeLogic.totalMinutesInTimeSpan(options.to);

    const difference = totalToMinutes - totalFromMinutes;

    const heightPerMinute = this.calculateHeightPerMinute(options.hourHeight);
    return Math.round(heightPerMinute * difference);
  }

  calculateTopOffset(options: {
    from: string;
    hourHeight: number;
    startTime: string;
  }): number {
    return this.calculateDistance({
      from: options.startTime,
      to: options.from,
      hourHeight: options.hourHeight,
    });
  }

  calculateHeight(options: {
    from: string;
    to: string;
    hourHeight: number;
  }): number {
    return this.calculateDistance(options);
  }

  isCollidable(
    item1: EnumCalendarDayItemPosition,
    item2: EnumCalendarDayItemPosition
  ): boolean {
    return (
      item1 == EnumCalendarDayItemPosition.Relative &&
      item2 == EnumCalendarDayItemPosition.Relative
    );
  }

  detectCollision<T extends CalendarDayItemPosition>(
    item1: T,
    item2: T
  ): boolean {
    const item1Bottom = item1.topOffset + item1.height;
    const item2Bottom = item2.topOffset + item2.height;

    return item1Bottom > item2.topOffset && item1.topOffset < item2Bottom;
  }

  calculateFreeSpaceAtRight(
    hourPaddingRight: number,
    position: EnumCalendarDayItemPosition
  ): number {
    return position === EnumCalendarDayItemPosition.Static
      ? 0
      : hourPaddingRight;
  }

  calculateWidth(options: {
    item: CalendarDayItemPosition;
    marginBetweenItems: number;
    containerWidth: number;
    collidedItemCount: number;
    freeSpaceAtRight?: number;
  }): number {
    const calculatedContainerWidth =
      options.containerWidth - (options.freeSpaceAtRight ?? 0);

    const totalItemCount = options.collidedItemCount + 1;
    const totalMargin = options.collidedItemCount * options.marginBetweenItems;
    const remainingWidth = calculatedContainerWidth - totalMargin;

    const widthPerItem = remainingWidth / totalItemCount;
    return widthPerItem;
  }

  calculateLeft(options: {
    item: CalendarDayItemPosition;
    collidedItems: CalendarDayItemPosition[];
    containerWidth: number;
    marginBetweenItems: number;
    freeSpaceAtRight?: number;
  }): number {
    const widthPerItem = this.calculateWidth({
      collidedItemCount: options.collidedItems.length,
      ...options,
    });

    const sortedItems = [...options.collidedItems, options.item].sort(
      (a, b) => a.order - b.order
    );
    const itemIndex = sortedItems.indexOf(options.item);

    const leftOffset = (widthPerItem + options.marginBetweenItems) * itemIndex;
    return leftOffset;
  }

  calculateTimeSpanFromTopOffset(options: {
    topOffset: number;
    hourHeight: number;
    startTime: string;
  }): string {
    const heightPerMinute = this.calculateHeightPerMinute(options.hourHeight);
    const minutesOffset = Math.round(options.topOffset / heightPerMinute);

    return timeLogic.addMinutesToTimeSpanText(options.startTime, minutesOffset);
  }

  updateItemTimeValues(options: {
    item: CalendarDayItem;
    newTopOffset: number;
    newHeight?: number;
    hourHeight: number;
    startTime: string;
  }): CalendarDayItem {
    const item = cloneDeep(options.item);
    item.topOffset = options.newTopOffset;

    if (options.newHeight) item.height = options.newHeight;

    item.from = this.calculateTimeSpanFromTopOffset({
      hourHeight: options.hourHeight,
      startTime: options.startTime,
      topOffset: options.newTopOffset,
    });

    const newBottom = options.newTopOffset + item.height;

    item.to = this.calculateTimeSpanFromTopOffset({
      hourHeight: options.hourHeight,
      startTime: options.startTime,
      topOffset: newBottom,
    });

    return item;
  }

  isVerticalValuesChanged<T extends CalendarDayItemPosition>(options: {
    item: T;
    topOffset: number;
    height: number;
  }): boolean {
    return (
      options.item.topOffset != options.topOffset ||
      options.item.height != options.height
    );
  }
}

export const calendarDayItemLogic = new CalendarDayItemLogic();
