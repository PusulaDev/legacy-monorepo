import { Vue } from "vue-property-decorator";
import { LayoutItem, LayoutRow } from "../lib/layout-row";
import { DroppableDroppedEvent } from "../lib/shopify-events";

export default class LayoutContainerComponent extends Vue {
    layoutItems: LayoutItem[];
    rows: LayoutRow[];
    editMode: boolean;
    cloneRows: LayoutRow[] ;
    cloneLayoutItems: LayoutItem[];
    key: number;

    get getItems(): Function;
    onRowsChanged() :void;
    onLayoutItemsChanged(): void;
    mounted(): void;
    updateLayoutItems(): void;
    initDragEvents(): void;
    onDropped(e: DroppableDroppedEvent): void;
    onRowUpdated(row: LayoutRow, i: number):void

    addRow():void

    removeRow():void
}
