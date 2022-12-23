import { IValueTextPair } from "./value-text-pair.interface";

/**
 * Converts number type enum's to ValueTexPair array
 */
export abstract class EnumUtil {
  static isValueExists(enumType: Object, value: any) {
    return Object.values(enumType).includes(value);
  }

  static toValueTextPair<T>(
    enumType: T,
    condition?: (enumValue: number) => boolean,
    textFn?: (enumValue: number) => string
  ): IValueTextPair[] {
    let items: IValueTextPair[] = [];
    for (let type in enumType) {
      if (!isNaN(type as any)) {
        let number = parseInt(type);

        if (!condition || condition(number)) {
          items.push({
            text: textFn ? textFn(type as any) : (enumType as any)[number],
            value: number,
          });
        }
      }
    }

    return items;
  }

  static flaggedEnumToValueTextPair<T>(enumType: T, value: number): IValueTextPair[] {
    return EnumUtil.toValueTextPair(enumType, (enumValue: number) => (value & enumValue) == enumValue);
  }
}
