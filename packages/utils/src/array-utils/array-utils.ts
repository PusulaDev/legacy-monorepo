import { getPropValue } from "../object-helper/object.helper";
import { GetPropValueType } from "../object-helper/object.helper";

class ArrayUtils {
    remove<T>(value: T[], item: T): number {
        const index = value.indexOf(item);
        if (index > -1) {
            value.splice(index, 1);
        }
        return index;
    }

    findRemove<T>(value: T[], findFunction: (item: T, index?: number, obj?: Array<T>) => boolean): void {
        let foundItems = value.filter(findFunction);
        if (foundItems.length) {
            foundItems.forEach((item) => {
                this.remove(value, item)
            });
        }
    }

    pushIf<T>(value: T[], item: T, statement: (item: T[]) => boolean) {
        const res = statement(value);
        if (res) {
            value.push(item);
        }

        return res
    }

    pushIfUnique<T>(value: T[], item: T, uniqueKey: GetPropValueType<T>) {
        const isUnique = !value.some(e => getPropValue(e, uniqueKey) === getPropValue(item, uniqueKey))
        if (isUnique)
            value.push(item);

        return isUnique
    }

    mapIf<T, T2>(value: T[], map: (item: T) => T2, condition: (item: T) => boolean): T2[] {
        const res: T2[] = [];
        for (const item of value) {
            if (condition(item)) res.push(map(item));
        }

        return res;
    }

    distinct<T>(value: T[], getProp?: GetPropValueType<T>) {
        return value.filter((e: T, index: number, arr: Array<T>) => {
            if (getProp) {
                const value = getPropValue(e, getProp);

                return arr.findIndex((item) => getPropValue(item, getProp) === value) === index;
            }
            return arr.indexOf(e) === index;
        });
    }

}

export const arrayUtils = new ArrayUtils();