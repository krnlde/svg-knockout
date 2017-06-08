import {mixin} from 'lodash-decorators';
import {observable, observableArray, pureComputed} from 'tko/dist/tko';

import TestDot from './testdot';
import StageElement from './stageelement';
import Pannable from './mixins/pannable';
import Resizable from './mixins/resizable';
import Rotatable from './mixins/rotatable';
import Zoomable from './mixins/zoomable';

@mixin(Pannable)
@mixin(Rotatable)
@mixin(Resizable)
@mixin(Zoomable)
export default class Rectangle extends StageElement {
  name = 'Rectangle';

  children = observableArray([]);
}
