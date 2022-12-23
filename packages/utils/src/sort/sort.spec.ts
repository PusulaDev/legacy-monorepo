import { sortUtil } from "./sort.util";

describe("Sort Util", () => {
  describe("compareFn", () => {
    it("should compare two dates", () => {
      const date1 = { date: "2020-01-01T:00:00:0000" };
      const date2 = { date: "2020-02-01T:00:00:0000" };

      const result = sortUtil.compareFn(date1, date2, (e) => e.date);
      const resultReverse = sortUtil.compareFn(date2, date1, (e) => e.date);
      const resultDesc = sortUtil.compareFn(date1, date2, (e) => e.date, true);

      const resultSame = sortUtil.compareFn(date2, date2, (e) => e.date);

      expect(result).toBe(-1);
      expect(resultReverse).toBe(1);
      expect(resultDesc).toBe(1);
      expect(resultSame).toBe(0);
    });

    it("should sort by date", () => {
      let items = [{ date: "2020-01-01T:00:00:0000" }, { date: "2020-02-01T:00:00:0000" }];

      items.sort((a, b) => sortUtil.compareFn(a, b, (e) => e.date));

      expect(items[0].date).toBe("2020-01-01T:00:00:0000");
    });

    it("should sort by date desc", () => {
      let items = [{ date: "2020-01-01T:00:00:0000" }, { date: "2020-02-01T:00:00:0000" }];

      items.sort((a, b) => sortUtil.compareFn(a, b, (e) => e.date, true));

      expect(items[0].date).toBe("2020-02-01T:00:00:0000");
    });

    it("should sort numbers", () => {
      let items = [{ id: 4 }, { id: 2 }, { id: 3 }];
      items.sort((a, b) => sortUtil.compareFn(a, b, (e) => e.id));

      expect(items).toEqual([{ id: 2 }, { id: 3 }, { id: 4 }]);
    });

    it("should work with prop key", () => {
      const items = [{ name: "b" }, { name: "a" }];

      items.sort((a, b) => sortUtil.compareFn(a, b, "name"));
      expect(items).toEqual([{ name: "a" }, { name: "b" }]);
    });
  });

  describe("sort", () => {
    it("should sort by filed", () => {
      let items = [{ id: 3 }, { id: 1 }, { id: 2 }];

      sortUtil.sort(items, (e) => e.id);

      expect(items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
    });
  });

  describe("sortMultiple", () => {
    it("should sort by multiple field", () => {
      let items = [
        { name: "a", age: 3 },
        { name: "a", age: 2 },
        { name: "b", age: 1 },
      ];

      sortUtil.sortMultiple(items, { field: "name", priority: 1 }, { field: "age", priority: 2 });

      expect(items).toEqual([
        { name: "a", age: 2 },
        { name: "a", age: 3 },
        { name: "b", age: 1 },
      ]);
    });
  });
});
