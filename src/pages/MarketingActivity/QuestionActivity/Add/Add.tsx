import React, { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import { BreadCrumbs } from 'src/components';
import { useHistory } from 'react-router-dom';
import BasicSettings from './BasicSettings/BasicSettings';
import QuestionSettings from './QuestionSettings/QuestionSettings';
import RewardRules from './RewardRules/RewardRules';
import style from './style.module.less';
import qs from 'qs';

const Add: React.FC = () => {
  const [activeKey, setActiveKey] = useState('2');
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const history = useHistory();

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
          <BasicSettings onConfirm={() => setActiveKey('2')} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="题目设置" key={'2'}>
          <QuestionSettings onConfirm={() => setActiveKey('3')} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="奖励规则" key={'3'}>
          <RewardRules onConfirm={() => history.push('/questionActivity')} />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};
export default Add;
