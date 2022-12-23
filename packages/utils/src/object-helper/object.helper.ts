import { isFunction } from "../type-check/type-check";

export type GetPropValueType<T, TRes = any> = ((item: T) => TRes) | keyof T;

export const getPropValue = <T>(value: T, getProp: GetPropValueType<T>) => {
  return isFunction(getProp) ? getProp(value) : value[getProp];
};
