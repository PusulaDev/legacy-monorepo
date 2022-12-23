import { calendarDayItemLogic } from "@/logic/calendar-day-item.logic";
import { EnumCalendarDayItemPosition } from "../../types/statics/calendar-day-item-position.enum";
import {
  CalendarDayItem,
  CalendarDayItemPosition,
} from "../../types/logic/calendar-day-item";

describe("Calendar Day Item Logic", () => {
  it("should calculate height per minute", () => {
    const hourHeight = 120;
    const heightPerMinute = calendarDayItemLogic.calculateHeightPerMinute(
      hourHeight
    );

    expect(heightPerMinute).toBe(2);
  });

  it("should calculate distance between two timeSpan text", () => {
    const from = "12:00";
    const to = "16:30";
    const hourHeight = 100;

    const distance = calendarDayItemLogic.calculateDistance({
      from,
      to,
      hourHeight,
    });

    expect(distance).toBe(450);
  });

  it("should calculate negative distance", () => {
    const from = "13:23";
    const to = "12:23";
    const hourHeight = 12;

    const distance = calendarDayItemLogic.calculateDistance({
      from,
      to,
      hourHeight,
    });

    expect(distance).toBe(-12);
  });

  it("should calculate vertical position for item", () => {
    const from = "12:00";
    const hourHeight = 100;
    const startTime = "08:00";

    const topOffset = calendarDayItemLogic.calculateTopOffset({
      from,
      hourHeight,
      startTime,
    });

    expect(topOffset).toBe(400);
  });

  it("should calculate vertical position for item with fixing floating point problem", () => {
    const from = "16:20";
    const hourHeight = 100;
    const startTime = "00:00";

    const topOffset = calendarDayItemLogic.calculateTopOffset({
      from,
      hourHeight,
      startTime,
    });

    expect(topOffset).toBe(1633);
  });

  it("should calculate height", () => {
    const from = "11:00";
    const to = "13:30";
    const hourHeight = 100;

    const height = calendarDayItemLogic.calculateHeight({
      from,
      to,
      hourHeight,
    });

    expect(height).toBe(250);
  });

  it("should return true for isCollidable when both position relative", () => {
    const isCollidable = calendarDayItemLogic.isCollidable(
      EnumCalendarDayItemPosition.Relative,
      EnumCalendarDayItemPosition.Relative
    );

    expect(isCollidable).toBe(true);
  });

  it("should detect collision for two item", () => {
    const item1: CalendarDayItemPosition = {
      order: 1,
      topOffset: 100,
      height: 50,
      width: 0,
      leftOffset: 0,
      zIndex: 1,
    };
    const item2: CalendarDayItemPosition = {
      order: 2,
      topOffset: 70,
      height: 80,
      width: 0,
      leftOffset: 0,
      zIndex: 1,
    };

    const isCollides = calendarDayItemLogic.detectCollision(item1, item2);

    expect(isCollides).toBe(true);
  });


  it("should return false for edge collision", () => {
    const item1: CalendarDayItemPosition = {
      order: 1,
      height: 20,
      topOffset: 20,
      leftOffset: 0,
      width: 0,
      zIndex: 1,
    };

    const item2: CalendarDayItemPosition = {
      order: 1,
      height: 30,
      topOffset: 40,
      leftOffset: 0,
      width: 0,
      zIndex: 1,
    };

    const isCollides = calendarDayItemLogic.detectCollision(item1, item2);

    expect(isCollides).toBe(false);
  });

  it("should not detect collision for two not colliding item", () => {
    const item1: CalendarDayItemPosition = {
      order: 1,
      topOffset: 20,
      height: 50,
      width: 0,
      leftOffset: 0,
      zIndex: 1,
    };
    const item2: CalendarDayItemPosition = {
      order: 2,
      topOffset: 80,
      height: 80,
      width: 0,
      leftOffset: 0,
      zIndex: 1,
    };

    const isCollides = calendarDayItemLogic.detectCollision(item1, item2);

    expect(isCollides).toBe(false);
  });

  it("should detect collision on same items", () => {
    const item1: CalendarDayItemPosition = {
      order: 1,
      topOffset: 10,
      height: 12,
      width: 0,
      leftOffset: 0,
      zIndex: 1,
    };

    const isCollides = calendarDayItemLogic.detectCollision(item1, item1);

    expect(isCollides).toBe(true);
  });

  it("shoul calculate 0 freeSpaceAtRight for static position", () => {
    const hourPaddingRight: number = 30;
    const position: EnumCalendarDayItemPosition =
      EnumCalendarDayItemPosition.Static;

    const freeSpace = calendarDayItemLogic.calculateFreeSpaceAtRight(
      hourPaddingRight,
      position
    );

    expect(freeSpace).toBe(0);
  });

  it("should calculate width of item", () => {
    let item: CalendarDayItemPosition = {
      order: 1,
      topOffset: 10,
      height: 20,
      width: 0,
      leftOffset: 0,
      zIndex: 1,
    };

    const marginBetweenItems = 5;
    const containerWidth = 100;
    const collidedItemCount = 1;
    const freeSpaceAtRight = 20;

    const width = calendarDayItemLogic.calculateWidth({
      item,
      marginBetweenItems,
      containerWidth,
      collidedItemCount,
      freeSpaceAtRight,
    });

    expect(width).toBe(37.5);
  });

  it("should calculate left of item", () => {
    let item: CalendarDayItemPosition = {
      order: 3,
      topOffset: 10,
      height: 20,
      width: 0,
      leftOffset: 0,
      zIndex: 1,
    };

    let collidedItems: CalendarDayItemPosition[] = [
      {
        order: 1,
        topOffset: 5,
        height: 15,
        width: 0,
        leftOffset: 0,
        zIndex: 1,
      },
      {
        order: 2,
        topOffset: 5,
        height: 15,
        width: 0,
        leftOffset: 0,
        zIndex: 1,
      },
    ];

    const marginBetweenItems = 5;
    const containerWidth = 100;
    const freeSpaceAtRight = 15;

    let leftOffset = calendarDayItemLogic.calculateLeft({
      item,
      collidedItems,
      marginBetweenItems,
      containerWidth,
      freeSpaceAtRight,
    });

    expect(leftOffset).toBe(60);
  });

  it("should calculate timeSpan from topOffset", () => {
    const topOffset = 10;
    const hourHeight = 100;
    const startTime = "08:00";

    const timeSpan = calendarDayItemLogic.calculateTimeSpanFromTopOffset({
      topOffset,
      hourHeight,
      startTime,
    });

    expect(timeSpan).toBe("08:06");
  });

  it("should calculate timeSpan from topOffset when value is float", () => {
    const topOffset = 534;
    const hourHeight = 80;
    const startTime = "08:00";

    const timeSpan = calendarDayItemLogic.calculateTimeSpanFromTopOffset({
      topOffset,
      hourHeight,
      startTime,
    });

    expect(timeSpan).toBe("14:41");
  });

  it("should calculate timespan with decimal topOffset", () => {
    const topOffset = 21;
    const hourHeight = 80;
    const startTime = "08:00";

    const timeSpan = calendarDayItemLogic.calculateTimeSpanFromTopOffset({
      topOffset,
      hourHeight,
      startTime,
    });

    expect(timeSpan).toBe("08:16");
  });

  it("shoul update item values with new topOffset", () => {
    let item: CalendarDayItem = {
      color: "pink",
      from: "18:00",
      height: 100,
      to: "19:00",
      id: 1,
      leftOffset: 0,
      width: 10,
      order: 1,
      position: EnumCalendarDayItemPosition.Relative,
      title: "",
      topOffset: 1000,
      zIndex: 1,
      cannotDrop: false,
    };

    const hourHeight = 100;
    const startHour = "08:00";
    const newTopOffset = 1250;
    const newHeight = 300;

    item = calendarDayItemLogic.updateItemTimeValues({
      item,
      newTopOffset,
      newHeight,
      hourHeight,
      startTime: startHour,
    });

    expect(item.topOffset).toBe(newTopOffset);
    expect(item.height).toBe(300);
    expect(item.from).toBe("20:30");
    expect(item.to).toBe("23:30");
  });

  it("should check if vertical values changed", () => {
    const item: CalendarDayItemPosition = {
      height: 100,
      leftOffset: 200,
      order: 1,
      topOffset: 175,
      width: 10,
      zIndex: 1,
    };

    const isChanged = calendarDayItemLogic.isVerticalValuesChanged({
      item,
      topOffset: 175,
      height: 90,
    });

    expect(isChanged).toBe(true);
  });

  describe("isBlocking", () => {
    it("should return true if source = Static , target = Static", () => {
      const isBlocking = calendarDayItemLogic.isBlocking(
        EnumCalendarDayItemPosition.Static,
        EnumCalendarDayItemPosition.Static
      );

      expect(isBlocking).toBe(true);
    });

    it("should return true if source = Relative , target = Static", () => {
      const isBlocking = calendarDayItemLogic.isBlocking(
        EnumCalendarDayItemPosition.Relative,
        EnumCalendarDayItemPosition.Static
      );

      expect(isBlocking).toBe(true);
    });

    it("should not block at all if source = Absolute", () => {
      const isBlocking = calendarDayItemLogic.isBlocking(
        EnumCalendarDayItemPosition.Absolute,
        EnumCalendarDayItemPosition.Static
      );

      expect(isBlocking).toBe(false);
    });
  });
});
