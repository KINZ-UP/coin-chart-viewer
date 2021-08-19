import { State, Action } from './reducer';
import Subscriber from './Subscriber';
import reducer, { initialState } from './reducer';
import deepCopy from '../lib/deepCopy';

class Store {
  private static instance: Store | null = null;
  private _state: State = initialState;
  public subscribers: Subscriber[] = [];

  private constructor() {}

  public static getInstance(): Store {
    if (Store.instance === null) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public get state() {
    return this._state;
  }

  private set state(s) {
    this._state = s;
  }

  public dispatch(action: Action) {
    this.state = reducer(this.state, action);
    this.notify();
  }

  public subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }

  private notify(): void {
    this.subscribers.forEach((subscriber) =>
      subscriber.updateState(deepCopy(this.state))
    );
  }
}

export default Store.getInstance();
