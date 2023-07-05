import { Button, Divider } from 'antd';
import React, { useState } from 'react';
import { BreadCrumbs, NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableCols } from './Config';

import style from './style.module.less';

const GroupMember: React.FC = () => {
  const [groupDetail, setGroupDetail] = useState({
    count: 0,
    externalCount: 0,
    yesterdayJoinCount: 0,
    outCount: 0
  });
  const onSearch = (values: any) => {
    console.log(values);
    setGroupDetail(groupDetail);
  };
  return (
    <div className="container">
      <BreadCrumbs
        navList={[
          {
            name: '客户群管理'
          },
          { name: '群详情' }
        ]}
      />

      <h3 className="mt20 f20 bold">江西企微新试点团队先锋营群详情（群主：严雅敏）</h3>
      <Divider />

      <div className={style.dataWrap}>
        <h4 className="f16 mb20">取数据</h4>
        <div className="flex">
          <dl className={style.dataItem}>
            <dt className={style.dataTitle}>群总人数</dt>
            <dd>{groupDetail.count}</dd>
          </dl>
          <dl className={style.dataItem}>
            <dt className={style.dataTitle}>外部联系人</dt>
            <dd>{groupDetail.externalCount}</dd>
          </dl>
          <dl className={style.dataItem}>
            <dt className={style.dataTitle}>昨日进群人数</dt>
            <dd>{groupDetail.yesterdayJoinCount}</dd>
          </dl>
          <dl className={style.dataItem}>
            <dt className={style.dataTitle}>退群人数</dt>
            <dd>{groupDetail.outCount}</dd>
          </dl>
        </div>
      </div>

      <div className="cell pt25">
        <div className="flex align-end">
          <div className="cell">
            <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
          </div>
          <Button className="fixed flex mb10" type="primary" shape="round">
            导出群信息
          </Button>
        </div>
      </div>
      <NgTable className="pt15" columns={tableCols}></NgTable>
    </div>
  );
};

export default GroupMember;
