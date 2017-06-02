import {mixin} from 'lodash-decorators';
import {observable, observableArray} from 'tko/dist/tko';
import $ from 'jquery';

import Pannable from './mixins/pannable';
import Zoomable from './mixins/zoomable';
import Grid from './grid';
import StageElement from './stageelement';
import TestDot from './testdot';

@mixin(Pannable)
@mixin(Zoomable)
export default class Stage extends StageElement {

  grid = new Grid();

  children = observableArray([]);

  minimapViewport = '-100 -100 500 500'; // TODO

  constructor(...args) {
    super(...args);
    this.width(200);
    this.height(700);
    this.rotation(32);

    const testDot = new TestDot(this);

    this.children.push(testDot);

    $(window).on('mousemove', (e) => {
      const position = this.getMousePoint(e).matrixTransform(this.screenMatrix().inverse());
      testDot.translate(position);
    });

    const loop = () => {
      requestAnimationFrame(() => {
        this.rotation(this.rotation() + 1);
        loop();
      });
    };
    loop();

  }
}
