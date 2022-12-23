<template>
  <div class="calendar-minute-headers">
    <div
      v-for="minute in minutes"
      :key="minute.text"
      class="calendar-minute-header"
    >
      {{ minute.text }}
    </div>
  </div>
</template>
<script lang="ts">
import { calendarHourLogic } from "@/logic/calendar-hour.logic";
import { MinuteInterval } from "types/logic";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CalendarMinuteHeadersComponent extends Vue {
  @Prop({ required: true, type: Number }) readonly hour: number;
  @Prop({ required: true, type: Number }) readonly minuteInterval: number;
  @Prop({ required: true }) readonly minutes: MinuteInterval[];
}
</script>
<style scoped lang="scss">
.calendar-minute-headers {
  display: flex;
  flex-direction: column;
  .calendar-minute-header {
    font-weight: 300;
    font-size: 0.75rem;
    padding-right: 0.5rem;
    color: #777;
    flex: 1;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }
}
</style>
