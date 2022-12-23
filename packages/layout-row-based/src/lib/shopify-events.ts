
export interface DroppableDroppedEvent {
    data: {
        dragEvent:DragMoveEvent
        dropzone: HTMLElement;
    };
}

export interface DragMoveEvent {
    data: {
        originalSource: HTMLElement;
        source: HTMLElement;
    };
}

export interface DragOverEvent {
    data: {
        over:HTMLElement;
        overContainer:HTMLElement
        originalSource: HTMLElement;
        source: HTMLElement;
    };
}

export interface SortableSortedEvent {
    data: {
        dragEvent:DragOverEvent
        newContainer:HTMLElement
        oldContainer:HTMLElement
        newIndex:number
        oldIndex:number
    };
}

