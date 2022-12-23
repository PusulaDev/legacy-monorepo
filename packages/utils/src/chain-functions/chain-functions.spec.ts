import { ChainFunctions } from "./chain-functions";

describe("Chain Functions", () => {
  it("should run two function consecutive", () => {
    const chain = new ChainFunctions(
      (value: number) => value + 2,
      (value: number) => value * 3
    );

    const result = chain.run(1);
    expect(result).toBe(9);
  });

  it("should not run if condition is met", () => {
    const chain = new ChainFunctions((value: string) => value + "-", {
      fn: (value: string) => value + ":",
      when: (value: string) => value.indexOf("true") > -1,
    });

    const result = chain.run("false");
    expect(result).toBe("false-");
  });

  it("should return undefined if condition is met and requrired is true", () => {
    const chain = new ChainFunctions(
      (value: number) => value * 10,
      {
        fn: (value: number) => value * 10,
        when: (value: number) => value < 100,
        required: true,
      },
      (value: number) => value * 2
    );

    const result = chain.run(10);
    expect(result).toBe(null);
  });

  it("should run async", async () => {
    const chain = new ChainFunctions(
      (value: number) => value + 1,
      async (value: number) => new Promise((resolve) => setTimeout(() => resolve(value + 1), 100)),
      (value: number) => value / 2
    );

    const result = await chain.runAsync(1);
    expect(result).toBe(1.5);
  });
});
