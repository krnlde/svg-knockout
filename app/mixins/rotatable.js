import {observable, unwrap} from 'tko/dist/tko';
import $ from 'jquery';

import StageElement from '../stageelement';

const namespace = '.rotatable';

$(window).on('keydown keyup', (e) => Rotatable.showHandle(e.ctrlKey));

const Rotatable = {
  showHandle: observable(false),
  handleRotate(vm, event) {
    if (event.defaultPrevented) return;
    if (!(this instanceof StageElement)) throw new Error('I don\'t know how to handle other things than StageElements');
    event.preventDefault();
    event.stopImmediatePropagation();

    const contextMatrix = this.screenMatrix().inverse();
    const matrix        = this.matrix();
    const $element      = $(event.target);
    const startPoint    = this.getPoint({x: this.origin.x(), y: this.origin.y()});

    $element.addClass('rotating');

    $(window)
      .on('mouseup' + namespace, (e) => this.afterRotate(e, $element))
      .on('mousemove' + namespace, (e) => {
        if (e.originalEvent.defaultPrevented) return this.afterPan(e, $element);
        e.preventDefault();

        const currentPoint = this.getMousePoint(e).matrixTransform(contextMatrix);

        const distance = StageElement.length(this.getPoint({
          x: currentPoint.x - startPoint.x,
          y: currentPoint.y - startPoint.y,
        }));

        if (distance < 20) return;

        $(window)
          .off('mousemove' + namespace)
          .on('mousemove' + namespace, (e) => {
            if (e.originalEvent.defaultPrevented) return this.afterPan(e, $element);
            e.preventDefault();

            const currentPoint = this.getMousePoint(e).matrixTransform(contextMatrix);
            const angle = Math.atan2(currentPoint.y - startPoint.y, currentPoint.x - startPoint.x) * 180 / Math.PI + 90;

            const snappedAngle = StageElement.snap(angle, 15);

            this.matrix(matrix.translate(startPoint.x, startPoint.y).rotate(snappedAngle).translate(-startPoint.x, -startPoint.y));
          });
      });
  },
  afterRotate(e, $element) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $(window).off(namespace);
    $element.removeClass('rotating');
  }
};

export default Rotatable;
