import {observable} from 'tko';

export default class Grid {
  dx = observable(50);
  dy = observable(50);

  color = observable('#0ff');
}
