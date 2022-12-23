<template>
    <div v-if="item" class="layout-container__item" :data-id="item.id">
        <div v-if="editMode" class="layout-container__item-toolbar">
            <div class="layout-container__item-handle">
                <v-icon icon="move" />
            </div>
            <slot name="toolbar"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { LayoutItem } from "../lib/layout-row";
import IconComponent from "./icon.vue";

@Component({
    components: {
        "v-icon": IconComponent
    }
})
export default class LayoutContainerItemComponent extends Vue {
    @Prop() readonly item!: LayoutItem;
    @Prop({ type: Boolean, default: false }) readonly editMode!: boolean;
}
</script>

<style scoped>
.layout-container__item + .layout-container__item {
    margin-top: 8px;
}
.layout-container__item-toolbar {
    display: flex;
    background-color: white;
    align-items: center;
}
.layout-container__item-handle {
    padding: 4px;
    cursor: move;
}
.layout-container__item-handle:hover {
    background-color: rgba(0, 0, 0, 0.1);
}
</style>
