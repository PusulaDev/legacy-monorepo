<template >
    <div class="layout-container__icon" :style="style">
        <svg v-if="icon == 'gear'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.495 25.5">
            <path
                d="M24.745 14.194V11.3l-3.625-.657a8.556 8.556 0 00-.961-2.333l2.095-3.023-2.046-2.046-3 2.085a8.793 8.793 0 00-2.36-.993h-.006L14.196.751h-2.893l-.64 3.544a8.509 8.509 0 00-2.442.982L5.29 3.242 3.244 5.288l2.013 2.9a8.471 8.471 0 00-1.053 2.492l-3.452.624v2.893l3.442.624a8.351 8.351 0 001.047 2.513l-2 2.882 2.046 2.041 2.893-2.009a8.434 8.434 0 002.486 1l.635 3.5h2.893l.641-3.538a8.742 8.742 0 002.4-1.015l2.969 2.057 2.046-2.041-2.079-3a8.766 8.766 0 00.961-2.366zM12.669 16.56a3.791 3.791 0 113.788-3.788 3.793 3.793 0 01-3.788 3.788z"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
            />
        </svg>
        <svg v-else-if="icon == 'plus'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.5 21.5">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                <path d="M10.752.75v20M20.75 10.751h-20" />
            </g>
        </svg>
        <svg v-else-if="icon == 'minus'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.5 1.5">
            <path
                d="M12.75.75h-12"
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1.5"
            />
        </svg>
        <svg
            v-else-if="icon == 'move'"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 492.001 492.001"
            style="enable-background:new 0 0 492.001 492.001;"
            xml:space="preserve"
        >
            <g>
                <g>
                    <path
                        d="M487.97,237.06l-58.82-58.82c-5.224-5.228-14.376-5.228-19.592,0l-7.436,7.432c-5.4,5.4-5.4,14.064,0,19.46l21.872,21.74
			H265.206V68.396l21.808,22.132c5.224,5.22,14.216,5.22,19.428,0l7.36-7.432c5.404-5.404,5.356-14.196-0.044-19.596L254.846,4.444
			c-2.6-2.592-6.088-4.184-9.804-4.184h-0.404c-3.712,0-7.188,1.588-9.784,4.184l-57.688,57.772
			c-2.612,2.608-4.052,6.124-4.052,9.836c0,3.704,1.44,7.208,4.052,9.816l7.432,7.444c5.224,5.22,14.612,5.228,19.828,0.004
			l22.368-22.132v159.688H67.814l22.14-22.008c2.608-2.608,4.048-6.028,4.048-9.732s-1.44-7.16-4.052-9.76l-7.436-7.42
			c-5.22-5.216-14.372-5.2-19.584,0.008L4.034,236.856c-2.672,2.672-4.1,6.244-4.032,9.92c-0.068,3.816,1.356,7.388,4.028,10.056
			l57.68,57.692c5.224,5.22,14.38,5.22,19.596,0l7.44-7.44c2.604-2.6,4.044-6.084,4.044-9.788c0-3.716-1.44-7.232-4.044-9.836
			l-22.14-22.172H226.79V425.32l-23.336-23.088c-5.212-5.22-14.488-5.22-19.7,0l-7.5,7.44c-2.604,2.6-4.072,6.084-4.072,9.792
			c0,3.704,1.424,7.184,4.028,9.792l58.448,58.456c2.596,2.592,6.068,4.028,9.9,4.028c0.024-0.016,0.24,0,0.272,0
			c3.712,0,7.192-1.432,9.792-4.028l58.828-58.832c2.6-2.604,4.044-6.088,4.044-9.792c0-3.712-1.44-7.192-4.044-9.796l-7.44-7.44
			c-5.216-5.22-14.044-5.22-19.264,0l-21.54,21.868V265.284H425.59l-23.096,23.132c-2.612,2.608-4.048,6.112-4.048,9.82
			s1.432,7.192,4.048,9.8l7.44,7.444c5.212,5.224,14.372,5.224,19.584,0l58.452-58.452c2.672-2.664,4.096-6.244,4.028-9.916
			C492.07,243.296,490.642,239.728,487.97,237.06z"
                    />
                </g>
            </g>
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
        </svg>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { LayoutItem } from "../lib/layout-row";

@Component
export default class IconComponent extends Vue {
    @Prop() readonly icon!: string;
    @Prop({ type: String, default: "black" }) readonly color!: string;

    get style() {
        return { color: this.color };
    }
}
</script>

<style scoped>
.layout-container__icon {
    height: 12px;
    width: 12px;
    display: inline-flex;
    align-items: center;
}
.layout-container__icon svg {
    stroke: inherit;
    width: inherit;
    height: inherit;
}
</style>
