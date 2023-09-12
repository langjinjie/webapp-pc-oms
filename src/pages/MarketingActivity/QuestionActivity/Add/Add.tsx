import React, { useEffect, useState, useMemo } from 'react';
import { Card, Tabs } from 'antd';
import { BreadCrumbs } from 'src/components';
import BasicSettings from './BasicSettings/BasicSettings';
import QuestionSettings from './QuestionSettings/QuestionSettings';
import RewardRules from './RewardRules/RewardRules';
import style from './style.module.less';
import qs from 'qs';

const Add: React.FC = () => {
  const [activeKey, setActiveKey] = useState('1');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const [activityInfo, setActivityInfo] = useState<{ activityId: string; activityName: string }>();

  const navList = useMemo(() => {
    const { activityId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    return [{ path: '/questionActivity', name: '问答活动' }, { name: `${activityId ? '编辑' : '创建'}活动` }];
  }, []);

  const tabOnChange = (activeKey: string) => {
    if (activeKeys.includes(activeKey)) {
      setActiveKey(activeKey);
    }
  };
  // 初始化activeKeys
  const initActiveKeys = () => {
    const { activityId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (activityId) {
      setActiveKeys(['1', '2', '3']);
    }
  };

  const activityInfoOnChange = (value: { activityId: string; activityName: string }) => {
    setActivityInfo(value);
  };

  useEffect(() => {
    initActiveKeys();
  }, []);
  return (
    <Card
      title={
        <>
          <BreadCrumbs className={style.breadCrumbs} navList={navList} />
          创建活动
        </>
      }
    >
      <Tabs onChange={tabOnChange} activeKey={activeKey}>
        <Tabs.TabPane tab="基础设置" key={'1'}>
          <BasicSettings
            onConfirm={() => {
              setActiveKey('2');
              setActiveKeys(['1', '2']);
            }}
            activityInfoOnChange={activityInfoOnChange}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="题目设置" key={'2'}>
          <QuestionSettings
            onConfirm={() => {
              setActiveKey('3');
              setActiveKeys(['1', '2', '3']);
            }}
            activityInfo={activityInfo}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="奖励规则" key={'3'}>
          <RewardRules activityInfo={activityInfo} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
export default Add;
