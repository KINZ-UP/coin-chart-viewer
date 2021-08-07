import Data from '../../../model/Data';
import Pointer from '../../../model/Pointer';
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
  constructor(data: Data, pointer: Pointer) {
    super();

    this.$date = new DateWrapper(data, pointer);
    this.$openPrice = new LegendItem('OPEN_PRICE', data, pointer);
    this.$closePrice = new LegendItem('CLOSE_PRICE', data, pointer);
    this.$highPrice = new LegendItem('HIGH_PRICE', data, pointer);
    this.$lowPrice = new LegendItem('LOW_PRICE', data, pointer);

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

  update() {
    this.$date.update();
    this.items.forEach((legend) => legend.update());
  }
}

customElements.define('item-value-container', Legend, {
  extends: 'div',
});
