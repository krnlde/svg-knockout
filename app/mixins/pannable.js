import $ from 'jquery';

import StageElement from '../stageelement';

const namespace = '.pannable';

const Pannable = {
  handlePan(vm, event) {
    if (event.isDefaultPrevented) return;
    if (!(this instanceof StageElement)) throw new Error('I don\'t know how to handle other things than StageElements');
    event.preventDefault();

    const $element      = $(event.target);
    const contextMatrix = this.screenMatrix().inverse();
    const startPoint    = this.getMousePoint(event).matrixTransform(contextMatrix);

    $element.addClass('panning');

    $(window)
      .one('mouseup' + namespace, (e) => this.afterPan(e, $element))
      .on('mousemove' + namespace, (e) => {
        if (e.originalEvent.isDefaultPrevented) return this.afterPan(e, $element);

        const currentPoint = this.getMousePoint(e).matrixTransform(contextMatrix);

        const target = this.getPoint({
          x: currentPoint.x - startPoint.x,
          y: currentPoint.y - startPoint.y,
        }).matrixTransform(contextMatrix.inverse());

        this.x(target.x);
        this.y(target.y);
      });
  },
  afterPan(e, $element) {
    $(window).off(namespace);
    $element.removeClass('panning');
  }
};

export default Pannable;
