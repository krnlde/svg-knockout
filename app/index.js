import ko from 'tko/dist/tko';

import Stage from './stage';

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
  }
}


ko.applyBindings(new VM());
