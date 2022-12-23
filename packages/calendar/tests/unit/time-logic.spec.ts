import { timeLogic } from "@/logic/time.logic";
import { MinuteInterval } from 'types/logic';
import { TimeInterval } from 'types/logic/time-interval';
import { TimeSpan } from "types/logic/time-span";

describe("TimeLogic", () => {
  it("should create two digit text", () => {
    const result = timeLogic.createTwoDigitText(9);

    expect(result).toBe("09");
  });

  it("should get hour and minute from timeSpan text", () => {
    const timeSpanText = "12:23";

    const timeSpan = timeLogic.getTimeSpan(timeSpanText);

    expect(timeSpan).toEqual({ hour: 12, minute: 23 });
  });

  it("should create timespanText from timeSpan", () => {
    const timeSpan: TimeSpan = { hour: 4, minute: 5 };

    const timeSpanText = timeLogic.createTimeSpanText(timeSpan);

    expect(timeSpanText).toBe("04:05");
  });

  it("should throw error if is not a valid timespan text", () => {
    const timeSpanText = "12334";

    expect(() => timeLogic.getTimeSpan(timeSpanText)).toThrow(
      `${timeSpanText} is not a valid timespan`
    );
  });

  it("should calculate total minutes in timespan", () => {
    const timeSpanText = "13:24";

    const totalMinutes = timeLogic.totalMinutesInTimeSpan(timeSpanText);
    expect(totalMinutes).toBe(804);
  });

  it("should add minutes to timespan", () => {
    const timeSpan: TimeSpan = { hour: 8, minute: 12 };
    const newTimeSpan = timeLogic.addMinutesToTimeSpan(timeSpan, 50);

    expect(newTimeSpan).toEqual({ hour: 9, minute: 2 });
  });

  it("shoul add negative minutes to timespan", () => {
    const timeSpan: TimeSpan = { hour: 12, minute: 20 };
    const newTimeSpan = timeLogic.addMinutesToTimeSpan(timeSpan, -120);

    expect(newTimeSpan).toEqual({ hour: 10, minute: 20 });
  });

  it("should add minutes to timespanText", () => {
    const timeSpanText = "12:24";
    const newTimeSpanText = timeLogic.addMinutesToTimeSpanText(
      timeSpanText,
      122
    );

    expect(newTimeSpanText).toBe("14:26");
  });

  it("should update from-to with newFrom keeping difference",() => {
    const fromTo:TimeInterval = {
      from:"12:22",
      to:"13:18"
    }

    const newFrom = "14:00";

    const updated = timeLogic.updateTimeInterval(fromTo,newFrom);

    expect(updated.from).toBe("14:00");
    expect(updated.to).toBe("14:56");
  })

  it("should detect collision of two timeIntervals",() => {
    const timeInterval:TimeInterval = {
      from:"13:40",
      to:"14:20"
    };

    const timeInterval2:TimeInterval = {
      from:"14:11",
      to:"15:45"
    };

    const isCollides = timeLogic.detectCollision(timeInterval,timeInterval2);

    expect(isCollides).toBe(true)
  })

  it("should not detect collision of two timeIntervals that not collides",()=>{
    const timeInterval:TimeInterval = {
      from:"13:40",
      to:"14:20"
    };

    const timeInterval2:TimeInterval = {
      from:"16:11",
      to:"17:45"
    };

    const isCollides = timeLogic.detectCollision(timeInterval,timeInterval2);

    expect(isCollides).toBe(false)
  })
});
