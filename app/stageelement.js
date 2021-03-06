import {mixin} from 'lodash-decorators';
import {observable, pureComputed, unwrap} from 'tko';

import Stage from './stage';
// import Pannable from './mixins/pannable';

export default class StageElement {

  static identityMatrix = null;
  static point = null;
  static precise = observable(false);

  svg    = null;
  root   = null;
  parent = null;

  name  = observable(this.constructor.name);
  label = observable(this.name());

  width    = observable(0);
  height   = observable(0);
  color    = observable('#000');

  // @see https://www.w3.org/TR/2011/WD-css3-2d-transforms-20111215/#matrix-decomposition
  matrix = observable(StageElement.identityMatrix);

  screenMatrix = pureComputed(() => {
    if (!this.parent) return this.svg.getScreenCTM().multiply(this.matrix());
    return this.parent.screenMatrix().multiply(this.matrix());
  });


  origin = {
    x: observable(this.width() / 2),
    y: observable(this.height() / 2),
  };

  center = pureComputed(() => {
    return StageElement.getPoint({
      x: this.width() / 2,
      y: this.height() / 2,
    });
  });

  topLeft = pureComputed(() => {
    return StageElement.getPoint();
  });

  topRight = pureComputed(() => {
    return StageElement.getPoint({
      x: this.width(),
    });
  });

  bottomLeft = pureComputed(() => {
    return StageElement.getPoint({
      y: this.height(),
    });
  });

  bottomRight = pureComputed(() => {
    return StageElement.getPoint({
      x: this.width(),
      y: this.height(),
    });
  });

  screenPoint = {
    center: pureComputed(() => {
      return this.center().matrixTransform(this.screenMatrix());
    }),

    topLeft: pureComputed(() => {
      return this.topLeft().matrixTransform(this.screenMatrix());
    }),

    topRight: pureComputed(() => {
      return this.topRight().matrixTransform(this.screenMatrix());
    }),

    bottomLeft: pureComputed(() => {
      return this.bottomLeft().matrixTransform(this.screenMatrix());
    }),

    bottomRight: pureComputed(() => {
      return this.bottomRight().matrixTransform(this.screenMatrix());
    }),
  };

  constructor(parent, {x = 0, y = 0, width = 10, height = 10, rotation = 0, scale = 1, color = '#000', name = null} = {}) {
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

    this.width(width);
    this.height(height);

    this.origin.x(this.width() / 2);
    this.origin.y(this.height() / 2);

    this.color(color);
    if (name !== null) this.name(name);

    const intialMatrix = StageElement.identityMatrix
      .translate(-this.origin.x(), -this.origin.y())
      .rotate(rotation)
      .translate(x, y)
      .scale(scale)
      .translate(this.origin.x(), this.origin.y())
    this.matrix(intialMatrix);
  }

  translate({x, y} = {}) {
    this.matrix(this.matrix().translate(x, y));
  }

  rotate(degree, around = this.origin) {
    const x = unwrap(around.x);
    const y = unwrap(around.y);

    const targetMatrix = this.matrix()
      .translate(x, y)
      .rotate(degree)
      .translate(-x, -y)
    this.matrix(targetMatrix);
  }

  focus = () => {
    this.parent.matrix(this.matrix().inverse());
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

  static getPoint({x = 0, y = 0} = {}) {
    return StageElement.point.matrixTransform(StageElement.identityMatrix.translate(x, y));
  }

  static getMousePoint({clientX: x, clientY: y} = {}) {
    return StageElement.getPoint({x, y});
  }


  // getLeveledMatrix({x = 0, y = 0} = {}) {
  //   const matrix = this.matrix();
  //   const point = StageElement.getPoint({x, y}).matrixTransform(matrix);
  //   return matrix.inverse().translate(point.x, point.y);
  // }

  static getRotation(m) {
    return Math.atan2(m.b, m.a) * 180 / Math.PI;
  }

  static getScale(m) {
    return Math.sqrt(StageElement.determinant(m));
  }

  static determinant(m) {
    return (m.a * m.d) - (m.b * m.c);
  }

  static length({x, y}) {
    return Math.sqrt(x ** 2 + y ** 2);
  }

  // static norm({x, y}) {
  //   const length = StageElement.length({x, y});
  //   return StageElement.point.matrixTransform(x / length.x, y / length.y); // What? This is bullshit
  // }

  static snap(value, snapping) {
    if (StageElement.precise()) return value;
    return Math.round(value / snapping) * snapping;
  }
}
