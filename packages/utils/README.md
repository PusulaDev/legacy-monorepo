### Table of contents

- [Utilities For Web Projects](#utilities-for-web-projects)
  - [Filter Util](#filter-util)
  - [Sort Util](#sort-util)
  - [Dom Helper](#dom-helper)
  - [Browser Storage](#browser-storage)
  - [Cache Helpers](#cache-helpers)
  - [Data Change Tracker](#data-change-tracker)
  - [Position Calculator](#position-calculator)
  - [Unique List](#unique-list)
  - [Chain Functions](#chain-functions)
  - [Function Decoratos](#function-decoratos)
  - [Conditional Helpers](#conditional-helpers)
  - [Extend Array](#extend-array)

## Utilities For Web Projects

Some helper classes for web.

### [Filter Util](#filterUtil)

Search helper for lists. Search values in array with predicate or field string. Also multiple field can be searched.

```Typescript
const items = [{ name: "salih" }, { name: "Ali" }];
const filtered = filterUtil.filter(items, "Sa", "name"); //[{ name: "salih" }]

-------

const items = [
  { name: "salih", surname: "sayer" },
  { name: "Deli", surname: "tuna" },
  { name: "Elif", surname: "pon" },
];

//multiple field
const filtered = filterUtil.filter(
  items,
  "a",
  (e) => e.name,
  (e) => e.surname
);

//[{ name: "salih", surname: "sayer" },{ name: "Deli", surname: "tuna" }]
```

### [Sort Util](#sortUtil)

Sort helper for lists. Sort by single or multiple field.
field arguments can be string or predicate

```Typescript
let items = [{ id: 3 }, { id: 1 }, { id: 2 }];

sortUtil.sort(items, (e) => e.id); // [{ id: 1 }, { id: 2 }, { id: 3 }]

-----------

 let items = [
  { name: "a", age: 3 },
  { name: "a", age: 2 },
  { name: "b", age: 1 },
];

sortUtil.sortMultiple(items,
  { field: "name", priority: 1 },
  { field: (e) => e.age, priority: 2 }
);
//[{ name: "a", age: 2 },{ name: "a", age: 3 },{ name: "b", age: 1 },]


```

### [Dom Helper](#domUtil)

Some dome helper methods

```Typescript
domUtil.findParentElement(el,'class','id');
domUtil.randomColor();
domUtil.touchPositionInelement(ev,parentElement);
domUtil.checkIsAtTheBottom(options);
domUtil.handleInfineteScroll(element,() => console.log('at the bottom'));
```

### [Browser Storage](#browserStorageUtil)

sessionStorage and localStorage helpers

```Typescript
sessionStorageUtil.setItem('key','value');
sessionStorageUtil.getItem('key');
sessionStorageUtil.removeItem('key');
sessionStorageUtil.clear();

localeStorageUtil.setItem('key','value')
...
```

### [Cache Helpers](#cacheUtil)

Cache data to browser storage with function calls or decorators.
Decorators caches the return value with the name of method + args as key

```Typescript
cacheUtil.add(EnumCacheType.SessionStorage,'key',{id:1});
cacheUtil.get(EnumCacheType.SessionStorage,'key')
cacheUtil.clear(EnumCacheType.SessionStorage,'key');

@cacheUtil.cache(EnumCacheType.SessionStorage)
testMethod(){
  return {id:1}
}

```

### [Data Change Tracker](#dateChangeTracker)

Check if data is changed when a popup is opened and user tries to close it.

```Typescript
let data: string = "test";
let uuid = dataChangeTracker.registerData(data);
data = "test2";

dataChangeTracker.isDataChanged(uuid, data) // true
```

### [Position Calculator](#positionCalculator)

Calculate positions for elements like tooltip, popover.
Most of the methods works with **ElementDimensions** typed objects.
**createDimension(el:HTMLElement)** method creates that object.

```Typescript
const offset positionCalculator.offset(el);

const dimension positionCalculator.createDimensions(el);

positionCalculator.isDimensionOutOfScreen(dimensions);
positionCalculator.horizontalCenter(dimensions);
positionCalculator.verticalCenter(dimensions);
positionCalculator.shiftToFitScreen(dimensions);
positionCalculator.snapToBottom(dimensions);
positionCalculator.snapToTop(dimensions);
positionCalculator.snapToLeft(dimensions);
positionCalculator.snapToRight(dimensions);
```

### [Unique List](#uniquelist)

Create a uniquelist with compareFunction.
push method prevents same values to be added with compareFunction
remove method finds and removes values using compareFunction

```Typescript
const list = createUniqueList(
    (a: number, b: number) => a === b, //compareFn
    [1, 2, 3] // initial values. Optional
);
list.push(2);

// list = [1,2,3]
```

```Typescript
type ListItem = { id: number };

const list = createUniqueList(
    (a: ListItem, b: ListItem) => a.id === b.id,
    [{ id: 1 }, { id: 3 }]
);

list.remove({ id: 1 });

// list = [{ id: 3 }]
```

### [Chain Functions](#chainfunctions)

Run functions consecutive with optional conditions.
Next function uses previous functions return value.
If any required condition is not met returns 'null'

```typescript
const chain = new ChainFunctions(
  (value: number) => value + 2,
  (value: number) => value * 3
);

const result = chain.run(1); // 9

-------------
//with condition
const firstFn = (value: string) => value + "-";
const secondFn = {
    fn: (value: string) => value + ":",
    when: (value: string) => value.indexOf("true") > -1,
};

const chain = new ChainFunctions(firstFn,secondFn);

const result = chain.run("false"); // false-

-------------
//with required
const firstFn = (value: number) => value * 10;
const secondFn = {
    fn: (value: number) => value * 10,
    when: (value: number) => value < 100,
    required: true,
}
const thirdFn = (value: number) => value * 2

const chain = new ChainFunctions(firstFn,secondFn,thirdFn);

const result = chain.run(10); // null

```

### [Function Decoratos](#functionDecorators)

Function decorators that maps or caches the result of function.

```Typescript

@mapTo(mapFunction)
testMethod(){
  return {id:1}
}

@mapToArray(mapFunction)
testMethod(){
  return [{id:1}]
}

@cache(EnumCacheType.SessionStorage)
testMethod(){
  return {id:1}
}

@cacheToMemory()
testMethod(){
  return {id:1}
}

@cacheToLocalStorage()
testMethod(){
  return {id:1}
}

@cacheToSessionStorage()
testMethod(){
  return {id:1}
}
```

### [Conditional Helpers](#conditionalHelpers)

Helpers for simple switch , if-else

```Typescript
//SWITCH
const conditional = createSwitch({ "1": 1, "2": 2, "3": 3 });
const result = conditional("3") // 3;

//with default value
const conditional = createSwitch<string, number | string>({ "1": 1 }, "");
const result = conditional("3"); // ""

//with function
const conditional = createSwitch({ "1": (value: string) => +value, "2": (value: string) => +value * 2 });
const result = conditional("2")?.("2"); // 4

//IF-ELSE : only runs the first met condition
const conditional = createConditional(
  [(value: number) => value < 5, "small"],
  [(value: number) => value > 5, "big"],
  [(value: number) => true , "default"]
);

const result = conditional(6); // "big"

//with function
const conditional = createConditional(
  [(value: boolean) => value, (value: number) => value * 2],
  [(value: boolean) => !value, (value: number) => value / 2]
);

const result = conditional(false)?.(2); // 1
```

### [Extend Array](#extendArray)

multiple extended methods for array prototype. call **extendArray()** method to add all methods to array.

```Typescript
remove(o: T): number;

last(): T;

findRemove(findFunction?: (item: T, index?: number, obj?: Array<T>) => boolean): void;

pushIf(item: T, statement?: (arr: Array<T>) => boolean): void;

pushRange(items: Array<T>, statement?: (item: T) => boolean): void;

forEachAsync(callback: (item: T, index: number, array: T[]) => void): Promise<void>;

toGroupModel(groupBy: (item: T) => any): GroupModel<T>;

toGroupModelValues(groupBy: (item: T) => any): T[][];

sum(statement: (item: T) => number): number;

toGroupItems<ChildType = T>(
  groupBy: (item: T) => any,
  itemChildProp?: (item: T) => any,
  childGroupBy?: (item: ChildType) => any
): GroupItem<T, ChildType>[];

distinct(getProp?: GetPropValueType<T>): Array<T>;

mapIf<T2>(map: (item: T) => T2, condition: (item: T) => boolean): Array<T2>;

filterByCollection<T2>(getProp: (item: T) => T2, collection: T2[]): T[];

filterByExcludesCollection<T2>(getProp: (item: T) => T2, collection: T2[]): T[];

findByCollection<T2>(getProp: (item: T) => T2, collection: T2[]): T;

```
