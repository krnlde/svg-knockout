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
  _mouse = {
    x: observable(0),
    y: observable(0),
  }
  grid = new Grid();

  labels = observableArray([]);

  children = observableArray([]);

  minimapViewport = '-100 -100 800 500'; // TODO


  constructor(svg, ...args) {
    super(svg, ...args);

    const rect = new Rectangle(this, {
      width: 300,
      height: 200,
      // x: 100,
      // y: 200,
      rotation: 180,
      // scale: 1,
    });

    this.children.push(rect);
    this.labels.push(rect);

    const rect2 = new Rectangle(this, {
      x: 100,
      y: 350,
      width: 300,
      height: 200,
      color: 'green',
    });

    this.children.push(rect2);


    const testDot = new TestDot(this);
    $(svg).on('mousemove', (e) => {
      const testPoint   = this.getMousePoint(e).matrixTransform(testDot.screenMatrix().inverse());
      const originPoint = this.getMousePoint(e).matrixTransform(this.screenMatrix().inverse());
      testDot.translate(testPoint);
      this.origin.x(originPoint.x);
      this.origin.y(originPoint.y);
      //   this._mouse.x(point.x);
    //   this._mouse.y(point.y);
    });
    this.children.push(testDot);
    this.labels.push(testDot);
    // $(window).on('mousemove', (e) => {
    //   const position = this.getMousePoint(e);
    //   // this.width(position.x * 2);
    //   // this.height(position.y * 2);
    //   testDot.translate(position.matrixTransform(this.matrix().inverse()));
    // });

    const loop = () => {
      requestAnimationFrame(() => {
        rect.rotate(2);
        this.rotate(.1);
        loop();
      });
    };
    loop();

  }
}
