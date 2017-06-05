import {observable, pureComputed} from 'tko/dist/tko';

import Stage from './stage';
import Pannable from './mixins/pannable';

export default class StageElement {

  static identityMatrix = null;
  static point = null;

  label = null;
  name  = () => {
    if (!this.constructor) debugger;
    return this.constructor.name;
  };


  svg    = null;
  root   = null;
  parent = null;

  x        = observable(0);
  y        = observable(0);
  width    = observable(0);
  height   = observable(0);
  rotation = observable(0);
  scale    = observable(1);

  // screenScale = pureComputed(() => {
  //   if (!this.parent) return this.scale();
  //   return this.scale() * this.parent.scale()
  // });
  // screenWidth = pureComputed(() => this.width() * this.screenScale());

  scalingMatrix      = pureComputed(() => StageElement.identityMatrix.scale(this.scale()) );
  rotationMatrix     = pureComputed(() => StageElement.identityMatrix.rotate(this.rotation()) );
  translationMatrix  = pureComputed(() => StageElement.identityMatrix.translate(this.x(), this.y()) );
  originMatrix       = pureComputed(() => StageElement.identityMatrix.translate(this.origin().x, this.origin().y) );

  // @see https://www.w3.org/TR/2011/WD-css3-2d-transforms-20111215/#matrix-decomposition
  matrix = pureComputed({
    read: () => StageElement.identityMatrix
      // .multiply(this.translationMatrix())
      // .multiply(this.originMatrix())
      // .multiply(this.rotationMatrix())
      // .multiply(this.originMatrix().inverse())
      // .multiply(this.scalingMatrix())

      .translate(this.x(), this.y())
      .scale(this.scale())
      .translate(this.origin().x, this.origin().y)
      .rotate(this.rotation())
      .translate(-this.origin().x, -this.origin().y)
      ,
    write: (m) => {
      if (!(m instanceof SVGMatrix)) throw new Error('SVGMatrix object required to set the new matrix.');
      this.rotation(StageElement.getRotation(m));
      this.scale(StageElement.getScale(m));
      this.x(m.e);
      this.y(m.f);
    }
  });

  screenMatrix = pureComputed(() => {
    if (!this.parent) return this.svg.getScreenCTM().multiply(this.matrix());
    return this.parent.screenMatrix().multiply(this.matrix());
  });

  origin = pureComputed(() => {
    return this.getPoint({
      x: this.width() / 2,
      y: this.height() / 2,
    });
  });

  screenPoint = {
    center: pureComputed(() => {
      return this.getPoint({
        x: this.width() / 2,
        y: this.height() / 2,
      }).matrixTransform(this.screenMatrix());
    }),

    topLeft: pureComputed(() => {
      return this.getPoint().matrixTransform(this.screenMatrix());
    }),

    topRight: pureComputed(() => {
      return this.getPoint({
        x: this.width(),
      }).matrixTransform(this.screenMatrix());
    }),

    bottomLeft: pureComputed(() => {
      return this.getPoint({
        y: this.height(),
      }).matrixTransform(this.screenMatrix());
    }),

    bottomRight: pureComputed(() => {
      return this.getPoint({
        x: this.width(),
        y: this.height(),
      }).matrixTransform(this.screenMatrix());
    }),
  };

  transform = pureComputed(() => {
    return this.matrix.toTransform()();
    // return `translate(${this.x()}, ${this.y()}) rotate(${this.rotation()} ${this.origin().x} ${this.origin().y}) scale(${this.scale()})`;
  });

  constructor(parent, {x = 0, y = 0, width = 10, height = 10, rotation = 0, scale = 1} = {}) {
    if (parent instanceof SVGSVGElement) {
      StageElement.identityMatrix = parent.createSVGMatrix();
      StageElement.point          = parent.createSVGPoint();
      this.root                   = this;
      this.svg                    = parent;
    } else {
      this.root = parent.root;
      this.svg  = parent.svg;
    }

    if (parent instanceof StageElement) this.parent = parent;

    this.x(x);
    this.y(y);
    this.width(width);
    this.height(height);
    this.rotation(rotation);
    this.scale(scale);
  }

  translate({x, y} = {}) {
    this.x(x);
    this.y(y);
  }

  getClasses() {
    return {
      pannable:  'handlePan' in this,
      zoomable:  'handleZoom' in this,
      movable:   'handleMove' in this,
      rotatable: 'handleRotate' in this,
    };
  }

  getIdentityMatrix() {
    return StageElement.identityMatrix;
  }
  getPoint({x = 0, y = 0} = {}) {
    return StageElement.point.matrixTransform(StageElement.identityMatrix.translate(x, y));
  }

  getMousePoint({clientX: x, clientY: y} = {}) {
    return this.getPoint({x, y});
  }

  toTransform({a,b,c,d,e,f}) {
    return 'matrix(' + [a, b, c, d, e, f].join(',') + ')';
  }

  getLeveledMatrix({x = 0, y = 0} = {}) {
    const matrix = this.matrix();
    const point = this.getPoint({x, y}).matrixTransform(matrix);
    return matrix.inverse().translate(point.x, point.y);
  }

  static getRotation(m) {
    return Math.atan2(m.b, m.a) * 180 / Math.PI;
  }

  static getScale(m) {
    return Math.sqrt(StageElement.determinant(m));
  }

  static determinant(m) {
    return (m.a * m.d) - (m.b * m.c);
  }
}
