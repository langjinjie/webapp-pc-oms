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

/**
 * 导出文件
 * @param data
 * @param fileName
 */
export const exportFile = (data: BlobPart, fileName: string): void => {
  const blob = new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', fileName + '.xlsx');
  document.body.appendChild(link);
  link.click(); // 点击下载
  link.remove(); // 下载完成移除元素
  window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
};

export function treeFindPath (tree: any[], func: (node: any) => boolean, path: any[] = []): any[] {
  if (!tree) return [];
  for (const data of tree) {
    path.push(data);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}
// 用上面的树结构测试：

const myTree = [
  {
    id: '1',
    name: '主父1',
    children: [
      {
        id: '1-1',
        name: '父1'
      },
      {
        id: '1-2',
        name: '父2',
        children: [
          {
            id: '2-2-1-1',
            name: '子1'
          },
          {
            id: '1-2-2',
            name: '子2'
          }
        ]
      }
    ]
  }
];
const result = treeFindPath(myTree, (node) => node.id === '2-2-1-1');
console.log(result);
// 输出：

// ["2","2-1"]
/**
 * @param arr
 * @return arr
 */
export const tree2Arry = (arr: any[]): any[] => {
  const res = [];
  res.push(...arr); // chilren插入结果数组
  for (const item of arr) {
    // 遍历子元素，若包含children则递归调用
    if (item.children && item.children.length) {
      res.push(...tree2Arry(item.children));
    }
  }
  return res;
};
