import classNames from 'classnames';
import React from 'react';
import style from './style.module.less';

export const AreaTips: React.FC<{ value?: any; className?: string }> = ({ value, className }) => {
  if (value) {
    return (
      <div className={classNames(style.areaTips, className)}>
        <span>合计：</span>
        <span className={style.areaTipsVal}>{value.totalNum}人</span>
        <span>可见：</span>
        <span className={style.areaTipsVal}>{value.visibleNum}人</span>
        <span>不可见：</span>
        <span>{value.invisibleNum}人</span>
      </div>
    );
  } else {
    return null;
  }
};
