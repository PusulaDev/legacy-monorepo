import _Vue from "vue";
import LayoutContainerComponent from "./LayoutContainer.vue";
import LayoutContainerItemComponent from "./LayoutContainerItem.vue";
import LayoutContainerRowComponent from "./LayoutContainerRow.vue";
declare global {
    interface Window {
        Vue: typeof _Vue;
    }
}

declare const install: (Vue: typeof _Vue) => void;
export default install;
export {
    LayoutContainerComponent,
    LayoutContainerItemComponent,
    LayoutContainerRowComponent
};
