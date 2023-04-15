import { sizeFormatter } from 'human-readable';

const filesize = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal}\xA0${symbol}B`,
});

export default filesize;
