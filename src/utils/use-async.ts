import { useCallback, useReducer, useState, useRef, useEffect } from 'react';
/**
 * 返回组件挂载状态，如果没有挂载或者已经下载，返回false: 反之返回true
 *
 */
export const useMountedRef = (): React.MutableRefObject<boolean> => {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  });
  return mountedRef;
};

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

const useSafeDispatch = <T>(dispatch: (...args: T[]) => void) => {
  const mountedRef = useMountedRef();
  return useCallback((...args: T[]) => (mountedRef.current ? dispatch(...args) : undefined), [dispatch, mountedRef]);
};
interface ReturnType<D> {
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success';
  isIdle: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  retry: () => void;
  run: (
    promise: Promise<D>,
    runConfig?:
      | {
          retry: () => Promise<D>;
        }
      | undefined
  ) => Promise<any>;
  setData: (data: D) => void;
  setError: (error: Error) => void;
}
export const useAsync = <D>(initialState?: State<D>, initialConfig?: typeof defaultConfig): ReturnType<D> => {
  const config = { ...defaultConfig, ...initialConfig };
  const [state, dispatch] = useReducer((state: State<D>, action: Partial<State<D>>) => ({ ...state, ...action }), {
    ...defaultInitialState,
    ...initialState
  });

  const safeDispatch = useSafeDispatch(dispatch);
  // useState 直接传入函数的含义是： 惰性初始化，所以，要用useState保存函数，不能直接传入函数
  const [retry, setRetry] = useState(() => () => {
    console.log();
  });

  const setData = useCallback(
    (data: D) =>
      safeDispatch({
        data,
        stat: 'success',
        error: null
      }),
    [safeDispatch]
  );

  const setError = useCallback(
    (error: Error) =>
      safeDispatch({
        error,
        stat: 'error',
        data: null
      }),
    [safeDispatch]
  );

  // run用来触发异步请求
  const run = useCallback(
    (promise: Promise<D>, runConfig?: { retry: () => Promise<D> }) => {
      if (!promise || !promise.then) {
        throw new Error('请输入 Promise 类型数据');
      }
      setRetry(() => () => {
        if (runConfig?.retry) {
          run(runConfig?.retry(), runConfig);
        }
      });

      safeDispatch({ stat: 'loading' });
      return promise
        .then((data: D) => {
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
    },
    [config.throwError, setData, setError, safeDispatch]
  );
  return {
    isIdle: state.stat === 'idle',
    isLoading: state.stat === 'loading',
    isError: state.stat === 'error',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    retry,
    ...state
  };
};
