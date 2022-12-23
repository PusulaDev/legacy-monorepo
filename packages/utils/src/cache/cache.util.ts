import { localStorageUtil, sessionStorageUtil } from "../browser-storage/browser-storage.util";
import { EnumCacheType } from "./cache-type.enum";

export class CacheUtil {
  private data: { [key: string]: any } = {};

  private addToMemory = (key: string, data: any) => (this.data[key] = data);

  private getFromMemory = (key: string) => this.data[key];

  private clearMemory = (key: string) => delete this.data[key];

  private addToLocalStorage = (key: string, data: any) => localStorageUtil.setItem(key, JSON.stringify(data));

  private getFromLocalStorage = (key: string) => {
    let data = localStorageUtil.getItem(key);
    if (data) return JSON.parse(data);
    return null;
  };

  private clearLocalStorage = (key: string) => {
    localStorageUtil.removeItem(key);
  };

  private addToSessionStorage = (key: string, data: any) => sessionStorageUtil.setItem(key, JSON.stringify(data));

  private getFromSessionStorage = (key: string) => {
    let data = sessionStorageUtil.getItem(key);
    if (data) return JSON.parse(data);
    return null;
  };

  private clearSessionStorage = (key: string) => {
    sessionStorageUtil.removeItem(key);
  };

  add(type: EnumCacheType, key: string, data: any) {
    if (data == undefined) return;
    switch (type) {
      case EnumCacheType.Memory:
        this.addToMemory(key, data);
        break;
      case EnumCacheType.SessionStorage:
        this.addToSessionStorage(key, data);
        break;
      case EnumCacheType.LocalStorage:
        this.addToLocalStorage(key, data);
        break;
      case EnumCacheType.IndexedDB:
        //TODO: indexedDb set
        break;
    }
  }

  get(type: EnumCacheType, key: string) {
    switch (type) {
      case EnumCacheType.Memory:
        return this.getFromMemory(key);
      case EnumCacheType.SessionStorage:
        return this.getFromSessionStorage(key);
      case EnumCacheType.LocalStorage:
        return this.getFromLocalStorage(key);
      case EnumCacheType.IndexedDB:
        //TODO: indexedDb get
        break;
    }
  }

  clear(type: EnumCacheType, key: string) {
    switch (type) {
      case EnumCacheType.Memory:
        return this.clearMemory(key);
      case EnumCacheType.SessionStorage:
        return this.clearSessionStorage(key);
      case EnumCacheType.LocalStorage:
        return this.clearLocalStorage(key);
      case EnumCacheType.IndexedDB:
        //TODO: indexedDb get
        break;
    }
  }

  cache(type: EnumCacheType): MethodDecorator {
    const self = this;
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args: any[]) {
        let key = args.reduce((key: string, item: any) => {
          key += "_" + JSON.stringify(item);
          return key;
        }, "");

        key = target.name + "_" + propertyKey.toString() + "_" + key;

        let data = self.get(type, key);
        if (data) return data;

        let res = await originalMethod.apply(this, args);
        self.add(type, key, res);
        return res;
      };

      return descriptor;
    };
  }
}

export const cacheUtil = new CacheUtil();
