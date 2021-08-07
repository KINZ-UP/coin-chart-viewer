import Data from '../../../model/Data';
import Pointer from '../../../model/Pointer';

export default class ItemLegend extends HTMLDivElement {
  public title: string = '';
  public value: number | undefined = undefined;
  constructor(public type: string, public data: Data, public pointer: Pointer) {
    super();
    this.data.dataList[0]?.openPrice;

    this.className = 'item-legend';
    switch (type) {
      case 'OPEN_PRICE': {
        this.title = '시';
        break;
      }
      case 'CLOSE_PRICE': {
        this.title = '종';
        break;
      }
      case 'HIGH_PRICE': {
        this.title = '고';
        break;
      }
      case 'LOW_PRICE': {
        this.title = '저';
        break;
      }
      default:
        this.title = '';
    }

    this.render();
  }

  update() {
    const data = this.pointer.idx
      ? this.data.dataOnView[this.pointer.idx] ?? this.data.dataList[0]
      : this.data.dataList[0];

    switch (this.type) {
      case 'OPEN_PRICE': {
        this.value = data?.openPrice;
        break;
      }
      case 'CLOSE_PRICE': {
        this.value = data?.closePrice;
        break;
      }
      case 'HIGH_PRICE': {
        this.value = data?.highPrice;
        break;
      }
      case 'LOW_PRICE': {
        this.value = data?.lowPrice;
        break;
      }
      default:
        break;
    }

    this.render();
  }

  render() {
    this.innerHTML = `
    <p>${this.title}</p>
    <p>${this.value?.toLocaleString() || ''}</p>
  `;
  }
}

customElements.define('item-value', ItemLegend, { extends: 'div' });
