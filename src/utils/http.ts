/**
 * @Author lester
 * @Date 2020-07-17
 */

import Axios, { AxiosInstance, Method, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';

const history = useHistory();

type HttpMethod = (...args: any) => Promise<any>;

const instance: AxiosInstance = Axios.create({
  timeout: 10000
});

/**
 * 拦截器
 */
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
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
    history.push('/login');
    /* const { origin, href } = window.location;
    const url: string = origin + '/tenacity-oms/login?redirectUrl=' + encodeURIComponent(href);
    window.location.replace(url); */
  }
};

/**
 * 处理response数据
 * @param res
 * @param resolve
 */
const handleRes = (res: AxiosResponse, resolve: Function) => {
  if (res.status === 200) {
    if (res.data.ret === 0) {
      resolve(res.data.retdata || typeof res.data.retdata === 'boolean' ? res.data.retdata : {});
    } else {
      if (res.data.ret === 1000001) {
        history.push('/login');
        /* const { origin, href } = window.location;
        const url: string = origin + '/tenacity-oms/login?redirectUrl=' + encodeURIComponent(href);
        window.location.replace(url); */
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

export type HttpFunction = (param: Object) => Promise<any>;

export type Void2Promise = () => Promise<any>;

export default {
  get,
  post: unGet('post'),
  delete: deleteMethod,
  put: unGet('put'),
  request
};
