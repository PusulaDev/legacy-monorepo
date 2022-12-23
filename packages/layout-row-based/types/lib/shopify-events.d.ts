
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
