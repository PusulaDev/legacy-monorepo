import { extendArray } from "./extend-array";
import { GroupModel, GroupItem } from "../../data-group/data-group.interface";
import { describe, it, expect } from "vitest"

describe("extended array functions", () => {
  extendArray();

  it("last", () => {
    let items: number[] = [1, 2, 3];
    expect(items.last()).toEqual(3);
  });

  it("pushRange", () => {
    let items: number[] = [1, 2];

    items.pushRange([3, 4]);

    expect(items.length).toEqual(4);
  });

  it("remove", () => {
    let items: number[] = [1, 2, 3, 4, 5];
    items.remove(3);

    expect(items).toEqual([1, 2, 4, 5]);
  });

  it("remove Object", () => {
    let items: { name: string }[] = [{ name: "ali" }, { name: "veli" }];
    let item = items[0];
    items.remove(item);

    expect(items).toEqual([{ name: "veli" }]);
  });

  it("find remove", () => {
    let items: { id: number }[] = [{ id: 12 }, { id: 23 }];

    items.findRemove((e) => e.id == 12);

    expect(items).toEqual([{ id: 23 }]);
  });

  it("pushIf", () => {
    let items: number[] = [1, 3, 4, 5, 6];

    items.pushIf(24, (e) => 24 > 10);
    items.pushIf(8, (e) => 8 > 10);

    expect(items).toEqual([1, 3, 4, 5, 6, 24]);
  });

  it("pushRange", () => {
    let items: number[] = [1, 2];

    items.pushRange([3, 4]);

    expect(items).toEqual([1, 2, 3, 4]);
  });

  it("forEachAsync", async () => {
    let items: number[] = [1, 2];

    let otherItems: number[] = [6, 7];

    const addItemFunction = async (e: number) => {
      return new Promise<void>((resolve) =>
        setTimeout(() => {
          items.push(e);
          resolve();
        }, 300)
      );
    };

    await otherItems.forEachAsync(async (e) => {
      await addItemFunction(e);
    });

    expect(items).toEqual([1, 2, 6, 7]);
  });

  it("toGroupModel", () => {
    let items: { value: string; id: number }[] = [
      { value: "first", id: 1 },
      { value: "second", id: 2 },
      { value: "first", id: 3 },
    ];

    let group = items.toGroupModel((e) => e.value);

    let expectGroup: GroupModel<{ value: string; id: number }> = {
      first: [
        { value: "first", id: 1 },
        { value: "first", id: 3 },
      ],
      second: [{ value: "second", id: 2 }],
    };

    expect(JSON.stringify(group)).toEqual(JSON.stringify(expectGroup));
  });

  it("toGroupItems", () => {
    let items: { value: string; id: number }[] = [
      { value: "first", id: 1 },
      { value: "second", id: 2 },
      { value: "first", id: 3 },
    ];

    let groupItems = items.toGroupItems((e) => e.value);

    let expectGroupItems: GroupItem<{ value: string; id: number }>[] = [
      {
        key: "first",
        values: [
          { value: "first", id: 1 },
          { value: "first", id: 3 },
        ],
      },
      {
        key: "second",
        values: [
          {
            value: "second",
            id: 2,
          },
        ],
      },
    ];

    expect(JSON.stringify(groupItems)).toEqual(JSON.stringify(expectGroupItems));
  });

  it("toGroupModelValues", () => {
    let items: { value: string; id: number }[] = [
      { value: "first", id: 1 },
      { value: "second", id: 2 },
      { value: "first", id: 3 },
    ];

    let groupValues = items.toGroupModelValues((e) => e.value);

    let expectGroupValues: { value: string; id: number }[][] = [
      [
        { value: "first", id: 1 },

        { value: "first", id: 3 },
      ],
      [{ value: "second", id: 2 }],
    ];

    expect(JSON.stringify(groupValues)).toEqual(JSON.stringify(expectGroupValues));
  });

  it("sum", () => {
    let items: { value: number }[] = [{ value: 1 }, { value: 2 }, { value: 3 }];

    let sum = items.sum((e) => e.value);

    expect(sum).toEqual(6);
  });

  it("distinc", () => {
    let items: string[] = ["ali", "veli", "ayşe", "veli", "ali"];
    items = items.distinct();

    expect(items.length).toEqual(3);
  });

  it("distinc with field", () => {
    let items = [{ name: "ali" }, { name: "ali" }, { name: "veli" }];
    items = items.distinct((e) => e.name);

    expect(items).toEqual([{ name: "ali" }, { name: "veli" }]);
  });

  it("mapIf", () => {
    const items = [1, 2, 3, 4, 5, 6];
    const result = items.mapIf(
      (e) => e,
      (e) => e % 2 !== 0
    );
    expect(result).toEqual([1, 3, 5]);
  });

  it("filterByCollection", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const result = items.filterByCollection((e) => e.id, [1, 3]);

    expect(result).toEqual([{ id: 1 }, { id: 3 }]);
  });

  it("filterByExcludesCollection", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const result = items.filterByExcludesCollection((e) => e.id, [1, 3]);

    expect(result).toEqual([{ id: 2 }]);
  });

  it("findByCollection", () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

    const result = items.findByCollection((e) => e.id, [1, 3]);

    expect(result).toEqual({ id: 1 });
  });
});
