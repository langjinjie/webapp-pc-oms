import { Divider } from 'antd';
import React from 'react';
import { BreadCrumbs } from 'src/components';
const GroupMember: React.FC = () => {
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

      <h3>江西企微新试点团队先锋营群详情（群主：严雅敏）</h3>
      <Divider />

      <div className="flex">
        <h4>取数据</h4>
        <dl>
          <dt>群总人数</dt>
          <dd>91</dd>
        </dl>
        <dl>
          <dt>外部联系人</dt>
          <dd>91</dd>
        </dl>
        <dl>
          <dt>进群人数</dt>
          <dd>91</dd>
        </dl>
        <dl>
          <dt>退群人数</dt>
          <dd>91</dd>
        </dl>
      </div>
    </div>
  );
};

export default GroupMember;
