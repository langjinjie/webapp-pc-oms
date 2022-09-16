import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Context } from 'src/store';
import { Tabs } from 'antd';
import { Icon } from 'tenacity-ui';
import { NgTable } from 'src/components';
import { tableColumnsFun, IPointsConfigItem } from './Config';
import { useHistory } from 'react-router-dom';
import { requestGetPointsConfigList } from 'src/apis/pointsMall';
import style from './style.module.less';

const tabList = [
  { path: '/clockPoints', name: '打卡任务', key: '1' },
  { path: '/rewardPoints', name: '奖励任务', key: '2' }
];

const PointsConfig: React.FC = () => {
  const { btnList } = useContext(Context);
  const [list, setList] = useState<IPointsConfigItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabKey, setTabKey] = useState('');

  const history = useHistory();

  const authorTabList = useMemo(() => {
    return tabList.filter((tabItem) => btnList.includes(tabItem.path));
  }, []);

  // 获取列表
  const getList = async () => {
    setLoading(true);
    const res = await requestGetPointsConfigList({ taskType: tabKey || authorTabList[0].key });
    console.log('res', res);
    if (res) {
      const list = res.map((mapItem: any) => {
        if (mapItem.modifyLog) {
          return { ...mapItem, children: [mapItem.modifyLog] };
        } else {
          return { ...mapItem };
        }
      });
      console.log('list', list);
      setList(list);
    }
    setLoading(false);
  };

  // 查看操作记录
  const viewRecord = () => {
    history.push('/pointsConfig/record');
  };
  useEffect(() => {
    getList();
    setTabKey(authorTabList[0].key);
  }, []);
  return (
    <div className={style.wrap}>
      <Tabs defaultActiveKey={authorTabList?.[0].key || ''} onChange={(key) => setTabKey(key)}>
        {authorTabList.map((item) => {
          return <Tabs.TabPane tab={item.name} key={item.key} />;
        })}
      </Tabs>
      <div className={style.record} onClick={viewRecord}>
        <Icon className={style.recordIcon} name="jifenshuoming" />
        操作记录
      </div>
      <NgTable
        loading={loading}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        columns={tableColumnsFun()}
        setRowKey={(record: IPointsConfigItem) => record.pointsTaskId + '-' + record.logId}
      />
    </div>
  );
};
export default PointsConfig;
