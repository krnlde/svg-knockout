import {observable, unwrap} from 'tko';
import $ from 'jquery';

import StageElement from '../stageelement';

const namespace = '.resizable';

$(window).on('keydown keyup', (e) => Resizable.showHandle(e.ctrlKey));

const Resizable = {
  showHandle: observable(false),
  setupResizeOrigin(origin) {
    return (vm, event) => {
      if (event.defaultPrevented) return;
      if (!(this instanceof StageElement)) throw new Error('I don\'t know how to handle other things than StageElements');
      event.preventDefault();
      event.stopImmediatePropagation();

      const contextMatrix = this.screenMatrix().inverse();
      const matrix        = this.matrix();
      const $element      = $(event.target);
      const startPoint    = this.getMousePoint(event).matrixTransform(contextMatrix);
      const startWidth    = this.width();
      const startHeight   = this.height();

      $element.addClass('resizing');

      $(window)
        .on('mouseup' + namespace, (e) => this.afterResize(e, $element))
        .on('mousemove' + namespace, (e) => {
          if (e.originalEvent.defaultPrevented) return this.afterPan(e, $element);
          e.preventDefault();

          const currentPoint = this.getMousePoint(e).matrixTransform(contextMatrix);

          const delta = this.getPoint({
            x: currentPoint.x - startPoint.x,
            y: currentPoint.y - startPoint.y
          });

          // console.log({
          //   origin,
          //   delta,
          //   startWidth,
          //   startHeight,
          // });

          this.width(Math.max(startWidth + delta.x, 10));
          this.height(Math.max(startHeight + delta.y, 10));
          this.origin.x(this.width() / 2);
          this.origin.y(this.height() / 2);
        });
    }
  },

  zoomAround(point, scaleBy) {
    const previousScale = StageElement.getScale(this.matrix());
    const x = unwrap(point.x);
    const y = unwrap(point.y);

    if (previousScale * scaleBy > this.SCALE_MAX)      scaleBy = 1/previousScale * this.SCALE_MAX;
    else if (previousScale * scaleBy < this.SCALE_MIN) scaleBy = 1/previousScale * this.SCALE_MIN;

    const matrix = this.matrix()
      .translate(x, y)
      .scale(scaleBy)
      .translate(-x, -y)
    this.matrix(matrix);
  },
  afterResize(e, $element) {
    e.preventDefault();
    e.stopImmediatePropagation();
    $(window).off(namespace);
    $element.removeClass('resizing');
  }
};

export default Resizable;
