import { CalendarHour } from './calendar-hour';
import type { TimeInterval } from "./time-interval";

interface MinuteInterval extends TimeInterval {
  text: string;
  interval?: number
  hour?: CalendarHour
}

export type { MinuteInterval };
