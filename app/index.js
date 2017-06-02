import ko from 'tko/dist/tko';

import Stage from './stage';


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

const svg = document.getElementById('stage');

class VM {
  stage = new Stage(svg);

  constructor() {
    ko.deferUpdates = true;
  }
}


ko.applyBindings(new VM());
