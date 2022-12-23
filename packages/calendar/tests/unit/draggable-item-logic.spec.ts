import { draggableItemLogic } from "@/logic/draggable-item.logic";
import { EnumCalendarDayItemPosition } from "../../types/statics/calendar-day-item-position.enum";
import { CalendarDayItem } from "types/logic/calendar-day-item";

describe("Draggable Item Logic", () => {
  it("should snap position to prev minuteInterval", () => {
    let topOffset = 10;
    const minuteInterval = 15;
    const hourHeight = 100;

    topOffset = draggableItemLogic.snapToMinute({
      topOffset,
      minuteInterval,
      hourHeight,
    });
    expect(topOffset).toBe(0);
  });

  it("should snap position to next minuteInterval", () => {
    let topOffset = 48;
    const minuteInterval = 15;
    const hourHeight = 100;

    topOffset = draggableItemLogic.snapToMinute({
      topOffset,
      minuteInterval,
      hourHeight,
    });

    expect(topOffset).toBe(50);
  });

  it("should calculate first relativeTop position to mouse", () => {
    const pageY = 10;
    const topOffset = 0;

    const relativeTop = draggableItemLogic.calculateRelativeTop(
      pageY,
      topOffset
    );

    expect(relativeTop).toBe(-10);
  });

  it("should calculate newTop position", () => {
    const pageY = 89;
    const firstTopOffset = -25;

    const topOffset = draggableItemLogic.calculateNewTop(pageY, firstTopOffset);

    expect(topOffset).toBe(64);
  });

  it("should create clone for draggable ghost", () => {
    const item: CalendarDayItem = {
      id: 1,
      color: "pink",
      from: "08:10",
      to: "10:20",
      height: 50,
      leftOffset: 100,
      order: 1,
      position: EnumCalendarDayItemPosition.Absolute,
      title: "Test",
      topOffset: 120,
      width: 100,
      zIndex: 1,
      isBordered: true,
      cannotDrop: false,
    };

    const clone = draggableItemLogic.createClone(item);

    expect(clone.isClickable).toBe(false);
    expect(clone.isDraggable).toBe(false);
    expect(clone.isResizable).toBe(false);
    expect(clone.zIndex).toBe(20);
  });

  it("should calculate bottom", () => {
    const top = 100;
    const height = 70;

    const bottom = draggableItemLogic.calculateBottom(top, height);

    expect(bottom).toBe(170);
  });

  it("should calculate overflow", () => {
    const top = 120;
    const height = 200;
    const containerHeight = 130;

    const overflow = draggableItemLogic.calculateOverflow({
      top,
      height,
      containerHeight,
    });

    expect(overflow).toBe(190);
  });

  it("should fix bottom overflow", () => {
    const top = 90;
    const height = 30;
    const containerHeight = 100;
    const resizeToFix = false;

    const fixed = draggableItemLogic.fixBottomOverflow({
      top,
      height,
      containerHeight,
      resizeToFix,
    });

    expect(fixed.top).toBe(70);
    expect(fixed.height).toBe(30);
  });

  it("should fix bottom overflow with changing height", () => {
    const top = 120;
    const height = 100;
    const containerHeight = 150;
    const resizeToFix = true;

    const fixed = draggableItemLogic.fixBottomOverflow({
      top,
      height,
      containerHeight,
      resizeToFix,
    });

    expect(fixed.top).toBe(120);
    expect(fixed.height).toBe(30);
  });

  it(`should fix bottom overflow with changing top when 
    topOffset is biggerThen containerHeight even if resizeToFix is true`, () => {
    const top = 2000;
    const height = 120;
    const containerHeight = 500;
    const resizeToFix = true;

    const fixed = draggableItemLogic.fixBottomOverflow({
      top,
      height,
      containerHeight,
      resizeToFix,
    });

    expect(fixed.top).toBe(380);
    expect(fixed.height).toBe(120);
  });

  it(`should fix bottom overflow with bot top and height if height
   is bigger then containerHeight and top is bigger then 0`, () => {
    const top = 120;
    const height = 821;
    const containerHeight = 400;
    const resizeToFix = false;

    const fixed = draggableItemLogic.fixBottomOverflow({
      top,
      height,
      containerHeight,
      resizeToFix,
    });

    expect(fixed.top).toBe(0);
    expect(fixed.height).toBe(400);
  });

  it("should fix position for outOfContainer", () => {
    const topOffset = 1500;
    const height = 100;
    const hourHeight = 100;
    const startTime = "08:00";
    const endTime = "23:00";
    const resizeToFix = false;

    const newTopOffset = draggableItemLogic.keepInsideContainer({
      topOffset,
      height,
      hourHeight,
      startTime,
      endTime,
      resizeToFix,
    });

    expect(newTopOffset.top).toBe(1400);
    expect(newTopOffset.height).toBe(100);
  });
});
