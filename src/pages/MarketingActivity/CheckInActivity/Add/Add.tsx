import React from 'react';
import { Card, Tabs } from 'antd';
import { BreadCrumbs } from 'src/components';
import BasicSettings from './BasicSettings/BasicSettings';
import RewardRules from './RewardRules/RewardRules';
import style from './style.module.less';

const Add: React.FC = () => {
  return (
    <Card
      title={
        <>
          <BreadCrumbs
            className={style.breadCrumbs}
            navList={[{ path: '/checkIn', name: '打卡活动' }, { name: '创建活动' }]}
          />
          创建活动
        </>
      }
    >
      <Tabs>
        <Tabs.TabPane tab="基础设置" key={'1'}>
          <BasicSettings />
        </Tabs.TabPane>
        <Tabs.TabPane tab="奖励规则" key={'2'}>
          <RewardRules />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
export default Add;
