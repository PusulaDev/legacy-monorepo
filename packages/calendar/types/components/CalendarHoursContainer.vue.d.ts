import { Component, Vue, Prop } from "vue-property-decorator";
import { CalendarEvent, EnumCalendarDayItemPosition } from "../logic";

@Component
export default class CalendarHoursContainerComponent extends Vue {
  @Prop({ required: true, default: () => [] }) readonly events: CalendarEvent[];
  @Prop({ type: Number, default: 4 })
  readonly horizontalMarginBetweenItems: number;
  @Prop({ type: Number, default: 20 })
  readonly hourPaddingRight: number;
  @Prop({ type: Boolean, default: false }) readonly isActionsDisabled: boolean;
  @Prop({ type: Boolean, default: false }) readonly isMinutesClickable: boolean;
  @Prop({ type: Boolean, default: false }) readonly isAreaSelectable: boolean;
  @Prop({ default: EnumCalendarDayItemPosition.Relative })
  readonly newItemPosition: EnumCalendarDayItemPosition;

  @Prop({ type: String, default: "00:00" }) readonly startTime: string;
  @Prop({ type: String, default: "23:00" }) readonly endTime: string;
  @Prop({ type: Number, default: 100 }) readonly hourHeight: number;
  @Prop({ type: Number, default: 30 }) readonly minuteInterval: number;
}
