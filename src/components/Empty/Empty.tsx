import React from 'react';
import style from './style.module.less';

const Empty: React.FC = () => {
  return (
    <div className={style.emptyWrap}>
      <img className={style.emptyImg} src={require('src/assets/images/empty_result.png')} alt="" />
      <div className={style.emptyText}>暂无数据</div>
    </div>
  );
};

export default Empty;
