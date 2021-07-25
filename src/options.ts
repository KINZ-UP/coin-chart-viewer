const options = {
  geoConfiguration: {
    marginRatio: {
      top: 0.05,
      left: 0,
      bottom: 0.05,
      right: 0.1,
    },
    gapRatio: 0.05,
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
  },
  numBarsOnViewList: [8, 12, 17, 23, 30, 38, 47, 57, 68, 80, 93, 105],
};

export default options;
