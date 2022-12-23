import { calendarDayItemLogic } from "./calendar-day-item.logic";
import { draggableItemLogic } from "./draggable-item.logic";
import {
  CalendarDayItem,
  CalendarDayItemPosition,
} from "../../types/logic/calendar-day-item";

class AreaSelectLogic {
  calculatePositions(
    start: number,
    end: number
  ): Pick<CalendarDayItemPosition, "topOffset" | "height"> {
    const topOffset = Math.min(start, end);
    const height = Math.abs(start - end);

    return {
      topOffset,
      height,
    };
  }

  findLimits(options: {
    currentPosition: number;
    items: Pick<CalendarDayItem, "topOffset" | "height">[];
    containerHeight: number;
  }): { top: number; bottom: number } {
    const { currentPosition, items, containerHeight } = options;

    let top = 0;
    let bottom = 0;

    items.forEach((item) => {
      const itemBottom = draggableItemLogic.calculateBottom(
        item.topOffset,
        item.height
      );

      const isInside =
        item.topOffset < currentPosition && itemBottom > currentPosition;

      const isAbove = itemBottom <= currentPosition;
      const isBelow = item.topOffset >= currentPosition;

      if (isInside) {
        top = currentPosition;
        bottom = currentPosition;
        return;
      }

      if (isAbove) top = Math.max(itemBottom, top);
      if (isBelow) bottom = Math.min(item.topOffset, bottom || item.topOffset);
    });

    bottom = Math.min(containerHeight, bottom || containerHeight);

    return { top, bottom };
  }

  isHeightValid(options: {
    firstTopOffset: number;
    newTopOffset: number;
    minuteHeight: number;
  }): boolean {
    const positions = areaSelectLogic.calculatePositions(
      options.newTopOffset,
      options.firstTopOffset
    );

    return positions.height >= options.minuteHeight;
  }

  isNewTopOffsetValid(options: {
    newTopOffset: number;
    lastTopOffset: number;
    firstTopOffset: number;
    minuteHeight: number;
    limits: {
      top: number;
      bottom: number;
    };
  }): boolean {
    const isHeightValid = this.isHeightValid(options);

    if (!isHeightValid) return false;

    const positions = areaSelectLogic.calculatePositions(
      options.newTopOffset,
      options.firstTopOffset
    );

    const isTopOffLimits = positions.topOffset < options.limits.top;
    const isBottomOffLimits =
      draggableItemLogic.calculateBottom(
        positions.topOffset,
        positions.height
      ) > options.limits.bottom;

    return !isTopOffLimits && !isBottomOffLimits;
  }
}

export const areaSelectLogic = new AreaSelectLogic();
