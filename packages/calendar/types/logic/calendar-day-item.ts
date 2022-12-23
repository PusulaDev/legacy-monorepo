import { CalendarEvent } from "./calendar-event";

interface CalendarDayItemPosition {
  order: number;
  topOffset: number;
  height: number;
  leftOffset: number;
  width: number;
  zIndex: number;
}

interface CalendarDayItem<T = undefined>
  extends CalendarEvent<T>,
    CalendarDayItemPosition {
  closestBlockingPosition?: number;
  cannotDrop:boolean
}

export type { CalendarDayItem, CalendarDayItemPosition };
