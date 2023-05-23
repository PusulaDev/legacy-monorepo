import { describe, expect, it } from "vitest";
import { arrayUtils } from "./array-utils"

describe("Array Utils", () => {
    it("remove", () => {
        const items: number[] = [1, 2, 3, 4, 5];

        arrayUtils.remove(items, 3);

        expect(items).toEqual([1, 2, 4, 5]);
    });

    it("remove Object", () => {
        let items: { name: string }[] = [{ name: "ali" }, { name: "veli" }];
        let item = items[0];
        arrayUtils.remove(items, item);

        expect(items).toEqual([{ name: "veli" }]);
    });

    it("find remove", () => {
        const items: { id: number }[] = [{ id: 12 }, { id: 23 }];

        arrayUtils.findRemove(items, (e) => e.id == 12);

        expect(items).toEqual([{ id: 23 }]);
    });

    it("pushIf", () => {
        const items: number[] = [1, 3, 4, 5, 6];

        arrayUtils.pushIf(items, 24, (e) => 24 > 10);
        arrayUtils.pushIf(items, 8, (e) => 8 > 10);

        expect(items).toEqual([1, 3, 4, 5, 6, 24]);
    });

    it("pushIfUnique dont push", () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

        arrayUtils.pushIfUnique(items, { id: 2 }, 'id');

        expect(items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
    })

    it("pushIfUnique push", () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

        arrayUtils.pushIfUnique(items, { id: 5 }, 'id');

        expect(items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 5 }])
    })

    it("pushIfUnique with prop method", () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];

        arrayUtils.pushIfUnique(items, { id: 2 }, (e) => e.id);

        expect(items).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }])
    })

    it("mapIf", () => {
        const items = [1, 2, 3, 4, 5, 6];
        const result = arrayUtils.mapIf(items,
            (e) => e,
            (e) => e % 2 !== 0
        );
        expect(result).toEqual([1, 3, 5]);
    });

    it("distinc", () => {
        let items: string[] = ["ali", "veli", "ayşe", "veli", "ali"];
        items = arrayUtils.distinct(items);

        expect(items.length).toEqual(3);
    });

    it("distinc with field", () => {
        let items = [{ name: "ali" }, { name: "ali" }, { name: "veli" }];
        items = arrayUtils.distinct(items, (e) => e.name);

        expect(items).toEqual([{ name: "ali" }, { name: "veli" }]);
    });
})