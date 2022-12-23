import { areaSelectLogic } from "@/logic/area-select.logic";
import { CalendarDayItem } from "../../types/logic/calendar-day-item";

describe("Area Select Logic", () => {
  it("should calculate topOffset and height from start-end positions", () => {
    const start = 320;
    const end = 210;

    const positions = areaSelectLogic.calculatePositions(start, end);

    expect(positions).toEqual({
      topOffset: 210,
      height: 110,
    });
  });

  it("should find top-bottom limits from positions", () => {
    const currentPosition = 120;

    const positions: Pick<CalendarDayItem, "topOffset" | "height">[] = [
      { topOffset: 20, height: 20 },
      { topOffset: 30, height: 20 },
      { topOffset: 140, height: 20 },
    ];

    const limits = areaSelectLogic.findLimits({
      currentPosition,
      items: positions,
      containerHeight: 900,
    });

    expect(limits).toEqual({
      top: 50,
      bottom: 140,
    });
  });

  it("should set top-bottom limits to currentPosition when position inside limits",() => {
    const currentPosition = 80;
    const positions:Pick<CalendarDayItem,"topOffset"|"height">[] = [
      {topOffset:40,height:50},
      {topOffset:120,height:40}
    ]

    const limits = areaSelectLogic.findLimits({
      currentPosition,
      items:positions,
      containerHeight:1200
    });

    expect(limits).toEqual({
      top:80,
      bottom:80
    })
  })

  it("should find bottom position as containerHeight if nothing below", () => {
    const currentPosition = 200;
    const containerHeight = 400;

    const positions: Pick<CalendarDayItem, "topOffset" | "height">[] = [
      { topOffset: 20, height: 20 },
    ];

    const limits = areaSelectLogic.findLimits({
      currentPosition,
      items: positions,
      containerHeight,
    });

    expect(limits).toEqual({
      top: 40,
      bottom: 400,
    });
  });

  it("should return false for is height valid", () => {
    const newTopOffset = 100;
    const firstTopOffset = 90;
    const minuteHeight = 20;

    const isValid = areaSelectLogic.isHeightValid({
      newTopOffset,
      firstTopOffset,
      minuteHeight,
    });

    expect(isValid).toBe(false);
  });

  it("should return false for isNewTopOffsetValid when bottom is off limits", () => {
    const newTopOffset = 1020;
    const lastTopOffset = 1000;
    const firstTopOffset = 40;
    const minuteHeight = 20;
    const limits = {
      top: 0,
      bottom: 1000,
    };

    const isValid = areaSelectLogic.isNewTopOffsetValid({
      newTopOffset,
      lastTopOffset,
      firstTopOffset,
      minuteHeight,
      limits,
    });

    expect(isValid).toBe(false);
  });

  it("should return false for isNewTopOffsetValid if newTopOffset is equal to firstTopOffset", () => {
    const newTopOffset = 500;
    const lastTopOffset = 450;
    const firstTopOffset = 500;
    const minuteHeight = 20;
    const limits = {
      top: 0,
      bottom: 1000,
    };

    const isValid = areaSelectLogic.isNewTopOffsetValid({
      newTopOffset,
      lastTopOffset,
      firstTopOffset,
      minuteHeight,
      limits,
    });

    expect(isValid).toBe(false);
  });

});
