import {mixin} from 'lodash-decorators';
import {observable, observableArray, pureComputed} from 'tko/dist/tko';
import $ from 'jquery';

import Pannable from './mixins/pannable';
import Zoomable from './mixins/zoomable';
import Grid from './grid';
import StageElement from './stageelement';
import Rectangle from './rectangle';
import TestDot from './testdot';

@mixin(Pannable)
@mixin(Zoomable)
export default class Stage extends StageElement {

  grid = new Grid();

  children = observableArray([]);

  minimapViewport = '-100 -100 500 500'; // TODO

  origin = pureComputed(() => {
    return this.getPoint({
      x: 0,
      y: 0,
    });
  });


  constructor(...args) {
    super(...args);
    // this.width(1000);
    // this.height(1000);
    this.rotation(45);
    // this.scale(2);

    const testDot = new TestDot(this);
    const rect = new Rectangle(this, {
      width: 300,
      height: 200,
      // x: 100,
      // y: 200,
      rotation: 45,
      scale: 1,
    });

    this.children.push(testDot);
    this.children.push(rect);
    let contextMatrix = this.matrix().inverse();
    $(window).on('mousemove', (e) => {
      const position = this.getMousePoint(e);
      // this.width(position.x * 2);
      // this.height(position.y * 2);
      testDot.translate(position.matrixTransform(this.matrix().inverse()));
    });

    const loop = () => {
      requestAnimationFrame(() => {
        rect.rotation(rect.rotation() + 2);
        loop();
      });
    };
    loop();

  }
}
