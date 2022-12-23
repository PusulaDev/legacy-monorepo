import { decimalUtil } from "./decimal.util";

describe("Decimal Util", () => {
  it("has three precision after coma", () => {
    let value = 0.02314665;

    let newValue = decimalUtil.toFixedNumber(value, 3);

    expect(newValue).toEqual(0.023);
  });
});
