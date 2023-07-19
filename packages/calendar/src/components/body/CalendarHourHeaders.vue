<template>
  <div :class="computedClass" class="calendar-hour-headers">
    <div
      v-for="hour in hours"
      :key="hour.value"
      :style="computedStyle"
      class="calendar-hour-header"
    >
      <div class="calendar-hour-header__text">{{ hour.text }}</div>
      <calendar-minute-headers
        v-if="isMinutesVisible"
        :hour="hour.value"
        :minute-interval="minuteInterval"
        :minutes="minutes(hour)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { calendarHourLogic } from '@/logic/calendar-hour.logic';
import { CalendarHour } from 'types/logic';
import { Component, Mixins, Prop } from 'vue-property-decorator';
import CalendarHourMixin from './CalendarHourMixin';
import CalendarMinuteHeadersComponent from './CalendarMinuteHeaders.vue';

@Component({
  components: {
    'calendar-minute-headers': CalendarMinuteHeadersComponent,
  },
})
export default class CalendarHourHeadersComponent extends Mixins(
  CalendarHourMixin
) {
  @Prop({ type: Boolean, default: true }) readonly isMinutesVisible: boolean;
  @Prop({ type: String }) readonly minutesRenderStartTime?: string;

  get computedClass() {
    return { narrow: !this.isMinutesVisible };
  }

  get minutes() {
    return (hour: CalendarHour) => {
      return (
        calendarHourLogic
          .createAllMinutes({
            startTime: this.startTime,
            endTime: this.endTime,
            minuteInterval: this.minuteInterval,
            minutesRenderStartTime: this.minutesRenderStartTime,
          })
          .filter((m) => m.hour?.value == hour.value) ?? []
      );
    };
  }
}
</script>
<style lang="scss" scoped>
@import '@/style/definitions.scss';

.calendar-hour-headers {
  .calendar-hour-header {
    display: flex;
    width: 60px;
    border-right: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    box-sizing: border-box;

    .calendar-hour-header__text {
      font-weight: 600;
      font-size: 1rem;
      padding: 0.5rem;
      flex: 1;
      text-align: end;
    }
  }

  &.narrow {
    .calendar-hour-header {
      width: 30px;
    }
  }
}
</style>
