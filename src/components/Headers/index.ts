import { Market } from '../../App';
import { State } from '../../store';
import Subscriber from '../../store/Subscriber';
import MarketListItem from './MarketListItem';
import UnitButtons from './UnitButtons';

export default class Header extends Subscriber {
  public $root: HTMLElement | null = document.getElementById('root');
  public $header: HTMLElement = document.createElement('header');
  public $marketList: HTMLUListElement = document.createElement('ul');
  private $titleWrapper: HTMLDivElement = document.createElement('div');
  public $title: HTMLHeadingElement = document.createElement('h1');
  public $showMoreButton: HTMLButtonElement = document.createElement('button');
  public $unitButtons: UnitButtons = new UnitButtons();

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
    this.initUnitButtons();
    this.$root?.appendChild(this.$header);
  }

  private initTitle() {
    this.renderTitle(this.state.market);
    this.$titleWrapper.id = 'title-wrapper';
    this.$titleWrapper.appendChild(this.$title);
    this.$header.appendChild(this.$titleWrapper);
  }

  private initButton() {
    this.$showMoreButton.addEventListener('click', () => {
      this.$header.appendChild(this.$marketList);
      this.$marketList.classList.remove('closed');
      this.$marketList.focus();
    });
    this.$titleWrapper.appendChild(this.$showMoreButton);
  }

  private closeList() {
    this.$marketList.classList.add('closed');
  }

  private initMarketList() {
    this.$marketList.id = 'market-list';
    this.$marketList.tabIndex = -1;
    this.$marketList.addEventListener('blur', () => this.closeList());
  }

  private renderTitle(market: Market) {
    this.$title.textContent = market.english_name;
  }

  private renderMarketList(list: Market[]) {
    this.$marketList.innerHTML = '';
    list.forEach((item) => {
      this.$marketList.appendChild(
        new MarketListItem(item, this.closeList.bind(this))
      );
    });
  }

  private initUnitButtons() {
    this.$unitButtons.id = 'unit-button-container';
    this.$header.appendChild(this.$unitButtons);
  }
}
