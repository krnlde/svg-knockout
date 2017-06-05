import $ from 'jquery';

import TestDot from '../testdot';
import StageElement from '../stageelement';

const namespace = '.pannable';

const Pannable = {
  startTestDot: null,
  currentTestDot: null,
  handlePan(vm, event) {
    if (event.isDefaultPrevented) return;
    if (!(this instanceof StageElement)) throw new Error('I don\'t know how to handle other things than StageElements');
    event.preventDefault();

    const $element    = $(event.target);
    const startPoint  = this.getMousePoint(event);

    const start = this.getPoint({
      x: this.x(),
      y: this.y(),
    });
    $element.addClass('panning');

    $(window)
      .on('mouseup' + namespace, (e) => this.afterPan(e, $element))
      .on('mousemove' + namespace, (e) => {
        if (e.originalEvent.isDefaultPrevented) return this.afterPan(e, $element);

        const currentPoint = this.getMousePoint(e);

        const delta = this.getPoint({
          x: currentPoint.x - startPoint.x,
          y: currentPoint.y - startPoint.y
        });

        this.x(start.x + delta.x);
        this.y(start.y + delta.y);
      });
  },
  afterPan(e, $element) {
    $(window).off(namespace);
    this.root.children.remove(this.startTestDot);
    this.root.children.remove(this.currentTestDot);
    $element.removeClass('panning');
  }
};

export default Pannable;
