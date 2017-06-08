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

  labels = observableArray([]);

  children = observableArray([]);

  minimapViewport = '-250 -250 1000 1000'; // TODO calculate


  constructor(svg, ...args) {
    super(svg, ...args);

    const rect = new Rectangle(this, {
      width:    300,
      height:   200,
      rotation: 180,
    });

    this.children.push(rect);
    this.labels.push(rect);

    const rect2 = new Rectangle(this, {
      x:      100,
      y:      350,
      width:  300,
      height: 200,
      color:  'green',
    });

    this.children.push(rect2);

    $(svg).on('mousemove', (e) => {
      const originPoint = this.getMousePoint(e).matrixTransform(this.screenMatrix().inverse());
      this.origin.x(originPoint.x);
      this.origin.y(originPoint.y);
    });

    const loop = () => {
      requestAnimationFrame(() => {
        rect.rotate(2);
        this.rotate(.1);
        loop();
      });
    };
    loop();
  }

  scaleToFit = () => {
    const bbox = this.svg.querySelector('#stage').getBoundingClientRect();
    console.log(bbox);
    const scale = Math.min(this.svg.clientWidth / bbox.width, this.svg.clientHeight / bbox.height);
    this.matrix(this.matrix().translate((this.svg.clientWidth/2 - ((bbox.left + bbox.width)/2)) / scale, 0).scale(scale));
  };
}
