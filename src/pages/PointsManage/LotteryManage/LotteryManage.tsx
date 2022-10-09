import React from 'react';
import { Tabs } from 'antd';
import ProvidePhone from './ProvideSuperprize/ProvideSuperprize';
import LotterySetting from './LotterySetting/LotterySetting';
import style from './style.module.less';

const LotteryManage: React.FC = () => {
  const tabsNavList = [
    { key: 0, name: '抽奖设置', component: <LotterySetting key={0} /> },
    { key: 1, name: '大奖发放', component: <ProvidePhone key={1} /> }
  ];
  return (
    <div className={style.wrap}>
      <Tabs defaultActiveKey="0">
        {tabsNavList.map((item) => (
          <Tabs.TabPane tab={item.name} key={item.key}>
            {item.component}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};
export default LotteryManage;
