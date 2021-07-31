import { State } from '../Store';

export default function deepCopy(obj: State) {
  const clone: State = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (typeof obj[key] == 'object' && obj[key] !== null) {
      clone[key] = deepCopy(obj[key]);
    } else {
      clone[key] = obj[key];
    }
  }

  return clone;
}
