import {observable, pureComputed} from 'tko/dist/tko';
import StageElement from './stageelement';

export default class Rectangle extends StageElement {
  name = 'Rectangle';

  label = pureComputed(() => `x: ${this.x()}, y: ${this.y()}`);


  origin = pureComputed(() => {
    return this.getPoint({
      x: this.width() / 2,
      y: this.height() / 2,
    });
  });
}
