import {observable, pureComputed} from 'tko/dist/tko';
import StageElement from './stageelement';

export default class Rectangle extends StageElement {
  name = 'Rectangle';

  label = pureComputed(() => {
    const point = this.getPoint({
      x: this.width(),
    }).matrixTransform(this.matrix());
    return `x: ${point.x}, y: ${point.y}`;
  });


  origin = pureComputed(() => {
    return this.getPoint({
      x: this.width() / 2,
      y: this.height() / 2,
    });
  });
}
