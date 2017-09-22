import {observable, pureComputed} from 'tko';
import StageElement from './stageelement';

export default class TestDot extends StageElement {
  width  = observable(10);
  height = observable(10);
  color  = observable('red');

  screenPoint = {
    center: pureComputed(() => {
      return this.getPoint({
      }).matrixTransform(this.screenMatrix());
    }),
    topLeft: pureComputed(() => {
      return this.getPoint({
        x: -this.width() / 2,
        y: -this.height() / 2,
      }).matrixTransform(this.screenMatrix());
    }),
    topRight: pureComputed(() => {
      return this.getPoint({
        x: this.width() / 2,
        y: -this.height() / 2,
      }).matrixTransform(this.screenMatrix());
    }),
    bottomLeft: pureComputed(() => {
      return this.getPoint({
        x: -this.width() / 2,
        y: this.height() / 2,
      }).matrixTransform(this.screenMatrix());
    }),
    bottomRight: pureComputed(() => {
      return this.getPoint({
        x: this.width() / 2,
        y: this.height() / 2,
      }).matrixTransform(this.screenMatrix());
    }),
  };

  name = 'TestDot';

  label = pureComputed(() => `x: ${this.matrix().e}, y: ${this.matrix().f}`);
}
