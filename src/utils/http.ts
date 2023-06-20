/**
 * @Author lester
 * @Date 2020-07-17
 */

import Axios, { AxiosInstance, Method, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { message, Modal } from 'antd';
import { TOKEN_KEY } from './config';

type HttpMethod = (...args: any) => Promise<any>;

const instance: AxiosInstance = Axios.create({
  timeout: 60000
});

/**
 * 拦截器
 */
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在请求头部添加token
    if (config.url !== '/tenacity-admin/api/user/login') {
      config.headers.myToken = localStorage.getItem(TOKEN_KEY);
    }
    return config;
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  (err: AxiosError) => {
    return Promise.reject(err);
  }
);

/**
 * 处理token失效
 * @param err
 */
const handleError = (err: AxiosError) => {
  if (JSON.stringify(err).includes('403')) {
    const { origin, href } = window.location;
    const url: string = origin + '/tenacity-oms/login?redirectUrl=' + encodeURIComponent(href);
    window.location.replace(url);
  }
};

/**
 * 处理response数据
 * @param res
 * @param resolve
 */
const handleRes = (res: AxiosResponse, resolve: Function) => {
  if (res.status === 200) {
    // @ts-ignore
    if (res.config.responseType === 'blob') {
      resolve(res);
      return false;
    }
    if (res.data.ret === 0) {
      resolve(res.data.retdata || typeof res.data.retdata === 'boolean' ? res.data.retdata : {});
      // 激励积分导入失败，通用错误码 400001
    } else if (res.data.ret === 400001) {
      Modal.warning({
        title: '温馨提示',
        content: res.data.retmsg
      });
      resolve(null);
    } else {
      if (res.data.ret === 1000001) {
        const { origin, href } = window.location;
        const url: string = origin + '/tenacity-oms/login?redirectUrl=' + encodeURIComponent(href);
        window.location.replace(url);
      } else {
        const { retmsg } = res.data;
        message.error(retmsg);
        resolve(null);
      }
    }
  } else {
    const { statusText } = res;
    message.error(statusText);
    resolve(null);
  }
};

const get: HttpMethod = (url: string, params?: any, config?: AxiosRequestConfig) => {
  return new Promise((resolve) => {
    instance
      .get(url, {
        params,
        ...config
      })
      .then((res: AxiosResponse) => {
        handleRes(res, resolve);
      })
      .catch((err: AxiosError) => {
        console.error(err);
        handleError(err);
        resolve(null);
      });
  });
};

const deleteMethod: any = (url: string, data: any, config?: AxiosRequestConfig) => {
  return new Promise((resolve) => {
    instance
      .delete(url, {
        data: {
          ...data
        },
        ...config
      })
      .then((res: AxiosResponse) => {
        handleRes(res, resolve);
      })
      .catch((err: AxiosError) => {
        console.error(err);
        handleError(err);
        resolve(null);
      });
  });
};

type RequestMethod = 'post' | 'put';

const unGet = (type: RequestMethod) => {
  return (url: string, data: any = {}, config?: AxiosRequestConfig) => {
    return new Promise((resolve) => {
      instance[type](url, data, {
        ...config
      })
        .then((res: AxiosResponse) => {
          handleRes(res, resolve);
        })
        .catch((err: AxiosError) => {
          console.error(err);
          handleError(err);
          resolve(null);
        });
    });
  };
};

const request: HttpMethod = (url: string, params?: any, type: Method = 'get', config?: AxiosRequestConfig) => {
  return new Promise((resolve) => {
    /**
     * 处理response数据
     * @param res
     */
    const handleRes = (res: AxiosResponse) => {
      if (res.status === 200) {
        // @ts-ignore
        if (res.config.responseType === 'bold') {
          return resolve(res.data);
        }
        if (res.data.ret === 0) {
          resolve(res.data.retdata || typeof res.data.retdata === 'boolean' ? res.data.retdata : {});
        } else {
          const { retmsg } = res.data;
          message.error(retmsg);
          resolve(null);
        }
      } else {
        const { statusText } = res;
        message.error(statusText);
        resolve(null);
      }
    };

    if (type === 'get') {
      instance
        .get(url, {
          params,
          ...config
        })
        .then((res: AxiosResponse) => {
          handleRes(res);
        })
        .catch((err: AxiosError) => {
          console.error(err);
          handleError(err);
          resolve(null);
        });
    } else if (type === 'delete') {
      instance
        .delete(url, {
          data: {
            ...params
          },
          ...config
        })
        .then((res: AxiosResponse) => {
          handleRes(res);
        })
        .catch((err: AxiosError) => {
          console.error(err);
          handleError(err);
          resolve(null);
        });
    } else {
      // @ts-ignore
      instance[type](url, params, {
        ...config
      })
        .then((res: AxiosResponse) => {
          handleRes(res);
        })
        .catch((err: AxiosError) => {
          resolve(null);
          console.error(err);
          handleError(err);
        });
    }
  });
};

export type HttpFunction<T = Object> = (param: T) => Promise<any>;

export type Void2Promise = () => Promise<any>;

export default {
  get,
  post: unGet('post'),
  delete: deleteMethod,
  put: unGet('put'),
  request
};
