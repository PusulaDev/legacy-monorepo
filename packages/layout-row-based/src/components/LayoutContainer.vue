<template>
    <div ref="container" class="layout-container">
        <div v-if="editMode" class="layout-container__settings">
            <v-button
                v-if="cloneRows.length > 0"
                @click="removeRow"
                icon="minus"
            />
            <v-button @click="addRow" icon="plus" />
        </div>
        <layout-container-row
            v-for="(row, i) in cloneRows"
            :key="`${i} ${key}`"
            :row="row"
            @update:row="onRowUpdated(...arguments, i)"
            :edit-mode="editMode"
        >
            <template #default="{col}">
                <slot name="col-before" :col="col" :row="row"></slot>
                <slot name="col" :col="col" :row="row">
                    <layout-container-item
                        v-for="(item, j) in getItems(row.row, col)"
                        :item="item"
                        :key="j"
                        :edit-mode="editMode"
                    >
                        <template #toolbar>
                            <slot :id="item.id" name="item-toolbar"></slot>
                        </template>
                        <slot :id="item.id"></slot>
                    </layout-container-item>
                </slot>
                <slot name="col-after" :col="col" :row="row"></slot>
            </template>
        </layout-container-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { LayoutItem, LayoutRow } from "../lib/layout-row";
import cloneDeep from "lodash.clonedeep";
import LayoutContainerRow from "./LayoutContainerRow.vue";
import { Draggable, Droppable, Sortable } from "@shopify/draggable";
import {
    DragMoveEvent,
    DroppableDroppedEvent,
    SortableSortedEvent
} from "../lib/shopify-events";
import LayoutContainerItem from "./LayoutContainerItem.vue";
import ButtonComponent from "./button.vue";

@Component({
    components: {
        LayoutContainerItem,
        LayoutContainerRow,
        "v-button": ButtonComponent
    }
})
export default class LayoutContainerComponent extends Vue {
    @Prop() readonly layoutItems!: LayoutItem[];
    @Prop() readonly rows!: LayoutRow[];
    @Prop({ type: Boolean, default: false }) readonly editMode!: boolean;
    @Prop({ type: Boolean, default: false }) readonly sortable!: boolean;

    cloneRows: LayoutRow[] = [];
    cloneLayoutItems: LayoutItem[] = [];
    key: number = 0;
    draggableObj: any = null;

    get getItems() {
        return (row: number, col: number) => {
            return this.layoutItems
                ? this.layoutItems
                      .filter(e => e.row == row && e.column == col)
                      .sort((a, b) => a.order - b.order)
                : undefined;
        };
    }

    @Watch("rows", { immediate: true, deep: true })
    onRowsChanged() {
        if (this.rows) {
            this.cloneRows = cloneDeep(this.rows);
        } else this.cloneRows = [];
    }

    @Watch("layoutItems", { immediate: true, deep: true })
    onLayoutItemsChanged() {
        if (this.layoutItems) {
            this.cloneLayoutItems = cloneDeep(this.layoutItems).sort(
                (a, b) => a.order - b.order
            );
        } else this.cloneLayoutItems = [];
    }

    mounted() {
        this.initEvents();
    }

    updated() {
        this.initEvents();
    }

    initEvents() {
        if (this.editMode) {
            if (this.draggableObj) this.draggableObj.destroy();

            if (this.sortable) {
                this.initSortEvents();
            } else {
                this.initDragEvents();
            }
        }
    }

    updateLayoutItems() {
        this.$emit("update:layoutItems", this.cloneLayoutItems);
    }

    initSortEvents() {
        this.draggableObj = new Sortable(
            (this.$refs.container as HTMLElement).querySelectorAll(
                ".layout-container__cell.edit-mode"
            ),
            {
                draggable:
                    ".layout-container__cell.edit-mode > .layout-container__item",
                handle: ".layout-container__item-handle"
            }
        );

        this.draggableObj.on("sortable:sorted", this.onSorted);
        this.draggableObj.on("drag:stop", this.onDragStop);
    }

    initDragEvents() {
        this.draggableObj = new Droppable(this.$refs.container, {
            draggable:
                ".layout-container__cell.edit-mode > .layout-container__item",
            dropzone: ".layout-container__cell.edit-mode"
        });

        this.draggableObj.on("droppable:dropped", this.onDropped);
        this.draggableObj.on("droppable:returned", this.onDropped);
        this.draggableObj.on("drag:stop", this.onDragStop);
    }

    onDragStop(e: any) {
        this.updateLayoutItems();
        this.key++;
    }

    onSorted(e: SortableSortedEvent) {
        let dropArea = e.data.newContainer;
        let dragItem = e.data.dragEvent.data.originalSource;

        if (!dropArea || !dragItem) return;

        let areaRow = +(
            dropArea.attributes.getNamedItem("data-row")?.value ?? 0
        );
        let areaCol = +(
            dropArea.attributes.getNamedItem("data-col")?.value ?? 0
        );

        let dragItemId = dragItem.attributes.getNamedItem("data-id")?.value;

        let item = this.cloneLayoutItems.find(e => e.id == dragItemId);

        if (!item) return;

        let oldRow = item.row;
        let oldCol = item.column;

        let newIndex = e.data.newIndex;
        let oldIndex = e.data.oldIndex;

        this.updateOtherItemsOrder(item, newIndex, oldIndex, oldCol, oldRow);

        if (areaRow != oldRow) item.row = +areaRow;
        if (areaCol != oldCol) item.column = +areaCol;
        item.order = newIndex;
    }

    updateOtherItemsOrder(
        item: LayoutItem,
        newIndex: number,
        oldIndex: number,
        oldCol: number,
        oldRow: number
    ) {
        let cellItems = this.cloneLayoutItems.filter(
            e => e.row == item.row && e.column == item.column
        );

        cellItems
            .sort((a, b) => a.order - b.order)
            .forEach((item, i) => {
                item.order = i;
            });

        if (oldCol == item.column && oldRow == item.row) {
            if (Math.abs(oldIndex - newIndex) == 1) {
                let sameIndexItem = this.cloneLayoutItems.find(
                    e =>
                        e.row == item.row &&
                        e.column == item.column &&
                        e.id != item.id &&
                        e.order == newIndex
                );

                if (sameIndexItem) {
                    sameIndexItem.order = oldIndex;
                }
            } else {
                this.cloneLayoutItems.forEach(ci => {
                    if (
                        ci.row == item.row &&
                        ci.column == item.column &&
                        ci.id != item.id &&
                        ci.order >= newIndex &&
                        ci.order < oldIndex
                    ) {
                        ci.order++;
                    }
                });
            }
        }
    }

    onDropped(e: DroppableDroppedEvent) {
        let dropArea = e.data.dropzone;
        let dragItem = e.data.dragEvent.data.originalSource;

        let areaRow = +(
            dropArea.attributes.getNamedItem("data-row")?.value ?? 0
        );
        let areaCol = +(
            dropArea.attributes.getNamedItem("data-col")?.value ?? 0
        );

        let dragItemId = dragItem.attributes.getNamedItem("data-id")?.value;

        let item = this.cloneLayoutItems.find(e => e.id == dragItemId);

        if (!item) return;

        let oldRow = item.row;
        let oldCol = item.column;

        if (areaRow != oldRow) item.row = +areaRow;
        if (areaCol != oldCol) item.column = +areaCol;
    }

    onRowUpdated(row: LayoutRow, i: number) {
        this.$set(this.cloneRows, i, row);
        this.$emit("update:rows", this.cloneRows);
    }

    addRow() {
        this.cloneRows.push({
            row: this.cloneRows.length + 1,
            columns: 1
        });
        this.$emit("update:rows", this.cloneRows);
    }

    removeRow() {
        this.cloneRows.splice(this.cloneRows.length - 1, 1);
        this.$emit("update:rows", this.cloneRows);
    }

    beforeDestroy() {
        if (this.draggableObj) this.draggableObj.destroy();
    }
}
</script>

<style scoped>
.layout-container {
    display: block;
}
.layout-container__settings {
    padding: 4px;
    display: flex;
    justify-content: flex-end;
}
</style>
<style>
.draggable-mirror {
    opacity: 0.7;
    border: 2px dashed gray;
}
.draggable--over {
    box-shadow: 0 0 4px gray;
}
.draggable-container--over {
    box-shadow: 0 0 3px orange;
}
</style>
