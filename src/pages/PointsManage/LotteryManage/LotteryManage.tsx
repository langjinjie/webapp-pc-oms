import React from 'react';
import { Tabs } from 'antd';
import ProvidePhone from './ProvideSuperprize/ProvideSuperprize';
import LotterySetting from './LotterySetting/LotterySetting';
import style from './style.module.less';

const LotteryManage: React.FC = () => {
  const tabsNavList = ['抽奖设置', '大奖发放'];
  const tabsComponentsList = [<LotterySetting key={0} />, <ProvidePhone key={1} />];
  return (
    <div className={style.wrap}>
      <Tabs defaultActiveKey="0" animated={true}>
        {tabsNavList.map((item, index) => (
          <Tabs.TabPane tab={item} key={index}>
            {tabsComponentsList[index]}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};
export default LotteryManage;
