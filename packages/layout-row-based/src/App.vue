<template>
    <div id="app">
        <h4>SABASAYER layout-row-based</h4>
        <layout-container
            :rows="rows"
            @update:rows="updateRows"
            :layout-items.sync="items"
            @update:layoutItems="updateLayout"
            edit-mode
            sortable
        >
            <template #default="{id}">
                <layout-container
                    :rows="rows"
                    @update:rows="updateRows"
                    :layout-items.sync="items"
                    @update:layoutItems="updateLayout"
                    sortable
                >
                    <template #default="{id}">
                        <div
                            style="padding:5px;"
                            :style="{background:'rgba('+id*42+',200,'+id*30+')'}"
                        >id : {{id}} , order :{{getItem(id).order}}</div>
                    </template>
                </layout-container>
                <div
                    style="padding:10px;"
                    :style="{background:'gray'}"
                >main / id : {{id}} , order :{{getItem(id).order}}</div>
            </template>
        </layout-container>
        <div>{{items}}</div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LayoutContainerComponent from "./components/LayoutContainer.vue";
import { LayoutItem, LayoutRow } from "../types/lib/layout-row";

@Component({
    components: {
        "layout-container": LayoutContainerComponent
    }
})
export default class App extends Vue {
    rows: LayoutRow[] = [{ row: 1, columns: 1 }];

    items: LayoutItem[] = [
        { row: 1, column: 1, order: 0, id: 1 },
        { row: 1, column: 1, order: 1, id: 2 },
        { row: 1, column: 1, order: 2, id: 3 },
        { row: 1, column: 1, order: 3, id: 4 },
        { row: 1, column: 1, order: 4, id: 5 },
        { row: 1, column: 1, order: 4, id: 6 },
        { row: 1, column: 1, order: 5, id: 7 },
        { row: 1, column: 1, order: 7, id: 8 },
        { row: 1, column: 1, order: 8, id: 9 },
        { row: 1, column: 1, order: 9, id: 10 }
    ];

    get getItem() {
        return (id: number) => this.items.find(e => e.id == id);
    }

    updateRows(rows: LayoutRow[]) {}

    updateLayout(layout: LayoutItem[]) {}
}
</script>

<style>
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

.layout-container {
    border: 1px solid #ededed;
}

.layout-container__cell {
    background-color: aliceblue;
}
</style>
