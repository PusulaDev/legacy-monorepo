export enum InvalidPositionState {
  biggerThenScreen = 1,
  outOfScreen = 2,
  collidesWithBannedAre = 3,
}

export interface OutPositions {
  left: number;
  right: number;
  bottom: number;
  top: number;
}

export interface ElementDimensions {
  left: number;
  top: number;
  width: number;
  height: number;
}

export class PositionCalculator {
  private outPositionTolerance: number = 20;

  offset(el: HTMLElement) {
    let rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  createDimensions(el: HTMLElement): ElementDimensions {
    let offset = this.offset(el);

    return {
      left: offset.left,
      top: offset.top,
      height: el.offsetHeight,
      width: el.offsetWidth,
    };
  }

  isDimensionOutOfScreen(dimension: ElementDimensions): OutPositions {
    let outPositions: OutPositions = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    };

    let windowHeight = window.innerHeight + window.pageYOffset;
    let windowWidth = window.innerWidth + window.pageXOffset;

    if (dimension.left - this.outPositionTolerance < window.pageXOffset) {
      outPositions.left = window.pageXOffset - (dimension.left - this.outPositionTolerance);
    }

    if (dimension.left + dimension.width + this.outPositionTolerance > windowWidth) {
      outPositions.right = dimension.left + dimension.width + this.outPositionTolerance - windowWidth;
    }

    if (dimension.top - this.outPositionTolerance < window.pageYOffset) {
      outPositions.top = window.pageYOffset - (dimension.top - this.outPositionTolerance);
    }

    if (dimension.top + dimension.height + this.outPositionTolerance > windowHeight) {
      outPositions.bottom = dimension.top + dimension.height + this.outPositionTolerance - windowHeight;
    }

    return outPositions;
  }

  /**
   * calculates left value of align element relative to targer for centering
   * */
  horizontalCenter(target: ElementDimensions, align: ElementDimensions): void {
    align.left = target.left - (align.width - target.width) / 2;
  }

  /**
   * calculates top value of align element relative to targer for centering
   * */
  verticalCenter(target: ElementDimensions, align: ElementDimensions): void {
    align.top = target.top - (align.height - target.height) / 2;
  }

  shiftToFitScreen(dimensions: ElementDimensions, outPos: OutPositions) {
    if (outPos.top) dimensions.top += outPos.top + this.outPositionTolerance;
    if (outPos.bottom) dimensions.top -= outPos.bottom + this.outPositionTolerance;
    if (outPos.right) dimensions.left -= outPos.right + this.outPositionTolerance;
    if (outPos.left) dimensions.left += outPos.left + this.outPositionTolerance;
  }

  snapToBottom(snapTo: ElementDimensions, snap: ElementDimensions, enableMirror: boolean) {
    snap.top = snapTo.top + snapTo.height;
    this.horizontalCenter(snapTo, snap);

    let outPos = this.isDimensionOutOfScreen(snap);
    if (outPos.left) snap.left += outPos.left + this.outPositionTolerance;
    if (outPos.right) snap.left -= outPos.right + this.outPositionTolerance;

    if (outPos.bottom && enableMirror) {
      let snapResult = this.snapToTop(snapTo, snap, false);
      if (snapResult.top) this.shiftToFitScreen(snap, snapResult);
    }

    return outPos;
  }

  snapToTop(snapTo: ElementDimensions, snap: ElementDimensions, enableMirror: boolean) {
    snap.top = snapTo.top - snap.height;
    this.horizontalCenter(snapTo, snap);

    let outPos = this.isDimensionOutOfScreen(snap);
    if (outPos.left) snap.left += outPos.left + this.outPositionTolerance;
    if (outPos.right) snap.left -= outPos.right + this.outPositionTolerance;

    if (outPos.top && enableMirror) {
      let snapResult = this.snapToBottom(snapTo, snap, false);
      if (snapResult.bottom) this.shiftToFitScreen(snap, snapResult);
    }

    return outPos;
  }

  snapToLeft(snapTo: ElementDimensions, snap: ElementDimensions, enableMirror: boolean) {
    this.verticalCenter(snapTo, snap);
    snap.left = snapTo.left - snap.width;

    let outPos = this.isDimensionOutOfScreen(snap);
    if (outPos.top) snap.top += outPos.top + this.outPositionTolerance;
    if (outPos.bottom) snap.top -= outPos.bottom + this.outPositionTolerance;

    if (outPos.left && enableMirror) {
      let snapResult = this.snapToRight(snapTo, snap, false);
      if (snapResult.right) this.shiftToFitScreen(snap, snapResult);
    }

    return outPos;
  }

  snapToRight(snapTo: ElementDimensions, snap: ElementDimensions, enableMirror: boolean) {
    this.verticalCenter(snapTo, snap);
    snap.left = snapTo.left + snapTo.width;

    let outPos = this.isDimensionOutOfScreen(snap);
    if (outPos.top) snap.top += outPos.top + this.outPositionTolerance;
    if (outPos.bottom) snap.top -= outPos.bottom + this.outPositionTolerance;

    if (outPos.right && enableMirror) {
      let snapResult = this.snapToLeft(snapTo, snap, false);
      if (snapResult.left) this.shiftToFitScreen(snap, snapResult);
    }

    return outPos;
  }
}

export const positionCalculator = new PositionCalculator();
