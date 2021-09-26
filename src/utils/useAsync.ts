import { useState } from 'react';

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success';
}

const defaultInitialState: State<null> = {
  stat: 'idle',
  data: null,
  error: null
};

const defaultConfig = {
  throwError: false
};

interface AsyncReturnProps<D> {
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success';
  isIdle: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  run: (promise: Promise<D>) => Promise<D>;
  setData: (data: D) => void;
  setError: (error: Error) => void;
}

export const useAsync = <D>(initialState?: State<D>, initialConfig?: typeof defaultConfig): AsyncReturnProps<D> => {
  const config = { ...defaultConfig, ...initialConfig };
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState
  });
  const setData = (data: D) =>
    setState({
      data,
      stat: 'success',
      error: null
    });

  const setError = (error: Error) =>
    setState({
      error,
      stat: 'error',
      data: null
    });

  // run用来触发异步请求
  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error('请输入 Promise 类型数据');
    }
    setState({ ...state, stat: 'loading' });
    return promise
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((error) => {
        // catch 会消化异常，如果不主动抛出，外面是接收不到异常
        setError(error);
        if (config.throwError) {
          return Promise.reject(error);
        }
        return error;
      });
  };

  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    ...state
  };
};
