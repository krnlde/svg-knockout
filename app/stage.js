import {mixin} from 'lodash-decorators';
import {observable, observableArray, pureComputed} from 'tko';
import $ from 'jquery';

import keyboard from './keyboard';

import Pannable from './mixins/pannable';
import Zoomable from './mixins/zoomable';
import Grid from './grid';
import StageElement from './stageelement';
import Circle from './circle';
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

    this.width(this.svg.clientWidth);
    this.height(this.svg.clientHeight);

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

    $(window)
      .on('keyup', (e) => {
        if (e.which == keyboard.esc) this.scaleToFit();
      });

    // $(svg).on('mousemove', (e) => {
    //   const originPoint = StageElement.getMousePoint(e).matrixTransform(this.screenMatrix().inverse());
    //   this.origin.x(originPoint.x);
    //   this.origin.y(originPoint.y);
    // });

    // const radius = 25;
    // for (let i = 0; i < 50; i += 1) {
    //   const y = i * radius*2;

    const circle = new Circle(this, {x: 200, r: 100, color: '#fff'});
    this.children.push(circle);


    const loop = () => {
      requestAnimationFrame(() => {
        rect.rotate(2);
        // this.rotate(.1);
        loop();
      });
    };
    loop();
  }

  scaleToFit = () => {
  };
}
