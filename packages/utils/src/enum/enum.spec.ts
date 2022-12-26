import { EnumUtil } from "./enum.util";
import { IValueTextPair } from "./value-text-pair.interface";
import { describe, it, expect } from "vitest"

enum EnumTest {
  One = 1,
  Two = 2,
  Three = 3,
}

enum EnumNoNumberTest {
  One = "One",
  Two = "Two",
  Three = "Three",
}

enum EnumFlaggedTest {
  One = 1,
  Two = 2,
  Four = 4,
  Eight = 8,
}

describe("EnumUtil", () => {
  it("converts all items to value text pair", () => {
    let items = EnumUtil.toValueTextPair(EnumTest);

    let expectedItems: IValueTextPair[] = [
      { value: 1, text: "One" },
      { value: 2, text: "Two" },
      { value: 3, text: "Three" },
    ];

    expect(items).toEqual(expectedItems);
  });

  it("cannot convert non number enum", () => {
    let items = EnumUtil.toValueTextPair(EnumNoNumberTest);

    expect(items).toEqual([]);
  });

  it("statement function works", () => {
    let items = EnumUtil.toValueTextPair(EnumTest, (e) => e < 3);

    let expectedItems: IValueTextPair[] = [
      { value: 1, text: "One" },
      { value: 2, text: "Two" },
    ];

    expect(items).toEqual(expectedItems);
  });

  it("find flagged enum values", () => {
    let items = EnumUtil.flaggedEnumToValueTextPair(EnumFlaggedTest, 6);

    let expectedItems: IValueTextPair[] = [
      { value: 2, text: "Two" },
      { value: 4, text: "Four" },
    ];

    expect(items).toEqual(expectedItems);
  });
});
