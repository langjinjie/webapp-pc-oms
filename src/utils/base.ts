/**
 * @name base
 * @author Lester
 * @date 2021-05-29 17:29
 */
import { getQueryParam } from 'lester-tools';
import qs, { ParsedQs } from 'qs';

type commonFC = (...args: any) => any;

/**
 * 下载图片
 * @param url
 * @param name
 */
export const downloadImage: commonFC = (url: string, name: string) => {
  const hrefEle = document.createElement('a');
  hrefEle.href = url;
  hrefEle.setAttribute('download', name);
  hrefEle.click();
};

/**
 * 获取指定Url参数
 * @param key
 */
export const getUrlQueryParam: (key: string) => string = (key: string) => {
  const queryParam: any = JSON.parse(window.localStorage.getItem('queryParam') || '{}');
  return getQueryParam(key) || queryParam[key];
};

/**
 * 获取cookie
 * @param key
 */
export const getCookie: (key: string) => string = (key: string) => {
  if (!document.cookie || !window.navigator.cookieEnabled) {
    return '';
  }
  const regExe = new RegExp(`${key}=([\\w]+)`);
  const res = document.cookie.match(regExe) || [];
  return res[1];
};

/**
 * 设置cookie
 * @param name
 * @param value
 * @param time
 */
export const setCookie: (name: string, value: string, time: number) => void = (
  name: string,
  value: string,
  time = 30 * 24 * 3600
) => {
  const exp = new Date();
  exp.setTime(exp.getTime() + time * 1000);
  document.cookie = name + '=' + value + ';expires=' + exp.toUTCString() + ';path=/';
};

export const URLSearchParams = (search: string): ParsedQs => {
  return qs.parse(search, { ignoreQueryPrefix: true });
};
