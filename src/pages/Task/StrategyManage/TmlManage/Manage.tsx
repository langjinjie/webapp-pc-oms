import React from 'react';
import { Button } from 'antd';
import style from './style.module.less';
import classNames from 'classnames';
import { NgFormSearch } from 'src/components';
import { searchCols } from './config';

const Manage: React.FC = () => {
  const onSearch = (values: any) => {
    console.log(values);
  };
  return (
    <div>
      <div className={classNames(style.banner, 'flex align-center justify-end')}>
        <h3>自动化运营体系,助力机构效率提升</h3>
      </div>
      <div className="ph20">
        <NgFormSearch searchCols={searchCols} onSearch={onSearch} hideReset />
        <div className={style.taskWrap}>
          {new Array(10).fill(1).map((item, index) => (
            <div className={style.taskItem} key={item + index}>
              <div className={style.taskImgWrap}>
                <img className={style.taskImg} src="/src/assets/images/bg.jpg" />
              </div>
              <div className={style.taskName}>生日场景</div>
              <div className={style.taskTarget}>效果：提升转化百分之100%</div>
              <div className={style.taskTips}>任务说明：适用于在销售期的转化， 任务场景：保险转化</div>
              <Button className={style.useBtn} type="primary">
                立即使用
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Manage;
