import { TimeInterval } from "../../types/logic";
import { timeLogic } from "./time.logic";

class CalendarEventLogic {
  filterCollidedItems<T extends TimeInterval>(item: T, allItems: T[]): T[] {
    return allItems.filter((ai) => timeLogic.detectCollision(ai, item));
  }
}

export const calendarEventLogic = new CalendarEventLogic();
