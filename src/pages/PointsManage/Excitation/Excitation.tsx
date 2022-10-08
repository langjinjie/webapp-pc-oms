import React, { useMemo } from 'react';
import { Tabs } from 'antd';
import { /* NgTable, */ NoPermission } from 'src/components';
import Manage from 'src/pages/PointsManage/Excitation/Manage/Manage';
import PointsSend from 'src/pages/PointsManage/Excitation/PointsSend/PointsSend';
import style from './style.module.less';

export const stateOptions = [
  { value: 0, label: '未上架' },
  { value: 1, label: '已上架' },
  { value: 2, label: '已下架' }
];

// 积分发放状态
export const sendStatusOptions = [
  { value: 0, label: '未发放' },
  { value: 1, label: '已发放' }
];

const tabList = [
  { path: '/excitation', name: '激励任务', key: '1' },
  { path: '/pointsSend', name: '积分发放', key: '2' }
];

const tabComponentsList = [
  { path: '/excitation', component: <Manage /> },
  { path: '/pointsSend', component: <PointsSend /> }
];

const Excitation: React.FC = () => {
  // tab切换
  const tabOnChange = (key: string) => {
    // setTabKey(key);
    // getList(key);
    console.log('key', key);
  };

  const authorTabList = useMemo(() => {
    // return tabList.filter((tabItem) => btnList.includes(tabItem.path));
    return tabList;
  }, []);
  return authorTabList.length === 0
    ? (
    <NoPermission />
      )
    : (
    <div className={style.wrap}>
      <Tabs defaultActiveKey={authorTabList?.[0].key || ''} onChange={tabOnChange}>
        {authorTabList.map((item) => {
          return (
            <Tabs.TabPane tab={item.name} key={item.key}>
              {tabComponentsList.find((findItem) => findItem.path === item.path)?.component}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    </div>
      );
};
export default Excitation;
