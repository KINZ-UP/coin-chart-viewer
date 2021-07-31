import store, { State } from '../store';
import { initialState } from './reducer';

export default class Subscriber {
  public state: State = initialState;

  constructor() {
    store.subscribe(this);
  }

  public updateState(state: State) {
    this.state = state;
  }
}
