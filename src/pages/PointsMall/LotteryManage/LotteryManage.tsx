import React from 'react';
import { Tabs } from 'antd';
import ProvidePhone from './ProvidePhone/ProvidePhone';
import LotterySetting from './LotterySetting/LotterySetting';
import style from './style.module.less';

const LotteryManage: React.FC = () => {
  const tabsNavList = ['手机发放', '抽奖设置'];
  const tabsComponentsList = [<ProvidePhone key={0} />, <LotterySetting key={1} />];
  return (
    <div className={style.wrap}>
      <Tabs defaultActiveKey="1" animated={true}>
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
