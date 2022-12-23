import { filterUtil } from "./filter.util";

describe("Filter Util", () => {
  it("should filter by field", () => {
    const items = [{ name: "salih" }, { name: "Ali" }];

    const filtered = filterUtil.filter(items, "Sa", "name");
    expect(filtered).toEqual([{ name: "salih" }]);
  });

  it("should filter by multiple field", () => {
    const items = [
      { name: "salih", surname: "sayer" },
      { name: "Deli", surname: "tuna" },
      { name: "Elif", surname: "pon" },
    ];

    const filtered = filterUtil.filter(
      items,
      "a",
      (e) => e.name,
      (e) => e.surname
    );

    expect(filtered).toEqual([
      { name: "salih", surname: "sayer" },
      { name: "Deli", surname: "tuna" },
    ]);
  });
});
