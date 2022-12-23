<template>
    <button @click="click" class="layout-container__button">
        <v-icon :icon="icon" :color="iconColor" />
    </button>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { LayoutItem } from "../lib/layout-row";
import IconComponent from './icon.vue';

@Component({
    components:{
        "v-icon": IconComponent
    }
})
export default class ButtonComponent extends Vue {
    @Prop() readonly icon!: string;
    @Prop({ type: String, default: "black" }) readonly iconColor!: string;

    click(event: MouseEvent) {
        this.$emit("click", event);
    }
}
</script>
<style>
.layout-container__button {
    border: none;
    background: #cccccc;
    display: inline-flex;
    align-items: center;
    padding: 4px 6px;
    cursor: pointer;
}

.layout-container__button:hover {
    background: #bbbbbb;
}

.layout-container__button:active,
.layout-container__button:focus {
    background: #aaaaaa;
}

.layout-container__button + .layout-container__button {
    margin-left: 4px;
}
</style>