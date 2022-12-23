import { DateUtil } from "../date/date.util";
import { getBrowserLang } from "../browser-language/browser-language.util";
import { getPropValue, GetPropValueType } from "../object-helper/object.helper";

export class FilterUtil {
  compareFn<T>(item: T, getProp: GetPropValueType<T>, term: string): boolean {
    let prop = getPropValue(item, getProp);
    if (prop === undefined) false;

    term = term.trim().toLocaleLowerCase(getBrowserLang());

    if (typeof prop === "string") {
      if (DateUtil.checkApiStringValidity(prop)) {
        let date = new Date(prop);
        date.setHours(0, 0, 0, 0);
        let dateString = DateUtil.dateToApiDate(date);
        term = term.toLowerCase();
        return dateString == term;
      }

      return prop.toLocaleLowerCase(getBrowserLang()).indexOf(term) > -1;
    }

    return prop == term;
  }

  filter<T>(items: T[], term: string, ...filterMethods: GetPropValueType<T>[]): T[] {
    return items.filter((e) => {
      return filterMethods.some((method) => this.compareFn(e, method, term));
    });
  }
}

export const filterUtil = new FilterUtil();
