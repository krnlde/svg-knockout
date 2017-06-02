import {observable, pureComputed} from 'tko/dist/tko';
import StageElement from './stageelement';

export default class TestDot extends StageElement {
  width  = observable(10);
  height = observable(10);

  name = 'TestDot';

  label = pureComputed(() => `x: ${this.x()}, y: ${this.y()}`);
}
