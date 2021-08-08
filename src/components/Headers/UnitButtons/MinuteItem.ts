import store from '../../../store';
import { changeUnitToMinute } from '../../../store/reducer';

export default class UnitListItem extends HTMLLIElement {
  constructor(minute: string, onClick: () => void) {
    super();
    this.textContent = `${minute}분`;
    this.addEventListener('click', () => {
      store.dispatch(changeUnitToMinute(minute));
      onClick();
    });
    this.addEventListener('mouseenter', () => this.classList.add('on-hover'));
    this.addEventListener('mouseleave', () =>
      this.classList.remove('on-hover')
    );
  }
}

customElements.define('unit-item', UnitListItem, { extends: 'li' });
