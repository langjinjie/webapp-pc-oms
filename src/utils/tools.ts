/*
 * @Descripttion:通用工具函数
 * @version: 1.0.0
 * @Author: Jser
 * @Date: 2021-06-02 15:13:17
 */
import moment from 'moment';
//  判断时间戳是前几天
export const getDateTimeBefor = (publishtime: string): string => {
  const date: Date = new Date();
  const currTime: number = Date.parse(date.toString());
  const l = currTime - Date.parse(publishtime);
  // 少于一分钟
  const time = l / 1000;
  // 秒转天数
  const days = time / 3600 / 24;
  if (days < 1) {
    return '今日 ' + moment(publishtime).format('hh:mm');
  }
  if (days < 2) {
    return '昨日 ' + moment(publishtime).format('hh:mm');
  }
  return moment(publishtime).format('MM-DD hh:mm');
};

export const isPhoneNo = (phone: string): boolean => {
  const phoneReg = /^1[3-9]\d{9}$/;
  if (phoneReg.test(phone)) {
    return true;
  } else {
    return false;
  }
};

/**
 * 判断是否为数组
 * []
 */
export const isArray = (arr: unknown): boolean => {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

/**
 * @description 是否是一个对象
 * {}
 * @return boolean
 */
export const isObject = (abj: unknown): boolean => {
  return Object.prototype.toString.call(abj) === '[object Array]';
};

// 小数点后两位百分比
export const percentage = (num: number, total: number): number | string => {
  if (num === 0 || total === 0) {
    return '0%';
  }
  return Math.round((num / total) * 10000) / 100 + '%';
};

// 千分位格式化
export const numFormat = (num: number, places = 3, symbol = ','): string => {
  const reg = new RegExp('\\B(?=(\\d{' + places + '})+(?!\\d))', 'g');
  return num.toString().replace(reg, symbol);
};

export const groupArr = (array: any[], subGroupLength = 0): any[] => {
  let index = 0;
  const newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, index + subGroupLength));
    index += subGroupLength;
  }
  return newArray;
};
