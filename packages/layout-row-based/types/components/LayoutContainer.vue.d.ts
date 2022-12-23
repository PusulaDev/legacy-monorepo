import { Vue } from "vue-property-decorator";
import { LayoutItem, LayoutRow } from "../lib/layout-row";
import cloneDeep from "lodash/cloneDeep";
import LayoutContainerRow from "./LayoutContainerRow.vue";
import { Draggable, Droppable } from "@shopify/draggable";
import { DragMoveEvent, DroppableDroppedEvent } from "../lib/shopify-events";
import LayoutContainerItem from "./LayoutContainerItem.vue";

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
