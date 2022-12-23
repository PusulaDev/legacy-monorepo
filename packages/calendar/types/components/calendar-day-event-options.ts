import { CalendarDayItem } from "../logic/calendar-day-item";

export type CalendarDayEventOptions<T = undefined> = {
  item: CalendarDayItem<T>;
  el?: HTMLElement;
  collidedItems: CalendarDayItem<T>[];
  blockingCollidedItems?: CalendarDayItem<T>[];
};
