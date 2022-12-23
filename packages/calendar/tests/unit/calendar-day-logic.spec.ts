import {CalendarDayItem} from 'types/logic/calendar-day-item';
import {calendarDayLogic} from "@/logic/calendar-day.logic";
import {EnumCalendarDayItemPosition} from "../../types/statics/calendar-day-item-position.enum";
import {CalendarEvent} from "../../types/logic/calendar-event";

describe("Calendar Day Logic", () => {
  it("should create item from options with vertical positions", () => {
    const options: CalendarEvent = {
      id: 1,
      color: "pink",
      from: "12:30",
      to: "13:30",
      position: EnumCalendarDayItemPosition.Relative,
      title: "Test",
      zIndex: 1,
    };

    const hourHeight = 100;

    const item = calendarDayLogic.createItemWithVerticalPositions({
      event: options,
      hourHeight,
      startTime: "08:00",
    });

    const expected: CalendarDayItem = {
      ...options,
      topOffset: 450,
      leftOffset: 0,
      height: 100,
      width: 0,
      order: 0,
      cannotDrop: false,
    };

    expect(item).toEqual(expected);
  });

  it("should set horizontal values for item", () => {
    let item: CalendarDayItem = {
      id: 1,
      color: "red",
      from: "14:00",
      to: "14:30",
      height: 50,
      topOffset: 50,
      order: 1,
      position: EnumCalendarDayItemPosition.Relative,
      title: "Test",
      width: 0,
      leftOffset: 0,
      zIndex: 1,
      cannotDrop: false,
    };

    const containerWidth = 100;
    const hourPaddingRight = 20;

    item = calendarDayLogic.updateHorizontalPositions({
      item,
      allItems: [item],
      containerWidth,
      marginBetweenItems: 10,
      hourPaddingRight
    });

    expect(item.width).toBe(80);
    expect(item.leftOffset).toBe(0);
  });
  
  it("should set left and width with ignored freeSpaceAtRight for static positioned item",() => {
    let item: CalendarDayItem = {
      id: 1,
      color: "red",
      from: "14:00",
      to: "14:30",
      height: 50,
      topOffset: 50,
      order: 1,
      position: EnumCalendarDayItemPosition.Static,
      title: "Test",
      width: 0,
      leftOffset: 0,
      zIndex: 1,
      cannotDrop: false,
    };

    const containerWidth = 220;
    const hourPaddingRight = 40;

    item = calendarDayLogic.updateHorizontalPositions({
      item,
      allItems: [item],
      containerWidth,
      marginBetweenItems: 10,
      hourPaddingRight
    });

    expect(item.width).toBe(220);
    expect(item.leftOffset).toBe(0);
  })

  it("should set horizontal values for item with colliision", () => {
    let item: CalendarDayItem = {
      id: 1,
      color: "blue",
      from: "15:00",
      to: "16:00",
      height: 50,
      topOffset: 100,
      order: 2,
      position: EnumCalendarDayItemPosition.Relative,
      title: "Test",
      leftOffset: 0,
      width: 0,
      zIndex: 1,
      cannotDrop: false,
    };

    const allItems: CalendarDayItem[] = [
      {
        id: 2,
        topOffset: 70,
        height: 200,
        order: 1,
        leftOffset: 0,
        width: 0,
        color: "",
        from: "",
        to: "",
        title: "",
        position: EnumCalendarDayItemPosition.Relative,
        zIndex: 1,
        cannotDrop: false,
      },
      {
        id: 2,
        topOffset: 90,
        height: 120,
        order: 3,
        leftOffset: 0,
        width: 0,
        color: "",
        from: "",
        to: "",
        title: "",
        position: EnumCalendarDayItemPosition.Relative,
        zIndex: 1,
        cannotDrop: false,
      },
      item,
    ];

    item = calendarDayLogic.updateHorizontalPositions({
      item,
      allItems,
      containerWidth: 100,
      marginBetweenItems: 5,
    });

    expect(item.width).toBe(47.5);
    expect(item.leftOffset).toBe(52.5);
  });

  it("should order items by topOffset", () => {
    let items: CalendarDayItem[] = [
      {
        topOffset: 150,
        height: 10,
        leftOffset: 0,
        order: 0,
        width: 0,
        zIndex: 1,
        cannotDrop:false,
        color:"",
        from:"09:00",
        id:"",
        position:EnumCalendarDayItemPosition.Absolute,
        title:"",
        to:"09:10"
      },
      {
        topOffset: 130,
        height: 20,
        leftOffset: 0,
        order: 0,
        width: 0,
        zIndex: 1,
        cannotDrop:false,
        color:"",
        from:"09:10",
        id:"",
        position:EnumCalendarDayItemPosition.Absolute,
        title:"",
        to:"09:20"
      },
      {
        topOffset: 20,
        height: 120,
        leftOffset: 14,
        order: 0,
        width: 0,
        zIndex: 1,
        cannotDrop:false,
        color:"",
        from:"09:00",
        id:"",
        position:EnumCalendarDayItemPosition.Absolute,
        title:"",
        to:"09:30"
      },
    ];

    calendarDayLogic.orderItems(items);

    expect(items[0]).toEqual({
      topOffset: 20,
      height: 120,
      order: 0,
      width: 0,
      zIndex: 1,
      cannotDrop: false,
      color: "",
      from: "09:00",
      id:"",
      leftOffset:14,
      position:EnumCalendarDayItemPosition.Absolute,
      title:"",
      to:"09:30"
    });

    expect(items[1]).toEqual({
      topOffset: 150,
      height: 10,
      leftOffset: 0,
      order: 1,
      width: 0,
      zIndex: 1,
      cannotDrop: false,
      color: "",
      from: "09:00",
      id:"",
      position:EnumCalendarDayItemPosition.Absolute,
      title:"",
      to:"09:10"
    });

    expect(items[2]).toEqual({
      topOffset: 130,
      height: 20,
      leftOffset: 0,
      order: 2,
      width: 0,
      zIndex: 1,
      cannotDrop: false,
      color: "",
      from: "09:10",
      id:"",
      position:EnumCalendarDayItemPosition.Absolute,
      title:"",
      to:"09:20"
    });
  });

  it("should create Items", () => {
    const startTime = "08:00";
    const hourHeight = 100;
    const containerWidth = 200;
    const marginBetweenItems = 10;
    const hourPaddingRight = 10;

    let options: CalendarEvent[] = [
      {
        id: 1,
        color: "black",
        from: "08:00",
        to: "09:00",
        position: EnumCalendarDayItemPosition.Static,
        title: "Kapalı",
        zIndex: 1,
      },
      {
        id: 2,
        color: "red",
        from: "09:30",
        to: "10:30",
        position: EnumCalendarDayItemPosition.Relative,
        title: "Randevu 2",
        zIndex: 2,
      },
      {
        id: 3,
        color: "red",
        from: "09:15",
        to: "10:00",
        position: EnumCalendarDayItemPosition.Relative,
        title: "Randevu",
        zIndex: 2,
      },
      {
        id: 4,
        color: "blue",
        from: "11:30",
        to: "12:30",
        position: EnumCalendarDayItemPosition.Absolute,
        title: "Randevu 3",
        zIndex: 3,
      },
      {
        id: 5,
        color: "blue",
        from: "12:00",
        to: "13:00",
        position: EnumCalendarDayItemPosition.Static,
        title: "Randevu 3",
        zIndex: 2,
      },
    ];

    const items = calendarDayLogic.createItems({
      events: options,
      startTime,
      hourHeight,
      containerWidth,
      marginBetweenItems,
      hourPaddingRight
    });

    const expectedItems: CalendarDayItem[] = [

      {
        cannotDrop: false,
        closestBlockingPosition: 400,
        color: "black",
        from: "08:00",
        height: 100,
        id: 1,
        leftOffset: 0,
        order: 0,
        position:EnumCalendarDayItemPosition.Static,
        title: "Kapalı",
        to: "09:00",
        topOffset: 0,
        width: 200,
        zIndex: 1
      },
      {
        cannotDrop: false,
        closestBlockingPosition: 400,
        color: "red",
        from: "09:30",
        height: 100,
        id: 2,
        leftOffset: 0,
        order: 1,
        position:EnumCalendarDayItemPosition.Relative,
        title: "Randevu 2",
        to: "10:30",
        topOffset: 150,
        width: 90,
        zIndex: 2
      },
      {
        cannotDrop: false,
        closestBlockingPosition: 0,
        color: "blue",
        from: "11:30",
        height: 100,
        id: 4,
        leftOffset: 0,
        order: 2,
        position:EnumCalendarDayItemPosition.Absolute,
        title: "Randevu 3",
        to: "12:30",
        topOffset: 350,
        width: 190,
        zIndex: 3
      },
      {
        cannotDrop: false,
        closestBlockingPosition: 0,
        color: "blue",
        from: "12:00",
        height: 100,
        id: 5,
        leftOffset: 0,
        order: 3,
        position:EnumCalendarDayItemPosition.Static,
        title: "Randevu 3",
        to: "13:00",
        topOffset: 400,
        width: 200,
        zIndex: 2
      },{
        cannotDrop: false,
        closestBlockingPosition: 400,
        color: "red",
        from: "09:15",
        height: 75,
        id: 3,
        leftOffset: 100,
        order: 4,
        position:EnumCalendarDayItemPosition.Relative,
        title: "Randevu",
        to: "10:00",
        topOffset: 125,
        width: 90,
        zIndex: 2
      },
    ];

    expect(items).toEqual(expectedItems);
  });

  it("should find all collided items", () => {
    const item: CalendarDayItem = {
      id: 1,
      height: 50,
      topOffset: 100,
      leftOffset: 0,
      width: 0,
      order: 1,
      zIndex: 1,
      color: "",
      from: "",
      position: EnumCalendarDayItemPosition.Absolute,
      title: "",
      to: "",
      cannotDrop: false,
    };

    const allItems: CalendarDayItem[] = [
      {
        id: 2,
        order: 2,
        height: 40,
        topOffset: 112,
        leftOffset: 0,
        width: 0,
        zIndex: 1,
        color: "",
        from: "",
        position: EnumCalendarDayItemPosition.Absolute,
        title: "",
        to: "",
        cannotDrop: false,
      },
      {
        id: 3,
        order: 3,
        height: 20,
        topOffset: 10,
        leftOffset: 0,
        width: 0,
        zIndex: 1,
        color: "",
        from: "",
        position: EnumCalendarDayItemPosition.Absolute,
        title: "",
        to: "",
        cannotDrop: false,
      }, {
        id: 5,
        order: 3,
        height: 20,
        topOffset: 10,
        leftOffset: 0,
        width: 0,
        zIndex: 1,
        color: "",
        from: "",
        position: EnumCalendarDayItemPosition.Absolute,
        title: "",
        to: "",
        cannotDrop: false,
      },
    ];

    const collidedItems = calendarDayLogic.filterCollidedItems(item, allItems);

    expect(collidedItems).toEqual([allItems[0]]);
  });

  it("should filter blocking items", () => {
    const items: Pick<CalendarDayItem, "id" | "position">[] = [
      { id: 1, position: EnumCalendarDayItemPosition.Absolute },
      { id: 2, position: EnumCalendarDayItemPosition.Relative },
      { id: 3, position: EnumCalendarDayItemPosition.Static },
    ];

    const item: Pick<CalendarDayItem, "id" | "position"> = {
      id: 20,
      position: EnumCalendarDayItemPosition.Relative,
    };

    const blockingItems = calendarDayLogic.filterBlockingItems(item, items);

    expect(blockingItems).toEqual([
      { id: 3, position: EnumCalendarDayItemPosition.Static },
    ]);
  });

  it("should find closest blocking position below", () => {
    const item: Pick<
      CalendarDayItem,
      "id" | "position" | "topOffset" | "height"
    > = {
      id: 122,
      position: EnumCalendarDayItemPosition.Relative,
      topOffset: 100,
      height: 72,
    };

    const items: Pick<CalendarDayItem, "id" | "position" | "topOffset">[] = [
      item,
      { id: 1, position: EnumCalendarDayItemPosition.Relative, topOffset: 192 },
      { id: 2, position: EnumCalendarDayItemPosition.Relative, topOffset: 122 },
      { id: 3, position: EnumCalendarDayItemPosition.Absolute, topOffset: 202 },
      { id: 4, position: EnumCalendarDayItemPosition.Static, topOffset: 212 },
    ];

    const blockingPosition = calendarDayLogic.findClosestBlockingPositionBelow(
      item,
      items
    );

    expect(blockingPosition).toBe(212);
  });

  it("should filter blocking collided items", () => {
    const item: CalendarDayItem = {
      id: 1,
      color: "",
      from: "",
      to: "",
      height: 100,
      leftOffset: 0,
      order: 1,
      position: EnumCalendarDayItemPosition.Relative,
      title: "",
      topOffset: 100,
      width: 50,
      zIndex: 1,
      cannotDrop: false,
    };

    const items: CalendarDayItem[] = [
      {
        id: 2,
        order: 2,
        height: 40,
        topOffset: 112,
        leftOffset: 0,
        width: 0,
        zIndex: 1,
        color: "",
        from: "",
        position: EnumCalendarDayItemPosition.Static,
        title: "",
        to: "",
        cannotDrop: false,
      },
      {
        id: 3,
        order: 3,
        height: 30,
        topOffset: 80,
        leftOffset: 0,
        width: 0,
        zIndex: 1,
        color: "",
        from: "",
        position: EnumCalendarDayItemPosition.Absolute,
        title: "",
        to: "",
        cannotDrop: false,
      },
      item,
    ];

    const blockingCollidedItems = calendarDayLogic.filterBLockingCollidedItems(
      item,
      items
    );

    expect(blockingCollidedItems).toEqual([items[0]]);
  });
});
