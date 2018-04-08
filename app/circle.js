import {mixin} from 'lodash-decorators';
import {observable, pureComputed} from 'tko';

import StageElement from './stageelement';
import Pannable from './mixins/pannable';
import Resizable from './mixins/resizable';
import Rotatable from './mixins/rotatable';
import Zoomable from './mixins/zoomable';

@mixin(Pannable)
@mixin(Rotatable)
@mixin(Resizable)
@mixin(Zoomable)
export default class Circle extends StageElement {
  name = 'Circle';

  r = observable(10);
  radius = this.r;

  constructor(parent, {r = 10} = {}) {
    super(...arguments);
    this.width(r*2);
    this.height(r*2);
    this.r(r);

  }

  center = pureComputed(() => {
    return StageElement.getPoint();
  });

  topLeft = pureComputed(() => {
    return StageElement.getPoint({
      x: -this.r(),
      y: -this.r(),
    });
  });

  topRight = pureComputed(() => {
    return StageElement.getPoint({
      x: +this.r(),
      y: -this.r(),
    });
  });

  bottomLeft = pureComputed(() => {
    return StageElement.getPoint({
      x: -this.r(),
      y: +this.r(),
    });
  });

  bottomRight = pureComputed(() => {
    return StageElement.getPoint({
      x: +this.r(),
      y: +this.r(),
    });
  });

}
