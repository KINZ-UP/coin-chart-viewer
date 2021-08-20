import './index.scss';

export default class LoadingAnimation extends HTMLDivElement {
  public timeoutId: ReturnType<typeof setTimeout> | null = null;
  constructor() {
    super();
    this.id = 'chart-loading-animation';
    this.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="35" fill="none" stroke="#fff" />
      </svg>
    `;
  }

  startLoading() {
    this.timeoutId = setTimeout(() => this.classList.add('loading'), 500);
  }
  finishLoading() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.classList.remove('loading');
  }
}

customElements.define('loading-animation', LoadingAnimation, {
  extends: 'div',
});
