import { GroupItem, GroupModel } from "./data-group.interface";

export class DataGroupUtil {
  toGroupModel<T>(items: T[], groupBy: (item: T) => any): GroupModel<T> {
    let groupModel: GroupModel<T> = {};

    items.forEach((item) => {
      let paramValue = groupBy(item);

      if (paramValue == undefined) return;

      let groupKey = (paramValue + "").trim();
      if (!groupModel.hasOwnProperty(groupKey)) {
        groupModel[groupKey] = [];
      }

      groupModel[groupKey].push(item);
    });

    return groupModel;
  }

  toGroupItems<T, ChildType = T>(
    items: T[],
    groupBy: (item: T) => any,
    itemChildProp?: (item: T) => any,
    childGroupBy?: (item: ChildType) => any
  ): GroupItem<T, ChildType>[] {
    let list: GroupItem<T, ChildType>[] = [];

    items.forEach((item) => {
      let paramValue = groupBy(item);
      if (paramValue == undefined) return;

      let groupKey = (paramValue + "").trim();
      let groupItem = list.find((e) => e.key == groupKey);
      if (!groupItem) {
        groupItem = {
          key: groupKey,
          values: [],
          children: childGroupBy ? [] : undefined,
        };
        list.push(groupItem);
      }
      groupItem.values.push(item);
    });

    if (childGroupBy && itemChildProp) {
      list.forEach((item) => {
        let children = item.values.flatMap((v) => itemChildProp(v) || []) as any[];
        let childrenGroups = (children as ChildType[]).toGroupItems<ChildType>(childGroupBy);
        item.children = childrenGroups;
      });
    }

    return list;
  }
}

export const dataGroupUtil = new DataGroupUtil();
