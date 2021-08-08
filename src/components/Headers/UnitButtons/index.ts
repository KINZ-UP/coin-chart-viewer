import store from '../../../store';
import { changeUnit } from '../../../store/reducer';
import UnitButton from './UnitButton';
import UnitList from './MinuteList';

export enum Unit {
  Minute = 'minutes',
  Day = 'days',
  Week = 'weeks',
  Month = 'months',
}

export default class UnitButtons extends HTMLDivElement {
  private buttonList: UnitButton[] = [];
  private $minute: UnitButton;
  private $day: UnitButton;
  private $week: UnitButton;
  private $month: UnitButton;

  private $minuteList: UnitList;
  private $minuteButtonWrapper: HTMLDivElement = document.createElement('div');

  constructor() {
    super();
    this.$minute = new UnitButton('minutes', () => {
      this.$minuteList.classList.add('open');
      this.$minuteList.focus();
    });
    this.$day = new UnitButton('days', () => this.onClick('days'));
    this.$week = new UnitButton('weeks', () => this.onClick('weeks'));
    this.$month = new UnitButton('months', () => this.onClick('months'));

    this.$day.classList.add('selected');

    this.buttonList.push(this.$minute);
    this.buttonList.push(this.$day);
    this.buttonList.push(this.$week);
    this.buttonList.push(this.$month);

    this.appendChild(this.$minute);
    this.appendChild(this.$day);
    this.appendChild(this.$week);
    this.appendChild(this.$month);

    this.$minuteList = new UnitList(this.onClickMinute.bind(this));
    this.appendChild(this.$minuteList);
  }

  private onClick(unit: string) {
    this.buttonList.forEach(($button) => {
      if ($button.unit === unit) {
        $button.classList.add('selected');
        store.dispatch(changeUnit(unit));
        return;
      }
      $button.classList.remove('selected');
    });
  }

  private onClickMinute(unit: string) {
    this.buttonList.forEach(($button) => {
      if ($button.unit === 'minutes') {
        $button.classList.add('selected');
        $button.textContent = unit;
        return;
      }
      $button.classList.remove('selected');
    });
  }
}

customElements.define('unit-button-container', UnitButtons, { extends: 'div' });
