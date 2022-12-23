export interface GroupModel<T> {
  [key: string]: T[];
}

export interface GroupItem<T, ChildType = T> {
  key: string;
  values: T[];
  children?: GroupItem<ChildType>[];
}
