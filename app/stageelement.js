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


  root   = null;
  parent = null;

  x        = observable(0);
  y        = observable(0);
  width    = observable(0);
  height   = observable(0);
  rotation = observable(0);
  scale    = observable(2);

  screenScale = pureComputed(() => {
    if (!this.parent) return this.scale();
    return this.scale() * this.parent.scale()
  });
  screenWidth = pureComputed(() => this.width() * this.screenScale());

  rotationMatrix     = pureComputed(() => StageElement.identityMatrix.rotate(this.rotation()) );
  scalingMatrix      = pureComputed(() => StageElement.identityMatrix.scale(this.scale()) );
  translationMatrix  = pureComputed(() => StageElement.identityMatrix.translate(this.x(), this.y()) );
  // rotateAroundMatrix = pureComputed(() => StageElement.identityMatrix.translate(this.center().x, this.center().y) );


  matrix = pureComputed({
    read: () =>StageElement.identityMatrix
      .multiply(this.translationMatrix())
      .multiply(this.scalingMatrix())
      // .multiply(this.rotateAroundMatrix())
      .multiply(this.rotationMatrix())
      // .multiply(this.rotateAroundMatrix().inverse())
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
    if (!this.parent) return this.matrix();
    return this.parent.matrix().multiply(this.matrix());
  });

  center = pureComputed(() => {
    return this.getPoint({
      x: this.width() / 2,
      y: this.height() / 2,
    });
  });

  constructor(parent) {
    if (parent instanceof SVGSVGElement) {
      StageElement.identityMatrix = parent.createSVGMatrix();
      StageElement.point          = parent.createSVGPoint();
      this.root                   = this;
    } else {
      this.root = parent.root;
    }
    if (parent instanceof StageElement) this.parent = parent;
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

  screenPosition() {
    const m = this.screenMatrix();
    return m.e + ' ' + m.f;
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
