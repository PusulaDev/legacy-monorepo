import { EnumCalendarDayItemPosition } from './../../types/statics/calendar-day-item-position.enum';
import { calendarHourLogic } from "@/logic/calendar-hour.logic";
import { CalendarEvent } from "types/logic";
import { MinuteInterval } from "../../types/logic/minute-interval";

describe("Calendar Hour Logic", () => {

  it("should create minutes array with minuteInterval", () => {
    const minuteInterval = 25;

    const start = "08:00";
    const end = "10:00"
    const minutes = calendarHourLogic.createAllMinutes(start, end, minuteInterval);

    const expected: MinuteInterval[] = [
      { from: "08:00", to: "08:25", text: "00", hour: { text: "08", value: 8 }, interval: 25 },
      { from: "08:25", to: "08:50", text: "25", hour: { text: "08", value: 8 }, interval: 25 },
      { from: "08:50", to: "09:15", text: "50", hour: { text: "08", value: 8 }, interval: 25 },
      { from: "09:15", to: "09:40", text: "15", hour: { text: "09", value: 9 }, interval: 25 },
      { from: "09:40", to: "10:00", text: "40", hour: { text: "09", value: 9 }, interval: 20 },
    ];

    expect(minutes).toEqual(expected);
  });


  it("should in interval start time and end time", () => {

    const items: CalendarEvent[] = [
      {
        id: 1,
        from: "16:30",
        to: "16:40",
        title: "test açıklama vs",
        color: "pink",
        position: EnumCalendarDayItemPosition.Relative,
        zIndex: 1,
        isDraggable: true,
        isResizable: true,
      },
      {
        id: 2,
        from: "17:30",
        to: "18:00",
        title: "Test açıklama vs",
        color: "pink",
        position: EnumCalendarDayItemPosition.Relative,
        zIndex: 1,
        isDraggable: true,
        isResizable: true,
      },

      {
        id: 3,
        from: "20:30",
        to: "21:00",
        title: "Test açıklama vs",
        color: "pink",
        position: EnumCalendarDayItemPosition.Relative,
        zIndex: 1,
        isDraggable: true,
        isResizable: true,
      },

      {
        id: 4,
        from: "07:30",
        to: "09:00",
        title: "Test açıklama vs",
        color: "pink",
        position: EnumCalendarDayItemPosition.Relative,
        zIndex: 1,
        isDraggable: true,
        isResizable: true,
      },
    ];

    const startTime = "08:00";
    const endTime = "17:50";

    const expected: CalendarEvent[] = [
      {
        id: 1,
        from: "16:30",
        to: "16:40",
        title: "test açıklama vs",
        color: "pink",
        position: EnumCalendarDayItemPosition.Relative,
        zIndex: 1,
        isDraggable: true,
        isResizable: true,
      },
      {
        id: 2,
        from: "17:30",
        to: "17:50",
        title: "Test açıklama vs",
        color: "pink",
        position: EnumCalendarDayItemPosition.Relative,
        zIndex: 1,
        isDraggable: true,
        isResizable: true,
      },

      {
        id: 4,
        from: "08:00",
        to: "09:00",
        title: "Test açıklama vs",
        color: "pink",
        position: EnumCalendarDayItemPosition.Relative,
        zIndex: 1,
        isDraggable: true,
        isResizable: true,
      },
    ];

    const result = calendarHourLogic.mapEvents(items, endTime, startTime);


    expect(result).toEqual(expected);





  })



});

