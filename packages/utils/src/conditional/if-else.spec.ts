import { createConditional } from "./create-switch";

describe("createConditional", () => {
  it("should return value by condition", () => {
    const conditional = createConditional(
      [(value: number) => value < 5, "small"],
      [(value: number) => value > 5, "big"],
      [(value: number) => true, "default"]
    );

    const result = conditional(6);
    expect(result).toBe("big");
  });

  it("should return function by condition", () => {
    const conditional = createConditional(
      [(value: boolean) => value, (value: number) => value * 2],
      [(value: boolean) => !value, (value: number) => value / 2]
    );

    const result = conditional(false)?.(2);
    expect(result).toBe(1);
  });
});
