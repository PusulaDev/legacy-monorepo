import cloneDeep from "lodash.clonedeep";
import { uuidv4 } from "../uuid/uuid.util";

export class DataChangeTracker {
  private dataStore: {
    [key: string]: any;
  } = {};

  registerData(data: any, id?: string) {
    let uuid = id ?? uuidv4();
    this.dataStore[uuid] = cloneDeep(data);
    return uuid;
  }

  isDataChanged(uid: string, data: any) {
    let oldData = this.dataStore[uid];

    if (!oldData) throw "this data is not registered";

    return JSON.stringify(oldData) != JSON.stringify(cloneDeep(data));
  }
}

export const dataChangeTracker = new DataChangeTracker();
