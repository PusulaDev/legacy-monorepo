export const createSwitch = <T extends string | number | symbol, TRes>(cases: Record<T, TRes>, defaultValue?: TRes) => {
  return (value: T) => cases[value] ?? defaultValue;
};

/**
 * Returns the second value of array that first met the condition
 * @param conditions conditions
 * @returns The second element of met array
 */
export const createConditional = <TArg, TValue>(...conditions: [(...args: TArg[]) => boolean, TValue][]) => {
  return (...args: TArg[]) => conditions.find(([_if, _value]) => _if(...args))?.[1];
};
