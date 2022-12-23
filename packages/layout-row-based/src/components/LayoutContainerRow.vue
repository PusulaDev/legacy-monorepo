<template>
    <div class="layout-container__row">
        <div
            v-for="col in row.columns"
            :key="col"
            class="layout-container__cell"
            :class="{ 'edit-mode': editMode }"
            :data-row="row.row"
            :data-col="col"
        >
            <slot :col="col"></slot>
        </div>
        <div
            v-if="editMode"
            @mouseenter="onMouseenter"
            @mouseleave="onMouseLeave"
            class="layout-container__row-settings"
        >
            <transition name="slide-left" mode="out-in">
                <div v-if="isSettingsVisible">
                    <v-button
                        v-if="row.columns > 1"
                        @click="changeColumn(row.columns - 1)"
                        icon="minus"
                    />

                    <v-button
                        v-if="row.columns < 11"
                        @click="changeColumn(row.columns + 1)"
                        icon="plus"
                    />
                </div>
                <v-icon v-else icon="gear" />
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { LayoutRow } from "../lib/layout-row";
import IconComponent from "./icon.vue";
import cloneDeep from "lodash.clonedeep";
import ButtonComponent from "./button.vue";

@Component({
    components: {
        "v-icon": IconComponent,
        "v-button": ButtonComponent
    }
})
export default class LayoutContainerRowComponent extends Vue {
    @Prop() readonly row!: LayoutRow;
    @Prop({ type: Boolean, default: false }) readonly editMode!: boolean;

    isSettingsVisible: boolean = false;

    changeColumn(newColumn: number) {
        if (newColumn > 0 && newColumn < 12) {
            let clone = cloneDeep(this.row);
            clone.columns = newColumn;
            this.$emit("update:row", clone);
        }
    }

    onMouseenter() {
        this.isSettingsVisible = true;
    }

    onMouseLeave() {
        this.isSettingsVisible = false;
    }
}
</script>

<style scoped>
.layout-container__row {
    display: flex;
}

.layout-container__row + .layout-container__row {
    margin-top: 8px;
}

.layout-container__cell {
    flex: 1;
    flex-shrink: 0;
    overflow: hidden;
}

.layout-container__cell + .layout-container__cell {
    margin-left: 8px;
}

.layout-container__cell.edit-mode {
    padding: 10px;
}

.layout-container__row-settings {
    padding: 4px;
    border-left: 1px dotted #ededed;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
    transition-duration: 0.2s;
    transition-property: height, opacity, transform;
    transition-timing-function: cubic-bezier(0.17, 0.04, 0.03, 0.94);
    overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
    opacity: 0;
    transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
    opacity: 0;
    transform: translate(-2em, 0);
}
</style>
