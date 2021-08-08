import UnitListItem from './MinuteItem';

export default class UnitList extends HTMLUListElement {
  public list: UnitListItem[] = [];
  constructor(onClick: (unit: string) => void) {
    super();
    this.id = 'minute-unit-list';
    this.tabIndex = -1;
    this.addEventListener('blur', () => this.classList.remove('open'));
    this.list = [1, 3, 5, 10, 15, 30, 60, 240].map((num) => {
      const numStr = num.toString();
      const $unitBtn = new UnitListItem(numStr, () => {
        this.classList.remove('open');
        onClick(`${numStr}분`);
      });
      this.appendChild($unitBtn);
      return $unitBtn;
    });
  }
}

customElements.define('unit-list', UnitList, { extends: 'ul' });
