import $ from 'jquery';

import StageElement from '../stageelement';

const namespace = '.pannable';

const Pannable = {
  handlePan(vm, event) {
    if (event.defaultPrevented) return;
    if (!(this instanceof StageElement)) throw new Error('I don\'t know how to handle other things than StageElements');
    event.preventDefault();
    event.stopImmediatePropagation();

    const contextMatrix  = this.screenMatrix().inverse(); // this is bad with animations, if need, put it inside the mousemove - which is expensive
    const matrix         = this.matrix();
    const $element       = $(event.target);
    const rawStartPoint  = this.getMousePoint(event);

    $element.addClass('panning');

    $(window)
      .on('mouseup' + namespace, (e) => this.afterPan(e, $element))
      .on('mousemove' + namespace, (e) => {
        if (e.originalEvent.defaultPrevented) return this.afterPan(e, $element);
        e.preventDefault();


        const startPoint = rawStartPoint.matrixTransform(contextMatrix);
        const currentPoint = this.getMousePoint(e).matrixTransform(contextMatrix);

        const delta = this.getPoint({
          x: currentPoint.x - startPoint.x,
          y: currentPoint.y - startPoint.y
        });

        this.matrix(matrix.translate(delta.x, delta.y));
      });
  },
  afterPan(e, $element) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $(window).off(namespace);
    $element.removeClass('panning');
  }
};

export default Pannable;
