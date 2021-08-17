# TOY PROJECT - 코인 차트 뷰어

업비트 API를 이용한 코인 차트 뷰어입니다.
<br>
코인 종목별 분/일/주/월봉 캔들스틱차트를 지원합니다.
<br>

- [Live Page](http://coin.kinzup.com)

_Fig. 1 Screenshot_
<br>
<img src="/images/screenshot.png" width="500">
<br>
<br>

## Teck Stacks

| FRONTEND                                        | BACKEND | DEPLOYMENT                        |
| :---------------------------------------------- | :------ | :-------------------------------- |
| VanillaJS<br>Typescript<br>Canvas<br>Parcel<br> | Express | AWS S3<br>AWS Route 53<br>AWS EC2 |

<br>

## Key Features

### Apply MVC Pattern

- 차트 컴포넌트는 Model / View(display) / Controller 객체로 구성
- 외부 입력이나 이벤트에 의해 상태 변경시, Controller → Model → View 순서로 업데이트

```js
Chart
├── index.ts
│   ├── Model
│   │   ├── index.ts
│   │   ├── ...
│   ├── Display
│   │   ├── index.ts
│   │   ├── ...
│   ├── Control
│   │   ├── index.ts
│   ├── ChartWrapper      // DOM elements for styling & event binding
│   │   ├── index.ts
│   └── ...
└── ...
```

<br>

### Modularizing Chart Component

- 차트가 어플리케이션이나 데이터 API에 의존하지 않도록 독립적인 컴포넌트로 구현
- 차트 데이터 바인딩에 필요한 API (staticData, onInitFetch, onFetchMore 등) 제공

```ts
class Chart {
	public model: Model;
  public display: Display;
  public control: Control;
  public wrapper: ChartWrapper;

  constructor(
    maxCanvasWidth: number,
    maxCanvasHeight: number,
    $parentElem?: HTMLElement | null,
    private staticData?: data[],
    private onInitFetch?: () => Promise<data[]>,
    private onFetchMore?: () => Promise<data[]>
  ) {
    this.model = new Model(maxCanvasWidth, maxCanvasHeight);
    this.display = new Display();
    this.control = new Control();
    this.wrapper = new ChartWrapper(this.display.canvas, $parentElem);

		...

	}

	...

}
```

<br>

### Customizing Style

- 차트 디자인에 관련된 요소 (각종 색상, 폰트, Margin 등) 및 어떤 이동평균선을 표시할 것인지 등을 커스터마이징이 필요한 요소들을 chartConfig.ts 파일에 모아서 편리하게 커스터마이징이 가능하도록 구현

```ts
const chartConfig = {
  movingAverageList: [
    { interval: 5, color: 'green' },
    { interval: 10, color: 'orange' },
    { interval: 20, color: 'gray' },
  ],
	layout: {
		...
	},
	color: {
		...
	}
	...
}
```

<br>

### Optimizing Rendering

- Resize / Data fetch / Zoom or Pan / Mouse hover 등 차트의 리렌더링이 필요한 상황을 정의
- 각 상황에서 Model및 Controller의 어떤 속성이 업데이트 되어야하는지를 고려하여, 필요한 속성들을 선택적으로 업데이트하여 렌더링 최적화
  <br><br>

### Responsive UI

- 스크린 너비에 따른 반응형 UI 구현
- resize 이벤트 적용
  <br>
  |Wide|Narrow|
  |:--:|:--:|
  |<img src="/images/wide.png" width=300>|<img src="/images/narrow.png" width=180>|
  <br><br>

### FLUX 상태 관리 패턴 적용

어플리케이션의 상태 관리를 위해서 Redux와 같은 FLUX 패턴을 직접 구현하여 적용
