import { Market } from '../App';
import store from '../store';
import { changeMarket } from '../store/reducer';

export default class MarketListItem extends HTMLLIElement {
  constructor(market: Market, onClose: () => void) {
    super();
    this.textContent = market.english_name;
    this.addEventListener('click', () => {
      store.dispatch(changeMarket(market));
      onClose();
    });
    this.addEventListener('mouseenter', () => this.classList.add('on-hover'));
    this.addEventListener('mouseleave', () =>
      this.classList.remove('on-hover')
    );
  }
}

customElements.define('market-item', MarketListItem, { extends: 'li' });
