import { Vue } from "vue-property-decorator";
import { LayoutItem } from "../lib/layout-row";

export default class LayoutContainerItemComponent extends Vue {
    item: LayoutItem;
    editMode: boolean;
}
