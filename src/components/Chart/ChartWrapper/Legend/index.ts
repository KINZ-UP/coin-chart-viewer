import Data from '../../model/Data';
import Pointer from '../../model/Pointer';
import DateWrapper from './DateWrapper';
import LegendItem from './LegendItem';

export default class Legend extends HTMLDivElement {
  public items: LegendItem[] = [];
  public $date: DateWrapper;
  public $legendWrapper: HTMLDivElement = document.createElement('div');
  public $openPrice: LegendItem;
  public $closePrice: LegendItem;
  public $highPrice: LegendItem;
  public $lowPrice: LegendItem;
  constructor() {
    super();

    this.$date = new DateWrapper();
    this.$openPrice = new LegendItem('OPEN_PRICE');
    this.$closePrice = new LegendItem('CLOSE_PRICE');
    this.$highPrice = new LegendItem('HIGH_PRICE');
    this.$lowPrice = new LegendItem('LOW_PRICE');

    this.id = 'item-legend-container';
    this.$date.id = 'item-date-wrapper';
    this.$legendWrapper.id = 'item-legend-wrapper';
    this.appendChild(this.$date);
    this.$legendWrapper.appendChild(this.$openPrice);
    this.$legendWrapper.appendChild(this.$closePrice);
    this.$legendWrapper.appendChild(this.$highPrice);
    this.$legendWrapper.appendChild(this.$lowPrice);
    this.appendChild(this.$legendWrapper);

    this.items.push(
      this.$openPrice,
      this.$closePrice,
      this.$highPrice,
      this.$lowPrice
    );
  }

  public update(data: Data, pointer: Pointer) {
    this.$date.update(data, pointer);
    this.items.forEach((legend) => legend.update(data, pointer));
  }
}

customElements.define('item-value-container', Legend, {
  extends: 'div',
});
