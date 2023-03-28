/**
 * @name base
 * @author Lester
 * @date 2021-05-29 17:29
 */
import { getQueryParam } from 'tenacity-tools';
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

export const urlSearchParams = (search: string): ParsedQs => {
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

export const debounce = <T = any>(
  fn: { apply: (arg0: any, arg1: T) => void },
  delay: number
): ((param?: T) => void) => {
  // 定时器
  let timer: NodeJS.Timeout;

  // 将debounce处理结果当作函数返回
  return (...args) => {
    // 保留调用时的this上下文
    // 保留调用时传入的参数
    // 每次事件被触发时，都去清除之前的旧定时器
    if (timer) {
      clearTimeout(timer);
    }
    // 设立新定时器
    timer = setTimeout(() => {
      console.log(args);
      fn.apply(this, args);
    }, delay);
  };
};

// throttle 函数节流， 规定一个时间n，n秒内，将触发的事件合并为一次并执行
export const throttle = (fn: { apply: (arg0: any, arg1: any) => void }, interval: number): Function => {
  // last为上一次触发回调的时间
  let last = 0;

  // 将throttle处理结果当作函数返回
  return function (this: any, ...args: any) {
    // 保留调用时传入的参数
    // 记录本次触发回调的时间
    const now = +new Date();

    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
    if (now - last >= interval) {
      // 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
      last = now;
      fn.apply(this, args);
    }
  };
};

/**
 * 导出文件
 * @param data
 * @param fileName
 */
export const exportFile = (data: BlobPart, fileName: string, suffix = 'xlsx'): void => {
  const blob = new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.setAttribute('download', fileName + '.' + suffix);
  document.body.appendChild(link);
  link.click(); // 点击下载
  link.remove(); // 下载完成移除元素
  window.URL.revokeObjectURL(link.href); // 用完之后使用URL.revokeObjectURL()释放；
};

/**
 * 根据节点Id 查询 父结构
 * const myTree = [
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
 * @returns  ["2","2-1"]
 */
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
/**
 * @param {arr: array, parentId: number}
 * @return {obj: object}
 */
export const arry2Tree = (arr: any[], parentId: string, idName = 'id'): any => {
  const map = new Map(); // 生成map存储元素
  for (const item of arr) {
    if (!map.has(item[idName])) {
      // 若map中没有当前元素，添加并初始化children
      map.set(item[idName], { ...item, children: [] });
    } else {
      map.set(item[idName], { ...map.get(item[idName]), ...item });
    }
    if (map.has(item.parentId)) {
      // 查找父元素，存在则将该元素插入到children
      map.get(item.parentId).children.push(map.get(item[idName]));
    } else {
      // 否则初始化父元素，并插入children
      map.set(item.parentId, { children: [map.get(item[idName])] });
    }
  }
  return map.get(parentId);
};
// 列表转为树
export const listToTree = (list: any[], parentKey = 'parentId', itemKey = 'id'): any[] => {
  const info = list.reduce((map, node) => {
    node.children = [];
    map[node[itemKey]] = node;
    return map;
  }, {});
  return list.filter((node) => {
    info[node[parentKey]] && info[node[parentKey]].children.push(node);
    // return !node[parentKey];
    return node[parentKey] === '0';
  });
};

// 删除树的某个节点
export const filterTree = (tree: any[], func: (node: any) => boolean): any[] => {
  const newTree = tree.filter(func);
  newTree.forEach((item) => item.children && (item.children = filterTree(item.children, func)));
  return newTree;
};

export const changeTreeItem = (tree: any[], func: (node: any) => any): any[] => {
  tree.forEach((item) => {
    if (func(item)) {
      item = func(item);
      return false;
    }
    if (item.children) {
      changeTreeItem(item.children, func);
    }
  });
  return tree;
};

// 小数点后两位百分比
export const percentage = (num: number, total: number): number | string => {
  if (num === 0 || total === 0) {
    return 0;
  }
  return Math.round((num / total) * 10000) / 100 + '%';
};
// 组织架构将已被选中的节点的所有后代节点过滤掉
export const filterChildren = (arr: any[]): any[] => {
  const newArr = [...arr];
  const newArr1: string[] = [];
  newArr.forEach((item) => {
    if (item.staffId) return;
    newArr.forEach((childrenItem) => {
      if (item === childrenItem) return;
      // 找出该选中节点的所有后代节点
      if (childrenItem.fullDeptId.split(',').includes(item.deptId.toString())) {
        if (childrenItem.staffId) {
          newArr1.push(childrenItem.staffId);
        } else {
          newArr1.push(childrenItem.deptId);
        }
      }
    });
  });
  // 过滤掉所有选中节点的后代节点
  return newArr.filter((item) => !newArr1.includes(item.staffId || item.deptId));
};
// 向树结构添加子节点
export const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] => {
  return list.map((node) => {
    if (node.deptId.toString() === key.toString()) {
      return {
        ...node,
        children
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children)
      };
    }
    return node;
  });
};
/**
 * 匹配字符串中的换行符
 * @param str string
 * @return string
 */
export const replaceEnter = (str: string): string => {
  // \n 匹配一个换行符, \r 匹配一个回车符
  return str.replace(/\\n|\n/g, '<br/>');
};

/**
 * @description 自动补0
 */
export const fix = (num: number, length: number): string => {
  return ('' + num).length < length ? (new Array(length + 1).join('0') + num).slice(-length) : '' + num;
};

/**
 * @description 阿拉伯数字转换汉字 1-99
 * @param number
 */
export const changeNumber = (num: number): string | undefined => {
  const numberArray = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  // 个位数
  if (num.toString().length === 1) {
    return numberArray[num];
  }
  // 十位数
  if (num.toString().length === 2) {
    // 十位数是1
    if (num < 20) {
      return '十' + numberArray[+num.toString()[1] - 1];
    } else {
      return numberArray[+num.toString()[0] - 1] + '十' + numberArray[+num.toString()[1] - 1];
    }
  }
};

/**
 * @description 十亿以下的阿拉伯数字转中文数字
 * @num 需要转换的阿拉伯数字
 * @isUpper 是否转成大写
 * @returns string
 */
export function numberToChinese (num: number, isUpper?: boolean): string {
  const chineseNums = isUpper
    ? ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
    : ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const chineseUnits = isUpper
    ? ['', '拾', '佰', '仟', '万', '拾万', '佰万', '仟万', '亿']
    : ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿'];
  let result = '';
  let unitIndex = 0;
  // 前一位默认为零
  let lastNumIsZero = true;
  // 从个位数依次获取
  while (num > 0) {
    const currentNum = num % 10;
    if (currentNum === 0) {
      // 当前位是0，如果前一位也是0，则不处理，如果前一位不是0，则加上 ‘零’
      if (!lastNumIsZero) {
        result = chineseNums[currentNum] + result;
      }
      lastNumIsZero = true;
    } else {
      // 当前位不是0，则正常处理
      result = chineseNums[currentNum] + chineseUnits[unitIndex] + result;
      lastNumIsZero = false;
    }
    unitIndex++;
    num = Math.floor(num / 10);
  }
  // 针对 10 - 19 中文阅读逻辑进行处理
  if (result.startsWith(isUpper ? '壹拾' : '一十')) {
    result = result.slice(1);
  }
  return result;
}

/**
 * @description 时间格式化
 * @param date
 * @returns [begin, end]
 */
export const formatDate = (date?: moment.Moment[]): string[] => {
  if (!date) return [];
  const [start, end] = date;
  return [start?.startOf('day').format('YYYY-MM-DD HH:mm:ss'), end?.endOf('day').format('YYYY-MM-DD HH:mm:ss')];
};
