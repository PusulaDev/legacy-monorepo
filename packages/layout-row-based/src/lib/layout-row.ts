export interface LayoutRow {
    row: number;
    columns: number;
}

export interface LayoutItem {
    id: string | number;
    row: number;
    column: number;
    oldOrder:number;
    order: number;
    maxHeight?: number;
}
