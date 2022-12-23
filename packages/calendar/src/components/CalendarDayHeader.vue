<template>
  <div class="calendar-day__header">
    <slot>
      {{ header }}
    </slot>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CalendarDayHeaderComponent extends Vue {
  @Prop({ type: String }) readonly header?: string;
}
</script>
<style scoped lang="scss">
@import "@/style/definitions.scss";

.calendar-day__header {
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  border-bottom: 1px solid $border-color;
  padding: 0.5rem;
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 5;
}
</style>
