import { calendarEventLogic } from "@/components";
import { TimeInterval } from "types/logic";

describe("Calendar Event Logic", () => {
  it("should find all collided items", () => {
    const item: TimeInterval = {
      from: "12:20",
      to: "13:40",
    };

    const allItems: TimeInterval[] = [
      { from: "11:10", to: "12:10" },
      { from: "12:30", to: "12:40" },
      { from: "14:40", to: "14:50" },
    ];

    const collidedItems = calendarEventLogic.filterCollidedItems(
      item,
      allItems
    );

    expect(collidedItems).toEqual([{ from: "12:30", to: "12:40" }]);
  });
});
