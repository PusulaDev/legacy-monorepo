import cloneDeep from "lodash.clonedeep";
import { getBrowserLang } from "../browser-language/browser-language.util";
import { getPropValue, GetPropValueType } from "../object-helper/object.helper";

export type SortOption<T> = {
  field: GetPropValueType<T>;
  priority: number;
  desc?: boolean;
};

export class SortUtil {
  private readonly undefinedSortValue: string = "-999999999";

  sort<T>(items: T[], fieldFn: GetPropValueType<T>, desc: boolean = false) {
    items.sort((a, b) => this.compareFn(a, b, fieldFn, desc));
  }

  sortMultiple<T>(items: T[], ...options: SortOption<T>[]) {
    const orderedOptions = [...options].sort((a, b) => a.priority - b.priority);

    items.sort((a, b) => {
      for (const option of orderedOptions) {
        const res = this.compareFn(a, b, option.field, option.desc);
        if (res !== 0) return res;
      }

      return 0;
    });
  }

  compareFn<T>(prevValue: T, value: T, getProp: GetPropValueType<T>, desc: boolean = false) {
    let prevClone = cloneDeep(prevValue);
    let valueClone = cloneDeep(value);

    let x = this.getPropValue(prevClone, getProp);
    let y = this.getPropValue(valueClone, getProp);

    if (typeof x === "string" && typeof y === "string") {
      x = x.toLocaleLowerCase(getBrowserLang());
      y = y.toLocaleLowerCase(getBrowserLang());

      let compareRes = (x as string).localeCompare(y, getBrowserLang());
      return desc ? compareRes * -1 : compareRes;
    }

    if (Number(x) && Number(y)) {
      return this.sortNumberOrDate(x, y, desc);
    }

    if (desc) {
      if (x < y) {
        return 1;
      }
      if (x > y) {
        return -1;
      }
    } else {
      if (x > y) {
        return 1;
      }
      if (x < y) {
        return -1;
      }
    }

    return 0;
  }

  getPropValue<T>(value: T, getProp: GetPropValueType<T>) {
    return getPropValue(value, getProp) ?? this.undefinedSortValue;
  }

  sortNumberOrDate(x: number | Date, y: number | Date, desc: boolean) {
    if (desc) {
      if (x < y) {
        return 1;
      }
      if (x > y) {
        return -1;
      }
    } else {
      if (x > y) {
        return 1;
      }
      if (x < y) {
        return -1;
      }
    }

    return 0;
  }
}

export const sortUtil = new SortUtil();
