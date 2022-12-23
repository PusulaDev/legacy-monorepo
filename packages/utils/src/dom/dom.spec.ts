import { domUtil } from "./dom.util";
describe("Dom Utils", () => {
  it.each([
    [100, 240, 30, 340, true],
    [130, 10, 0, 340, false],
  ])(
    "when offsetHeight = %i , scrollTop = %i, margin = %i, scrollHeight = %i should return %s",
    (offsetHeight: number, scrollTop: number, margin: number, scrollHeight: number, expected: boolean) => {
      const isAtTheBottom = domUtil.checkIsAtTheBottom({
        offsetHeight,
        scrollTop,
        margin,
        scrollHeight,
      });

      expect(isAtTheBottom).toBe(expected);
    }
  );
});
