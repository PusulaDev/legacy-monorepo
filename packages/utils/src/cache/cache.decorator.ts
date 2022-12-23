import { EnumCacheType } from "./cache-type.enum";
import { cacheUtil } from "./cache.util";

export function cache(type: EnumCacheType): MethodDecorator {
  return cacheUtil.cache(type);
}

export function cacheToMemory(): MethodDecorator {
  return cacheUtil.cache(EnumCacheType.Memory);
}

export function cacheToLocalStorage(): MethodDecorator {
  return cacheUtil.cache(EnumCacheType.LocalStorage);
}

export function cacheToSessionStorage(): MethodDecorator {
  return cacheUtil.cache(EnumCacheType.SessionStorage);
}

export function cacheToIndexedDB(): MethodDecorator {
  return cacheUtil.cache(EnumCacheType.IndexedDB);
}
