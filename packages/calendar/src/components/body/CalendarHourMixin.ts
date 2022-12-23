import { calendarHourLogic } from "@/logic/calendar-hour.logic";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CalendarHourMixin extends Vue {
  @Prop({ type: String, default: "00:00" }) readonly startTime: string;
  @Prop({ type: String, default: "23:00" }) readonly endTime: string;
  @Prop({ type: Number, default: 100 }) readonly hourHeight: number;
  @Prop({ type: Number, default: 30 }) readonly minuteInterval: number;

  get computedStyle() {
    return { height: `${this.hourHeight}px` };
  }

  get hours() {
    return calendarHourLogic.createHoursArray(this.startTime, this.endTime);
  }
}
