import {mixin} from 'lodash-decorators';
import {observable} from 'tko';

import StageElement from './stageelement';
import Pannable from './mixins/pannable';
import Resizable from './mixins/resizable';
import Rotatable from './mixins/rotatable';
import Zoomable from './mixins/zoomable';

@mixin(Pannable)
@mixin(Rotatable)
@mixin(Resizable)
@mixin(Zoomable)
export default class Circle extends StageElement {
  name = 'Circle';

  r = observable(10);

  constructor(parent, {r = 10} = {}) {
    super(...arguments);
    this.width(r);
    this.height(r);

    this.r(r);
  }
}
