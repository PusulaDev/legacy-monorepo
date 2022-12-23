import { GroupModel, GroupItem } from "./data-group.interface";
import { dataGroupUtil, DataGroupUtil } from "./data-group.util";

describe("DataGroupUtil", () => {
  test("toGroupModel", () => {
    let items: { value: string; id: number }[] = [
      { value: "first", id: 1 },
      { value: "second", id: 2 },
      { value: "first", id: 3 },
    ];

    let group = dataGroupUtil.toGroupModel(items, (e) => e.value);

    let expectGroup: GroupModel<{ value: string; id: number }> = {
      first: [
        { value: "first", id: 1 },
        { value: "first", id: 3 },
      ],
      second: [{ value: "second", id: 2 }],
    };

    expect(JSON.stringify(group)).toEqual(JSON.stringify(expectGroup));
  });

  test("toGroupItems", () => {
    let items: { value: string; id: number }[] = [
      { value: "first", id: 1 },
      { value: "second", id: 2 },
      { value: "first", id: 3 },
    ];

    let groupItems = dataGroupUtil.toGroupItems(items, (e) => e.value);

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
});
