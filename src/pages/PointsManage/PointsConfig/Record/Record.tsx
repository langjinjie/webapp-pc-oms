import React from 'react';
import { BreadCrumbs, NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun } from './Config';
import style from './style.module.less';

const Record: React.FC = () => {
  const onSearchHandle = (values: any) => {
    console.log('搜索', values);
  };
  return (
    <div className={style.wrap}>
      <div className={style.breadCrumbsWrap}>
        <BreadCrumbs
          navList={[
            { path: '/pointsConfig', name: '打卡与奖励任务' },
            { path: '', name: '操作记录' }
          ]}
        />
      </div>
      <NgFormSearch searchCols={searchCols} onSearch={onSearchHandle} />
      <NgTable columns={tableColumnsFun()} />
    </div>
  );
};
export default Record;
