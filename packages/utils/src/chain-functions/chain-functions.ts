import { isFunction } from "../type-check/type-check";

export type ChainObj = {
  fn: Function;
  when: (...args: any[]) => boolean | Promise<boolean>;
  required?: boolean;
};
export type ChainRing = Function | ChainObj;

export class ChainFunctions {
  private functions: ChainRing[] = [];
  constructor(...functions: ChainRing[]) {
    this.functions = functions;
  }

  run(...initialArgs: any[]) {
    let args: any = initialArgs;

    for (const ring of this.functions) {
      const argsArray = this.makeArray(args);

      if (isFunction(ring)) {
        args = ring(...argsArray);
      } else {
        const isMet = ring.when(...argsArray);

        if (isMet) args = ring.fn(...argsArray);
        else if (ring.required) return null;
      }
    }

    return args;
  }

  async runAsync(...initialArgs: any[]) {
    let args: any = initialArgs;

    for (const ring of this.functions) {
      const argsArray = this.makeArray(args);

      if (isFunction(ring)) {
        args = await ring(...argsArray);
      } else {
        const isMet = await ring.when(...argsArray);

        if (isMet) args = await ring.fn(...argsArray);
        else if (ring.required) return null;
      }
    }

    return args;
  }

  private makeArray(args: any) {
    return args instanceof Array ? args : [args];
  }
}
