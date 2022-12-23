import { TimeInterval } from "../../types/logic/time-interval";
import { TimeSpan } from "../../types/logic/time-span";

class TimeLogic {
  getTimeSpan(timeSpanText: string): TimeSpan {
    const splitted = timeSpanText.split(":");

    if (splitted.length >= 2)
      return {
        hour: +splitted[0],
        minute: +splitted[1],
      };

    throw `${timeSpanText} is not a valid timespan`;
  }

  createTimeSpanText(timeSpan: TimeSpan) {
    const hourText = this.createTwoDigitText(timeSpan.hour);
    const minuteText = this.createTwoDigitText(timeSpan.minute);

    return `${hourText}:${minuteText}`;
  }

  totalMinutesInTimeSpan(timeSpanText: string): number {
    const timeSpan = this.getTimeSpan(timeSpanText);
    return timeSpan.hour * 60 + timeSpan.minute;
  }

  createTwoDigitText(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  addMinutesToTimeSpan(timeSpan: TimeSpan, minute: number): TimeSpan {
    const minutesToAdd = timeSpan.minute + minute;
    const hoursToAdd = Math.floor(minutesToAdd / 60);
    let remainingMinutes = minutesToAdd % 60;
    if (remainingMinutes < 0) {
      remainingMinutes += 60;
    }

    let totalHour = timeSpan.hour + hoursToAdd;

    if (totalHour > 23) totalHour %= 24;
    if (totalHour < 0) totalHour += 24;

    return {
      hour: totalHour,
      minute: remainingMinutes,
    };
  }

  addMinutesToTimeSpanText(timeSpanText: string, minute: number): string {
    const timeSpan = this.getTimeSpan(timeSpanText);
    const newTimeSpan = this.addMinutesToTimeSpan(timeSpan, minute);

    return this.createTimeSpanText(newTimeSpan);
  }

  updateTimeInterval(fromTo: TimeInterval, newFrom: string): TimeInterval {
    const fromMinutes = this.totalMinutesInTimeSpan(fromTo.from);
    const toMinutes = this.totalMinutesInTimeSpan(fromTo.to);

    const difference = toMinutes - fromMinutes;
    const newTo = this.addMinutesToTimeSpanText(newFrom, difference);

    return {
      from: newFrom,
      to: newTo,
    };
  }

  detectCollision(
    timeInterval: TimeInterval,
    timeInterval2: TimeInterval
  ): boolean {
    return (
      timeInterval.to > timeInterval2.from &&
      timeInterval.from < timeInterval2.to
    );
  }
}

export const timeLogic = new TimeLogic();
