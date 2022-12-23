import { getPropValue, GetPropValueType } from "../object-helper/object.helper";

class RecursionUtil {
  runRecursive<T>(items: T[], childrenField: GetPropValueType<T>, fn: (e: T) => any) {
    items.forEach((item) => {
      fn(item);
      const children = getPropValue(item, childrenField);
      if (children) this.runRecursive(children, childrenField, fn);
    });
  }
}

export const recursionUtil = new RecursionUtil();
