export function mapToArray<T>(
  mapperFunction: (value: any, index?: number, array?: any) => Promise<T> | T,
  after?: Function
): MethodDecorator {
  return map(mapperFunction, true, after);
}

export function mapTo<T>(
  mapperFunction: (value: any, index?: number, array?: any) => Promise<T> | T,
  after?: Function
): MethodDecorator {
  return map(mapperFunction, false, after);
}

function map<T>(
  mapperFunction: (value: any, index?: number, array?: any) => Promise<T> | T,
  array: boolean,
  after?: Function
): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let res = await originalMethod.apply(this, args);
      if (res) {
        let mapped: any;
        if (array && res instanceof Array) {
          mapped = await Promise.all(res.map(mapperFunction));
        } else {
          mapped = await mapperFunction(res);
        }

        if (after) after(res, mapped);

        return mapped;
      }
    };

    return descriptor;
  };
}
