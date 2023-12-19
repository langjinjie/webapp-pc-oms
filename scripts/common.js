const path = require('path');

const fix = (num, length) => {
  return ('' + num).length < length ? (new Array(length + 1).join('0') + num).slice(-length) : '' + num;
};
const date = new Date();
const time = `${date.getFullYear()}${fix(date.getMonth() + 1, 2)}${fix(date.getDate(), 2)}${fix(
  date.getHours(),
  2
)}${fix(date.getMinutes(), 2)}${fix(date.getSeconds(), 2)}`;

const ROOT_PATH = path.resolve(__dirname, '../');

module.exports = {
  time,
  ROOT_PATH
};
