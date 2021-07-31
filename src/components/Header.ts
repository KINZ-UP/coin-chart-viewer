import { Market } from '../App';
import { State } from '../store';
import Subscriber from '../store/Subscriber';
import MarketListItem from './MarketListItem';

export default class Header extends Subscriber {
  public $root: HTMLElement | null = document.getElementById('root');
  public $header: HTMLElement = document.createElement('header');
  public $marketList: HTMLUListElement = document.createElement('ul');
  public $title: HTMLHeadingElement = document.createElement('h1');
  public $showMoreButton: HTMLButtonElement = document.createElement('button');

  constructor() {
    super();
    this.init();
  }

  updateState(state: State) {
    if (this.state.market !== state.market) {
      this.renderTitle(state.market);
    }

    this.renderMarketList(state.marketList);
    this.state = state;
  }

  init() {
    this.initTitle();
    this.initButton();
    this.initMarketList();
    this.$root?.appendChild(this.$header);
  }

  private initTitle() {
    this.renderTitle(this.state.market);
    this.$header.appendChild(this.$title);
  }

  private initButton() {
    this.$showMoreButton.addEventListener('click', () => {
      this.$header.appendChild(this.$marketList);
    });
    this.$header.appendChild(this.$showMoreButton);
  }

  private closeList() {
    this.$header.removeChild(this.$marketList);
  }

  private initMarketList() {
    this.$marketList.id = 'market-list';
    this.$marketList.addEventListener('mouseleave', () => this.closeList());
  }

  private renderTitle(market: Market) {
    this.$title.textContent = market.english_name;
  }

  renderMarketList(list: Market[]) {
    this.$marketList.innerHTML = '';
    list.forEach((item) => {
      this.$marketList.appendChild(
        new MarketListItem(item, this.closeList.bind(this))
      );
    });
  }
}
