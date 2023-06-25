import { Tabs } from 'antd';
import React, { useState } from 'react';
import TimeoutLogList from './list/TimeoutLogList';
import TimeoutRuleList from './list/TimeoutRuleList';

const ChatNoResponse: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('2');
  const onTapsChange = (current: string) => {
    setCurrentTab(current);
  };

  return (
    <div className="container">
      <Tabs onChange={onTapsChange} defaultActiveKey={currentTab}>
        <Tabs.TabPane tab={'超时配置'} key={'1'}>
          <TimeoutRuleList />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'超时记录'} key={'2'}>
          <TimeoutLogList />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ChatNoResponse;
