import Data from '../model/data';
import Layout from '../model/Layout';
import Pointer from '../model/Pointer';
import Legend from './Legend';
import LoadingAnimation from './LoadingAnimation';

export default class ChartWrapper {
  public $outer: HTMLElement = document.createElement('div');
  public $inner: HTMLElement = document.createElement('div');
  public $upper: HTMLElement = document.createElement('div');
  public $lower: HTMLElement = document.createElement('div');
  public $gap: HTMLElement = document.createElement('div');
  public $buttonWrapper: HTMLElement = document.createElement('div');
  public $zoomInBtn: HTMLButtonElement = document.createElement('button');
  public $zoomOutBtn: HTMLButtonElement = document.createElement('button');
  public $legend: Legend | null = null;
  public $loadingAnimation: LoadingAnimation;

  constructor(
    public canvas: HTMLCanvasElement,
    $parentElem?: HTMLElement | null
  ) {
    const root = $parentElem || document.body;

    this.$loadingAnimation = new LoadingAnimation();

    this.$outer.id = 'canvas-outer-wrapper';
    this.$inner.id = 'canvas-inner-wrapper';
    this.$upper.id = 'upper-chart-wrapper';
    this.$lower.id = 'lower-chart-wrapper';
    this.$gap.id = 'gap-wrapper';

    this.$buttonWrapper.id = 'button-wrapper';
    this.$zoomInBtn.id = 'zoom-in';
    this.$zoomOutBtn.id = 'zoom-out';
    this.$buttonWrapper.appendChild(this.$zoomInBtn);
    this.$buttonWrapper.appendChild(this.$zoomOutBtn);

    this.$upper.classList.add('section-wrapper');
    this.$lower.classList.add('section-wrapper');
    this.$gap.classList.add('section-wrapper');

    this.$inner.appendChild(this.$loadingAnimation);
    this.$outer.appendChild(this.$upper);
    this.$outer.appendChild(this.$lower);
    this.$outer.appendChild(this.canvas);
    this.$outer.appendChild(this.$inner);
    this.$outer.appendChild(this.$gap);
    this.$outer.appendChild(this.$buttonWrapper);

    root?.appendChild(this.$outer);
  }

  public onResize(layout: Layout) {
    this.$outer.style.width = this.canvas.width + 'px';
    this.$outer.style.height = this.canvas.height + 'px';

    const { upper, lower, gap, width } = layout;

    this.$inner.style.top = upper.margin.top + 'px';
    this.$inner.style.left = upper.margin.left + 'px';
    this.$inner.style.right = upper.margin.right + 'px';
    this.$inner.style.bottom = lower.margin.bottom + 'px';

    this.$upper.style.top = upper.margin.top + 'px';
    this.$upper.style.left = upper.margin.left + 'px';
    this.$upper.style.right = upper.margin.right + 'px';
    this.$upper.style.bottom = upper.margin.bottom + 'px';

    this.$lower.style.top = lower.margin.top + 'px';
    this.$lower.style.left = lower.margin.left + 'px';
    this.$lower.style.right = lower.margin.right + 'px';
    this.$lower.style.bottom = lower.margin.bottom + 'px';

    this.$gap.style.top = upper.margin.top + upper.height + 'px';
    this.$gap.style.left = upper.margin.left + 'px';
    this.$gap.style.right = upper.margin.right + 'px';
    this.$gap.style.bottom = lower.margin.bottom + lower.height + 'px';

    this.$buttonWrapper.style.bottom =
      lower.margin.bottom + lower.height + gap / 2 + 'px';
    this.$buttonWrapper.style.right = upper.margin.right + width / 2 + 'px';
  }

  public update(data: Data, pointer: Pointer) {
    if (!this.$legend) return;
    this.$legend.update(data, pointer);
  }

  public startLoading() {
    this.$loadingAnimation.startLoading();
  }

  public finishLoading() {
    this.$loadingAnimation.finishLoading();
  }

  public renderLegend() {
    if (this.$legend) return;
    this.$legend = new Legend();
    this.$inner.appendChild(this.$legend);
  }
}
