import React from 'react';
import style from './style.module.less';

const EmptyTag: React.FC = () => {
  return (
    <div className={style.emptyWrap}>
      <img className={style.emptyImg} src={require('src/assets/images/empty_result.png')} alt="" />
      <div className={style.mainText}>查无结果</div>
      <div className={style.deputyText}>抱歉，未搜索到相关标签！</div>
    </div>
  );
};

export default EmptyTag;
