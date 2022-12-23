# @sabasayer/calendar

Basic one day calendar.

## Usage

Use calendar-day component for one day.

```html
<calendar-day
  @item-click="itemClicked"
  @item-drop="itemDrop"
  @item-resize="itemResize"
  @area-select="areaSelect"
  header="My Day"
  :start-time="startTime"
  :end-time="endTime"
  :events="events"
  :hour-height="hourHeight"
  :minute-interval="minuteInterval"
  :hour-padding-right="20"
  :is-area-selectable="true"
/>
```

events:

```typescript
interface CalendarEvent<T = undefined> {
  id: string | number;
  /**
   * timeSpan
   */
  from: string;
  /**
   * timeSpan
   */
  to: string;
  title: string;
  /**
   * valid css color
   */
  color: string;
  borderColor?: string;
  textColor?: string;
  isBordered?: boolean;
  borderRadius?: string;
  /**
   * Effects render with collided items 
   */
  position: EnumCalendarDayItemPosition;
  /**
   * Must be bigger then zero
   */
  zIndex: number;

  isClickable?: boolean;
  isDraggable?: boolean;
  isResizable?: boolean;

  /**
   * Data for customization
   */
  detail?: T;
}
```

## Props

```typescript

    hasHeader: boolean;
    startTime?: string;
    endTime?: string;
    hourHeight: number;
    isHoursVisible: boolean;
    isMinutesVisible: boolean;
    Header?: string;
    events: CalendarEvent[];
    horizontalMarginBetweenItems: number;
    minuteInterval: number;
    hourPaddingRight: number;
    isActionsDisabled: boolean;
    isMinutesClickable: boolean;
    isAreaSelectable: boolean;
    newItemPosition: EnumCalendarDayItemPosition;
```

## Slots

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```
