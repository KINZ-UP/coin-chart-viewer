import Data from '../../../model/Data';
import Pointer from '../../../model/Pointer';

export default class ItemLegend extends HTMLDivElement {
  public title: string = '';
  public value: number | undefined = undefined;
  constructor(public type: string) {
    super();

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

  update(data: Data, pointer: Pointer) {
    const d = pointer.idx
      ? data.dataOnView[pointer.idx] ?? data.dataList[0]
      : data.dataList[0];

    switch (this.type) {
      case 'OPEN_PRICE': {
        this.value = d?.openPrice;
        break;
      }
      case 'CLOSE_PRICE': {
        this.value = d?.closePrice;
        break;
      }
      case 'HIGH_PRICE': {
        this.value = d?.highPrice;
        break;
      }
      case 'LOW_PRICE': {
        this.value = d?.lowPrice;
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
