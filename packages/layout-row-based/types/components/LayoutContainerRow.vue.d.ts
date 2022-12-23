import { Vue } from "vue-property-decorator";
import { LayoutRow } from "../lib/layout-row";

export default class LayoutContainerRowComponent extends Vue {
    row: LayoutRow;
    editMode: boolean;
    isSettingsVisible:boolean;

    changeColumn(newColumn: number):void
    onMouseenter():void
    onMouseLeave():void
}
