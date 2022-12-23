# layout-row-based

Row based dynamic layout creater. 

Rows can be divided to columns and can contain any number of items.

Items can be moved from column to column and sorted inside columns by drag and drop.

For drag and drop used [shopify/draggable](https://github.com/Shopify/draggable).


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Example Usage

```
<template>
 <layout-container
        :rows="rows"
        @update:rows="updateRows"
        :layout-items.sync="items"
        @update:layoutItems="updateLayout"
        edit-mode
        sortable
        >
            <template #default="{id}">
                <div style="padding:40px;background:pink;">id : {{id}} , order :{{getItem(id).order}}</div>
            </template>
</layout-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { LayoutContainerComponent } from "@sabasayer/layout-row-based";
import { LayoutItem, LayoutRow } from "@sabasayer/layout-row-based/types/lib/layout-row";

@Component({
    components: {
        "layout-container": LayoutContainerComponent
    }
})
export default class App extends Vue {
    rows: LayoutRow[] = [
        { row: 1, columns: 2 },
        { row: 2, columns: 3 },
        { row: 3, columns: 1 }
    ];

    items: LayoutItem[] = [
        { row: 1, column: 1, order: 0, id: 1 },
        { row: 1, column: 1, order: 1, id: 2 },
    ];

    get getItem(){
        return (id:number) => this.items.find(e=>e.id == id);
    }

    updateRows(rows: LayoutRow[]) {
    }

    updateLayout(layout: LayoutItem[]) {
        console.log('layout',layout)
    }
}
</script>
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
