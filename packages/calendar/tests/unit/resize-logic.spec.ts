import { resizeLogic } from "@/logic/resize.logic";
import { CalendarDayItem } from "../../types/logic/calendar-day-item";

describe("Resize Logic", () => {
  it("should find minimum value for bottomLimit", () => {
    const closestBlockingPosition = 120;
    const containerHeight = 210;

    const bottomLimit = resizeLogic.calculateBottomLimit(
      containerHeight,
      closestBlockingPosition
    );

    expect(bottomLimit).toBe(120);
  });

  it("should fix height by container", () => {
    const topOffset = 150;
    const height = 100;
    const bottomLimit = 200;

    const fixedHeight = resizeLogic.fixHeight({
      topOffset,
      height,
      bottomLimit,
    });

    expect(fixedHeight).toBe(50);
  });

  it("should fix height by closestBlockingPosition", () => {
    const topOffset = 1500;
    const height = 70;
    const closestBlockingPosition = 1540;
    const startTime = "06:00";
    const endTime = "23:00";
    const hourHeight = 100;

    const fixedHeight = resizeLogic.fixHeightByClosestBlockingPosition({
      topOffset,
      height,
      closestBlockingPosition,
      startTime,
      endTime,
      hourHeight,
    });

    expect(fixedHeight).toBe(40);
  });

  
  it("should find closest top position below", () => {
    const item: Pick<CalendarDayItem, "id" | "topOffset" | "height"> = {
      id: 99,
      topOffset: 100,
      height: 25,
    };

    const positions: Pick<CalendarDayItem, "id" | "topOffset">[] = [
      item,
      { id: 1, topOffset: 218 },
      { id: 2, topOffset: 212 },
      { id: 3, topOffset: 234 },
      { id: 4, topOffset: 144 },
    ];

    const bottomLimit = resizeLogic.findClosestTopPositionBelow(
      item,
      positions
    );

    expect(bottomLimit).toBe(144);
  });
});
