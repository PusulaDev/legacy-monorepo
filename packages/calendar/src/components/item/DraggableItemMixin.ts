import { CalendarDayItem } from "types/logic/calendar-day-item";
import {
  Vue,
  Component,
  Prop,
  Emit,
  PropSync,
  Mixins,
} from "vue-property-decorator";
import { draggableItemLogic } from "@/logic/draggable-item.logic";
import { calendarDayItemLogic } from "@/logic/calendar-day-item.logic";
import DragTrackerMixin from "@/components/DragTrackerMixin";

@Component
export default class DraggableItemMixin extends Mixins(DragTrackerMixin) {
  @Prop({ required: true }) readonly item: CalendarDayItem;
  @Prop({ type: Number, default: 100 }) readonly hourHeight: number;
  @Prop({ type: Number, default: 30 }) readonly minuteInterval: number;
  @Prop({ type: String, default: "00:00" }) readonly startTime: string;
  @Prop({ type: String, default: "23:00" }) readonly endTime: string;
  @PropSync("isCloneVisible", { type: Boolean, default: false })
  _isCloneVisible: boolean;
  @PropSync("cloneItem")
  _cloneItem: CalendarDayItem;
  @Prop({ type: Boolean, default: false }) readonly disabled: boolean;

  mouseDown(ev: MouseEvent) {
    if (!this.item.isDraggable || this.disabled) return;

    this.calculateMouseFirstTopOffset(ev, this.item.topOffset);
    this.createClone();
    this.createMouseMoveListener();
    this.createMouseUpListener();
  }

  createClone() {
    this._cloneItem = draggableItemLogic.createClone(this.item);
  }

  showClone() {
    if (!this._isCloneVisible) this._isCloneVisible = true;
  }

  hideClone() {
    if (this._isCloneVisible) this._isCloneVisible = false;
  }

  mouseMove(ev: MouseEvent) {
    ev.preventDefault();

    const newTopOffset = this.calculateNewTopOffset(ev.pageY);
    this.handleNewTopOffset(newTopOffset);

    this.showClone();
  }

  calculateNewTopOffset(pageY: number) {
    let newTopOffset = draggableItemLogic.calculateNewTop(
      pageY,
      this.mouseFirstTopOffset
    );

    newTopOffset = draggableItemLogic.snapToMinute({
      topOffset: newTopOffset,
      minuteInterval: this.minuteInterval,
      hourHeight: this.hourHeight,
    });

    const fixedPosition = draggableItemLogic.keepInsideContainer({
      endTime: this.endTime,
      startTime: this.startTime,
      height: this._cloneItem.height,
      topOffset: newTopOffset,
      hourHeight: this.hourHeight,
      resizeToFix: false,
    });

    return fixedPosition.top;
  }

  isTopOffsetChanged(topOffset: number): boolean {
    return this._cloneItem.topOffset !== topOffset;
  }

  handleNewTopOffset(topOffset: number) {
    if (!this.isTopOffsetChanged(topOffset)) return;

    this._cloneItem = calendarDayItemLogic.updateItemTimeValues({
      item: this._cloneItem as CalendarDayItem,
      hourHeight: this.hourHeight,
      newTopOffset: topOffset,
      startTime: this.startTime,
    });

    this.move();
  }

  calculateTimeSpanFromTopOffset(topOffset: number) {
    return calendarDayItemLogic.calculateTimeSpanFromTopOffset({
      topOffset,
      hourHeight: this.hourHeight,
      startTime: this.startTime,
    });
  }

  mouseUp() {
    this.removeListeners();
    this.hideClone();

    if (this.isCloneMoved()) this.drop();
  }

  isCloneMoved() {
    return this.item.topOffset != this._cloneItem.topOffset;
  }

  move() {
    this.$emit("move", this._cloneItem, this.$el);
  }

  drop() {
    this.$emit("drop", this._cloneItem, this.$el);
  }
}
