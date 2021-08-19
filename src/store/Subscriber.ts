import store from '../store';
import { initialState, State } from './reducer';

export default class Subscriber {
  public state: State = initialState;

  constructor() {
    store.subscribe(this);
  }

  public updateState(state: State) {
    this.state = state;
  }
}
