import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Context } from 'src/store';
import { Tabs } from 'antd';
import { Icon } from 'tenacity-ui';
import { NgTable } from 'src/components';
import { tableColumnsFun, IPointsConfigItem } from './Config';
import style from './style.module.less';

const tabList = [
  { path: '/clockPoints', name: '打卡任务', key: '1' },
  { path: '/rewardPoints', name: '奖励任务', key: '2' }
];

const PointsConfig: React.FC = () => {
  const { btnList } = useContext(Context);
  const [list, setList] = useState<IPointsConfigItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取列表
  const getList = () => {
    const list = [
      {
        pointsTaskId: '1',
        taskType: 1,
        taskName: '发送朋友圈',
        taskDesc: '尽情装扮，尽情可爱...',
        taskDetail: '任务详细说明',
        actionNum: 2,
        sort: 1,
        taskPoints: 20,
        maxPoints: 100,
        periodType: 1,
        state: 1,
        businessModel: '',
        effectiveTime: '2022-09-08'
      }
    ];
    setLoading(true);
    setList(list);
    setLoading(false);
  };

  const authorTabList = useMemo(() => {
    return tabList.filter((tabItem) => btnList.includes(tabItem.path));
  }, []);
  useEffect(() => {
    getList();
  }, []);
  return (
    <div className={style.wrap}>
      <Tabs defaultActiveKey={authorTabList?.[0].key || ''}>
        {authorTabList.map((item) => {
          return <Tabs.TabPane tab={item.name} key={item.key} />;
        })}
      </Tabs>
      <div className={style.record}>
        <Icon className={style.recordIcon} name="jifenshuoming" />
        操作记录
      </div>
      <NgTable
        loading={loading}
        dataSource={list}
        columns={tableColumnsFun()}
        setRowKey={(record: IPointsConfigItem) => record.pointsTaskId}
      />
    </div>
  );
};
export default PointsConfig;
