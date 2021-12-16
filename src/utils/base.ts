/**
 * @name base
 * @author Lester
 * @date 2021-05-29 17:29
 */
import { getQueryParam } from 'lester-tools';
import qs, { ParsedQs } from 'qs';
import { useEffect, useRef } from 'react';
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
export const useDocumentTitle = (title: string, keepOnUumount = true): void => {
  const oldTitle = useRef(document.title).current;
  // 页面加载时：oldTitle === 旧title 'React App'
  // 加载后：oldTitle === 新title

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUumount) {
        // 如果不指定依赖，读取的是旧title
        document.title = oldTitle;
      }
    };
  }, [keepOnUumount, oldTitle]);
};
export const UNKNOWN = '— —';

export const debounce = (fn: { apply: (arg0: any, arg1: any) => void }, delay: number): (() => void) => {
  // 定时器
  let timer: NodeJS.Timeout;

  // 将debounce处理结果当作函数返回
  return (...args: any) => {
    // 保留调用时的this上下文
    // 保留调用时传入的参数
    // 每次事件被触发时，都去清除之前的旧定时器
    if (timer) {
      clearTimeout(timer);
    }
    // 设立新定时器
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};
