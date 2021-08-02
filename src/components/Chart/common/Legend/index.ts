import GlobalState from '../../state/GlobalState';
import DateWrapper from './DateWrapper';
import ItemLegend from './ItemLegend';

export default class Legend extends HTMLDivElement {
  public items: ItemLegend[] = [];
  public state: GlobalState = GlobalState.getInstance();
  public $date: DateWrapper = new DateWrapper();
  public $legendWrapper: HTMLDivElement = document.createElement('div');
  public openPrice: ItemLegend = new ItemLegend('OPEN_PRICE');
  public closePrice: ItemLegend = new ItemLegend('CLOSE_PRICE');
  public highPrice: ItemLegend = new ItemLegend('HIGH_PRICE');
  public lowPrice: ItemLegend = new ItemLegend('LOW_PRICE');
  constructor() {
    super();
    this.id = 'item-legend-container';
    this.$date.id = 'item-date-wrapper';
    this.$legendWrapper.id = 'item-legend-wrapper';
    this.appendChild(this.$date);
    this.$legendWrapper.appendChild(this.openPrice);
    this.$legendWrapper.appendChild(this.closePrice);
    this.$legendWrapper.appendChild(this.highPrice);
    this.$legendWrapper.appendChild(this.lowPrice);
    this.appendChild(this.$legendWrapper);

    this.items.push(
      this.openPrice,
      this.closePrice,
      this.highPrice,
      this.lowPrice
    );
  }

  update() {
    this.$date.update();
    this.items.forEach((legend) => legend.update());
  }
}

customElements.define('item-value-container', Legend, {
  extends: 'div',
});
