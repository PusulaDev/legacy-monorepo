import _Vue from "vue";
import LayoutContainerComponent from "./LayoutContainer.vue";
import LayoutContainerItemComponent from "./LayoutContainerItem.vue";
import LayoutContainerRowComponent from "./LayoutContainerRow.vue";

declare global {
  interface Window {
    Vue: typeof _Vue;
  }
}

const install = (Vue: typeof _Vue): void => {
  Vue.component("LayoutContainer", LayoutContainerComponent);
  Vue.component("LayoutContainerItem", LayoutContainerItemComponent);
  Vue.component("LayoutContainerRow", LayoutContainerRowComponent);
};

export default install;

if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(install);
}

export { LayoutContainerComponent,LayoutContainerItemComponent,LayoutContainerRowComponent };
