/**
 * @name Index
 * @author Lester
 * @date 2021-05-07 09:26
 */

import React, { useContext, useState } from 'react';
import style from './style.module.less';
import { Context } from 'src/store';
import { useDocumentTitle } from 'src/utils/base';
const Index: React.FC = () => {
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  console.log('更新了~~');

  // 异步更新
  const handleUpdate = () => {
    setCount(count + 1);
    console.log('count: ', count);
    setIndex(index - 1);
    console.log('index: ', index);
  };

  // 同步更新
  const handleTimeoutUpdate = () => {
    setTimeout(() => {
      setCount(count + 1);
      // 可以拿到最新值
      console.log('count: ', count);
      setIndex(index - 1);
      // 可以拿到最新值
      console.log('index: ', index);
    }, 0);
  };

  useDocumentTitle('内部运营系统');
  const { userInfo } = useContext(Context);
  return (
    <div className={style.wrap}>
      {userInfo?.corpName}欢迎您
      <span>count: {count}</span>
      <span>index: {index}</span>
      <button onClick={handleUpdate}>更新</button>
      <button onClick={handleTimeoutUpdate}>setTimeout更新</button>
    </div>
  );
};

export default Index;
