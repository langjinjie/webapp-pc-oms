import React, { useState } from 'react';
import { Tabs } from 'antd';

import { NodeList } from './NodeList';
import { ActionList } from './ActionList';
import { useDocumentTitle } from 'src/utils/base';

const RuleManageList: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('1');
  useDocumentTitle('智能运营-规则管理');
  const onTapsChange = (current: string) => {
    setCurrentTab(current);
  };

  return (
    <div className="container">
      <Tabs onChange={onTapsChange} defaultActiveKey={currentTab}>
        <Tabs.TabPane tab={'节点规则管理'} key={'1'}>
          <NodeList />
        </Tabs.TabPane>
        <Tabs.TabPane tab={'动作规则管理'} key={'2'}>
          <ActionList />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default RuleManageList;
