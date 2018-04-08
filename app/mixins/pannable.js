// import {observable, unwrap} from 'tko';
import $ from 'jquery';

import StageElement from '../stageelement';

const namespace = '.pannable';

// $(window).on('keydown keyup', (e) => Rotatable.showHandle(e.ctrlKey));

const Pannable = {
  // showHandle: observable(false),
  handlePan(vm, event) {
    if (event.defaultPrevented) return;
    if (!(this instanceof StageElement)) throw new Error('I don\'t know how to handle other things than StageElements');
    event.preventDefault();
    event.stopImmediatePropagation();

    const contextMatrix = this.screenMatrix().inverse();
    const matrix        = this.matrix();
    const $element      = $(event.target);
    const startPoint    = StageElement.getMousePoint(event).matrixTransform(contextMatrix);

    $element.addClass('panning');

    $(window)
      .on('mouseup' + namespace, (e) => this.afterPan(e, $element))
      .on('mousemove' + namespace, (e) => {
        if (e.originalEvent.defaultPrevented) return this.afterPan(e, $element);
        e.preventDefault();

        const currentPoint = StageElement.getMousePoint(e).matrixTransform(contextMatrix);

        const delta = StageElement.getPoint({
          x: currentPoint.x - startPoint.x,
          y: currentPoint.y - startPoint.y,
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
