import { calendarDayItemLogic } from "./calendar-day-item.logic";
import { CalendarDayItem } from "../../types/logic/calendar-day-item";

import cloneDeep from "lodash.clonedeep";

class DraggableItemLogic {
  snapToMinute(options: {
    topOffset: number;
    minuteInterval: number;
    hourHeight: number;
  }): number {
    const heightPerMinute = calendarDayItemLogic.calculateHeightPerMinute(
      options.hourHeight
    );

    const minuteHeight = heightPerMinute * options.minuteInterval;

    const remaining = options.topOffset % minuteHeight;

    let result;

    if (remaining < minuteHeight / 2) result = options.topOffset - remaining;
    else result = minuteHeight - remaining + options.topOffset;

    return Math.round(result);
  }

  calculateRelativeTop(pageY: number, topOffset: number): number {
    return topOffset - pageY;
  }

  calculateNewTop(pageY: number, firstTopOffset: number): number {
    return Math.round(pageY + firstTopOffset);
  }

  createClone(item: CalendarDayItem): CalendarDayItem {
    let clone = cloneDeep(item);
    clone.isDraggable = false;
    clone.isResizable = false;
    clone.isClickable = false;
    clone.zIndex = 20;
    return clone;
  }

  calculateBottom(top: number, height: number): number {
    return top + height;
  }

  calculateOverflow(options: {
    top: number;
    height: number;
    containerHeight: number;
  }): number {
    return (
      this.calculateBottom(options.top, options.height) -
      options.containerHeight
    );
  }

  fixBottomOverflow(options: {
    top: number;
    height: number;
    containerHeight: number;
    resizeToFix: boolean;
  }): { top: number; height: number } {
    let overFlow = this.calculateOverflow(options);

    if (overFlow <= 0)
      return {
        top: options.top,
        height: options.height,
      };

    let newTop = options.top;
    let newHeight = options.height;

    const isTopOutOfContainer = options.top >= options.containerHeight;
    if (isTopOutOfContainer) newTop = Math.max(newTop - overFlow, 0);

    overFlow = this.calculateOverflow({
      top: newTop,
      height: newHeight,
      containerHeight: options.containerHeight,
    });

    const isBiggerThenContainer = newHeight > options.containerHeight;
    if (isBiggerThenContainer) newHeight = options.containerHeight;

    overFlow = this.calculateOverflow({
      top: newTop,
      height: newHeight,
      containerHeight: options.containerHeight,
    });

    if (options.resizeToFix)
      return {
        top: newTop,
        height: newHeight - overFlow,
      };

    return {
      top: newTop - overFlow,
      height: newHeight,
    };
  }

  keepInsideContainer(options: {
    topOffset: number;
    height: number;
    startTime: string;
    endTime: string;
    hourHeight: number;
    resizeToFix: boolean;
  }): { top: number; height: number } {
    const totalHeight = calendarDayItemLogic.calculateDistance({
      from: options.startTime,
      to: options.endTime,
      hourHeight: options.hourHeight,
    });

    if (options.topOffset < 0)
      return {
        top: 0,
        height: options.height,
      };

    return this.fixBottomOverflow({
      top: options.topOffset,
      containerHeight: totalHeight,
      height: options.height,
      resizeToFix: options.resizeToFix,
    });
  }
}

export const draggableItemLogic = new DraggableItemLogic();
