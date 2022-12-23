export class BrowserStorageUtil {
  protected storage = window.sessionStorage;
  private inMemoryStorage: { [key: string]: string } = {};

  private isSupported() {
    try {
      const key = "__some_random_key_you_are_not_going_to_use__";
      this.storage.setItem(key, key);
      this.storage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  clear() {
    if (this.isSupported()) {
      this.storage.clear();
    } else {
      this.inMemoryStorage = {};
    }
  }

  getItem(name: string): string | null {
    if (this.isSupported()) {
      return this.storage.getItem(name);
    }
    if (this.inMemoryStorage.hasOwnProperty(name)) {
      return this.inMemoryStorage[name];
    }
    return null;
  }

  key(index: number): string | null {
    if (this.isSupported()) {
      return this.storage.key(index);
    } else {
      return Object.keys(this.inMemoryStorage)[index] || null;
    }
  }

  removeItem(name: string) {
    if (this.isSupported()) {
      this.storage.removeItem(name);
    } else {
      delete this.inMemoryStorage[name];
    }
  }

  setItem(name: string, value: string): void {
    if (this.isSupported()) {
      this.storage.setItem(name, value);
    } else {
      this.inMemoryStorage[name] = value;
    }
  }
}

export class SessionStorageUtil extends BrowserStorageUtil {
  protected static storage = window.sessionStorage;
}

export class LocalStorageUtil extends BrowserStorageUtil {
  protected static storage = window.localStorage;
}

export const sessionStorageUtil = new SessionStorageUtil();
export const localStorageUtil = new LocalStorageUtil();
