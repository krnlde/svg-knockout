import $ from 'jquery';

import StageElement from '../stageelement';

const namespace = '.zoomable';

const Zoomable = {
  SCALE_MIN: .1,
  SCALE_MAX: 50,
  fastScaleFactor: .5,

  handleZoom(vm, event) {
    if (event.isDefaultPrevented) return;
    if (!(vm instanceof StageElement)) throw new Error('I don\'t know how to handle other things than StageElements');
    event.preventDefault();

    const delta   = event.deltaY * (event.deltaMode ? 100 : 1);
    const scale   = this.scale();
    const scaleBy = (delta > 0 ? 1 + (Math.abs(delta) / 1000) : 1 / (1 + (Math.abs(delta) / 1000)));
    const point   = this.getMousePoint(event).matrixTransform(this.screenMatrix().inverse());

    this.zoomAround(point, scaleBy);
  },

  zoomAround(point, scaleBy) {
    const previousScale = this.scale();

    if (previousScale * scaleBy > this.SCALE_MAX)      scaleBy = 1/previousScale * this.SCALE_MAX;
    else if (previousScale * scaleBy < this.SCALE_MIN) scaleBy = 1/previousScale * this.SCALE_MIN;

    const matrix = this.matrix()
      .translate(point.x, point.y)
      .scale(scaleBy)
      .translate(-point.x, -point.y);

    this.matrix(matrix);
  },

  zoomIn() {
    this.zoomAround(this.getCenterPoint(), 1 + this.fastScaleFactor);
  },

  zoomOut() {
    this.zoomAround(this.getCenterPoint(), 1 / (1 + this.fastScaleFactor));
  }
};

export default Zoomable;
