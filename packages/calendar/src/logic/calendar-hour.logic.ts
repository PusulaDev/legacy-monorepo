import { timeLogic } from './time.logic';
import { CalendarHour } from '../../types/logic/calendar-hour';
import { MinuteInterval } from '../../types/logic/minute-interval';
import { MinuteType } from 'types/logic/minute-composite';
import { CalendarEvent } from 'types/logic';

class CalendarHourLogic {
  static times: MinuteType[] = [];

  createHoursArray(startTime: string, endTime: string): CalendarHour[] {
    const startHour = timeLogic.getTimeSpan(startTime).hour;
    const endHour = timeLogic.getTimeSpan(endTime).hour;
    let hours: CalendarHour[] = [];

    for (let i = startHour; i <= endHour; i++)
      hours.push({
        value: i,
        text: timeLogic.createTwoDigitText(i),
      });

    return hours;
  }

  createAllMinutes(opt: {
    startTime: string;
    endTime: string;
    minuteInterval: number;
    minutesRenderStartTime?: string;
  }): MinuteInterval[] {
    let minutes: MinuteInterval[] = [];

    let start = opt.minutesRenderStartTime ?? opt.startTime;
    const totalMinutes =
      timeLogic.totalMinutesInTimeSpan(opt.endTime) -
      timeLogic.totalMinutesInTimeSpan(start);
    const count = Math.floor(totalMinutes / opt.minuteInterval);

    for (let index = 0; index <= count; index++) {
      let to = timeLogic.addMinutesToTimeSpanText(start, opt.minuteInterval);
      let interval =
        timeLogic.totalMinutesInTimeSpan(to) -
        timeLogic.totalMinutesInTimeSpan(start);

      let startHour = start.split(':')[0];
      let startMinute = start.split(':')[1];

      if (index == count && opt.endTime != to) {
        to = opt.endTime;
        interval =
          timeLogic.totalMinutesInTimeSpan(to) -
          timeLogic.totalMinutesInTimeSpan(start);
      }

      minutes.push({
        from: start,
        to: to,
        interval: interval,
        text: startMinute,
        hour: {
          value: +startHour,
          text: timeLogic.createTwoDigitText(+startHour),
        },
      });
      start = to;
    }

    const minutesRenderStartTimeInterval =
      timeLogic.totalMinutesInTimeSpan(
        opt.minutesRenderStartTime ?? opt.startTime
      ) - timeLogic.totalMinutesInTimeSpan(opt.startTime);

    if (opt.minutesRenderStartTime && minutesRenderStartTimeInterval)
      this.addMinutesRenderStartTimeInterval({
        minutes,
        minutesRenderStartTime: opt.minutesRenderStartTime,
        minutesRenderStartTimeInterval,
        startTime: opt.startTime,
      });

    return minutes;
  }

  addMinutesRenderStartTimeInterval(opt: {
    minutes: MinuteInterval[];
    minutesRenderStartTime: string;
    minutesRenderStartTimeInterval: number;
    startTime: string;
  }) {
    const startHour = opt.startTime.split(':')[0];
    const startMinute = opt.startTime.split(':')[1];

    opt.minutes.unshift({
      from: opt.startTime,
      to: opt.minutesRenderStartTime,
      interval: opt.minutesRenderStartTimeInterval,
      text: startMinute,
      hour: {
        value: +startHour,
        text: timeLogic.createTwoDigitText(+startHour),
      },
    });
  }

  mapEvents(items: CalendarEvent[], endTime: string, startTime: string) {
    const result = items.map((item) => this.mapTime(item, endTime, startTime));
    return result.filter((x) => this.isInInterval(x, endTime, startTime));
  }

  isInInterval(
    item: CalendarEvent,
    endTime: string,
    startTime: string
  ): boolean {
    const toInMinutes = timeLogic.totalMinutesInTimeSpan(item.to);
    const fromInMinutes = timeLogic.totalMinutesInTimeSpan(item.from);
    const startInMinutes = timeLogic.totalMinutesInTimeSpan(startTime);
    const endInMinutes = timeLogic.totalMinutesInTimeSpan(endTime);

    return (
      fromInMinutes >= startInMinutes &&
      fromInMinutes <= endInMinutes &&
      toInMinutes <= endInMinutes &&
      toInMinutes >= startInMinutes
    );
  }

  mapTime(
    item: CalendarEvent,
    endTime: string,
    startTime: string
  ): CalendarEvent {
    const toInMinutes = timeLogic.totalMinutesInTimeSpan(item.to);
    const fromInMinutes = timeLogic.totalMinutesInTimeSpan(item.from);
    const startInMinutes = timeLogic.totalMinutesInTimeSpan(startTime);
    const endInMinutes = timeLogic.totalMinutesInTimeSpan(endTime);

    if (toInMinutes > endInMinutes && fromInMinutes < startInMinutes)
      return { ...item, from: startTime, to: endTime };
    else if (toInMinutes > endInMinutes) return { ...item, to: endTime };
    else if (fromInMinutes < startInMinutes)
      return { ...item, from: startTime };
    else return item;
  }
}

export const calendarHourLogic = new CalendarHourLogic();
