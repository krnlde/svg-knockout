import ko from 'tko';
import $ from 'jquery';

import Stage from './stage';
import StageElement from './stageelement';

ko.options.useOnlyNativeEvents = true;

ko.subscribable.fn.invert = function () {
  return ko.pureComputed(() => {
    const value = this();
    if (value instanceof SVGMatrix) return value.inverse();
    return 1 / value;
  });
};

ko.subscribable.fn.toTransform = function () {
  return ko.pureComputed(() => {
    const {a,b,c,d,e,f} = this();
    return 'matrix(' + [a, b, c, d, e, f].join(',') + ')';
  });
};

ko.subscribable.fn.toTranslate = function () {
  return ko.pureComputed(() => {
    const {x,y} = this();
    return 'translate(' + [x, y].join( ) + ')';
  });
};

const svg = document.getElementById('stage');

class VM {
  stage = new Stage(svg);
  constructor() {
    ko.deferUpdates = true;
    window.test = this.stage.scaleToFit;
  }
}

$(window)
  .on('keydown keyup', (e) => {
    StageElement.precise(e.shiftKey);
  });

ko.applyBindings(new VM());
