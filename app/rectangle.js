import {mixin} from 'lodash-decorators';
import {observable, observableArray, pureComputed} from 'tko/dist/tko';

import TestDot from './testdot';
import StageElement from './stageelement';
import Pannable from './mixins/pannable';
import Zoomable from './mixins/zoomable';

@mixin(Pannable)
@mixin(Zoomable)
export default class Rectangle extends StageElement {
  name = 'Rectangle';

  children = observableArray([]);
  label = 'topright';
  // label = pureComputed(() => {
  //   const point = this.getPoint({
  //     x: this.width(),
  //   }).matrixTransform(this.matrix());
  //   return `x: ${point.x}, y: ${point.y}`;
  // });

  updatePosition(vm, e) {
    this.testDot.translate(this.getMousePoint(e).matrixTransform(this.testDot.screenMatrix().inverse()));
    return true;
  }

  constructor(...args) {
    super(...args);

    this.testDot = new TestDot(this);
    this.testDot.color('rebeccapurple');
    this.children.push(this.testDot);
    this.root.labels.push(this.testDot);

  }
}
