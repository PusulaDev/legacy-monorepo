import { createSwitch } from "./create-switch";

describe("createSwitch", () => {
  it("should get correct value", () => {
    const conditional = createSwitch({ "1": 1, "2": 2, "3": 3 });
    const result = conditional("3");
    expect(result).toBe(3);
  });

  it("should get default value if cases is not match", () => {
    const conditional = createSwitch<string, number | string>({ "1": 1 }, "");
    const result = conditional("3");
    expect(result).toBe("");
  });

  it("should work with functions", () => {
    const conditional = createSwitch({ "1": (value: string) => +value, "2": (value: string) => +value * 2 });
    const result = conditional("2")?.("2");
    expect(result).toBe(4);
  });
});
