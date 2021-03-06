const chartConfig = {
  movingAverageList: [
    { interval: 5, color: 'green' },
    { interval: 10, color: 'orange' },
    { interval: 20, color: 'gray' },
  ],
  layout: {
    margin: {
      ratio: {
        top: 0.1,
        left: 0.01,
        bottom: 0.05,
        right: 0.2,
      },
      min: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 60,
      },
      max: {
        top: 20,
        left: 20,
        bottom: 50,
        right: 80,
      },
    },
    gapRatio: 0.07,
    upperHeightRatio: 0.7,
    maxAspectRatio: 2,
  },
  color: {
    candleBody: {
      up: '#DE4B4B',
      down: '#4B99DE',
    },
    candleShadow: {
      up: '#DE4B4B',
      down: '#4B99DE',
    },
    bar: {
      up: '#C91D1D',
      down: '#1D78C9',
    },
    gridLine: '#e0e0e0',
  },
  numBarsOnViewList: [8, 12, 17, 23, 30, 38, 47, 57, 68, 80, 93, 105],
  yAxis: {
    maxNumTicks: { priceChart: 10, trVolumeChart: 5 },
    fillStyle: '#333',
    fontFamily: 'Montserrat, Noto Sans KR',
    maxFontSize: 12,
    minFontSize: 8,
    fontSizeRatio: 0.03,
    leftPadding: 7,
  },
  xAxis: {
    fillStyle: '#333',
    fontFamily: 'Montserrat',
    maxFontSize: 12,
    minFontSize: 8,
    fontSizeRatio: 0.03,
    topPadding: 5,
  },
  barSpacingRatio: {
    priceChart: 0.1,
    trVolumeChart: 0.3,
  },
  pointerGrid: {
    color: '#999',
  },
  pointerPriceMarker: {
    color: {
      background: '#000',
      font: '#fff',
    },
    height: 20,
  },
};

export default chartConfig;
