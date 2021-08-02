import GlobalState from '../../state/GlobalState';

export default class ItemLegend extends HTMLDivElement {
  public state: GlobalState = GlobalState.getInstance();
  public title: string = '';
  public value: number | undefined =
    this.state.dataLoader.dataList[0]?.openPrice;
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

  update() {
    const data =
      this.state.dataOnView[this.state.pointerIdx || 0] ??
      this.state.dataLoader.dataList[0];

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
