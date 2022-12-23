import { recursionUtil } from "./recursion-util";

describe("Recursion Helper", () => {
  it("should run method for all nested children", () => {
    let total = 0;
    let items = [
      {
        value: 1,
        children: [{ value: 2 }, { value: 3, children: [{ value: 4 }] }],
      },
    ];

    recursionUtil.runRecursive(
      items,
      (e) => e.children,
      (e) => (total += e.value)
    );

    expect(total).toEqual(10);
  });
});
