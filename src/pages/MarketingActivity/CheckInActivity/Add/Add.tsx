import React, { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import { BreadCrumbs } from 'src/components';
import BasicSettings from './BasicSettings/BasicSettings';
import RewardRules from './RewardRules/RewardRules';
import style from './style.module.less';
import qs from 'qs';

const Add: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [activityInfo, setActivityInfo] = useState<{ actId: string; subject: string }>();

  const tabOnChange = (activeKey: string) => {
    if (activeKeys.includes(activeKey)) {
      setActiveKey(activeKey);
    }
  };
  // 初始化activeKeys
  const initActiveKeys = () => {
    const { activityId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (!activityId) {
      setActiveKeys(['1', '2', '3']);
    }
  };

  const activityInfoOnChange = (value: { actId: string; subject: string }) => {
    setActivityInfo(value);
  };
  console.log('组件重新渲染了');
  useEffect(() => {
    initActiveKeys();
  }, []);
  return (
    <Card
      title={
        <>
          <BreadCrumbs
            className={style.breadCrumbs}
            navList={[{ path: '/questionActivity', name: '打卡活动' }, { name: '创建活动' }]}
          />
          创建活动
        </>
      }
    >
      <Tabs onChange={tabOnChange} activeKey={activeKey}>
        <Tabs.TabPane tab="基础设置" key={'1'}>
          <BasicSettings onConfirm={() => setActiveKey('2')} activityInfoOnChange={activityInfoOnChange} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="题目设置" key={'2'}>
          <RewardRules activityInfo={activityInfo} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
export default Add;
