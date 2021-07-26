const options = {
  geoConfiguration: {
    margin: {
      ratio: {
        top: 0.1,
        left: 0,
        bottom: 0.05,
        right: 0.2,
      },
      min: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 50,
      },
      max: {
        top: 20,
        left: 20,
        bottom: 50,
        right: 80,
      },
    },
    gapRatio: 0.05,
    upperHeightRatio: 0.7,
    maxAspectRatio: 2,
  },
  color: {
    candleBody: {
      up: '#e90000',
      down: '#0000e9',
    },
    candleShadow: {
      up: '#e90000',
      down: '#0000e9',
    },
    gridLine: '#e0e0e0',
  },
  numBarsOnViewList: [8, 12, 17, 23, 30, 38, 47, 57, 68, 80, 93, 105],
  yAxis: {
    maxNumTicks: 7,
    fillStyle: '#333',
    fontFamily: 'Montserrat',
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
  barPaddingRatio: {
    priceChart: 0.2,
    trVolumeChart: 0.3,
  },
};

export default options;
