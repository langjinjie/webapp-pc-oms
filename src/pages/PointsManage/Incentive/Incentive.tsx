import React, { useContext, useMemo } from 'react';
import { Context } from 'src/store';
import { Tabs } from 'antd';
import { /* NgTable, */ NoPermission } from 'src/components';
import Manage from 'src/pages/PointsManage/Incentive/Manage/Manage';
import PointsSend from 'src/pages/PointsManage/Incentive/PointsSend/PointsSend';
import style from './style.module.less';

export const stateOptions = [
  { value: 0, label: '未上架' },
  { value: 1, label: '已上架' },
  { value: 2, label: '已下架' },
  { value: 3, label: '已结束' }
];

// 积分发放状态
export const sendStatusOptions = [
  { value: 0, label: '未发放' },
  { value: 1, label: '已发放' }
];

const tabList = [
  { path: '/incentiveManage', name: '激励任务', key: '1' },
  { path: '/sendPoints', name: '积分发放', key: '2' }
];

const tabComponentsList = [
  { path: '/incentiveManage', component: <Manage /> },
  { path: '/sendPoints', component: <PointsSend /> }
];

const Incentive: React.FC = () => {
  const { btnList } = useContext(Context);

  const authorTabList = useMemo(() => {
    return tabList.filter((tabItem) => btnList.includes(tabItem.path));
  }, [btnList]);
  return authorTabList.length === 0
    ? (
    <NoPermission />
      )
    : (
    <div className={style.wrap}>
      <Tabs defaultActiveKey={authorTabList?.[0].key || ''}>
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
export default Incentive;
