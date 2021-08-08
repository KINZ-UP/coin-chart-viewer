type unit = 'minutes' | 'days' | 'weeks' | 'months';

const unitMap = {
  minutes: '분',
  days: '일',
  weeks: '주',
  months: '월',
};

export default class UnitButton extends HTMLButtonElement {
  constructor(public unit: unit, onClick: () => void) {
    super();
    this.className = 'unit_button';
    this.textContent = unitMap[unit];
    this.addEventListener('click', onClick);
  }
}

customElements.define('unit-button', UnitButton, { extends: 'button' });
