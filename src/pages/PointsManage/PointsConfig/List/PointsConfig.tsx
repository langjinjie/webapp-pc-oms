import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Context } from 'src/store';
import { Tabs } from 'antd';
import { Icon } from 'tenacity-ui';
import { NgTable, NoPermission } from 'src/components';
import { tableColumnsFun, IPointsConfigItem } from './Config';
import { useHistory } from 'react-router-dom';
import { requestGetPointsConfigList } from 'src/apis/pointsMall';
import { useDidRecover } from 'react-router-cache-route';
import qs from 'qs';
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
  const getList = async (taskType: string) => {
    setLoading(true);
    const res = await requestGetPointsConfigList({ taskType });
    if (res) {
      const list = res.reduce((prev: any[], item: any) => {
        prev.push(item);
        if (item.modifyLog) {
          prev.push(item.modifyLog);
        }
        return prev;
      }, []);
      setList(list);
    }
    setLoading(false);
  };

  // tab切换
  const tabOnChange = (key: string) => {
    setTabKey(key);
    getList(key);
  };

  // 查看操作记录
  const viewRecord = () => {
    history.push('/pointsConfig/record');
  };
  useDidRecover(() => {
    if (qs.parse(window.location.search, { ignoreQueryPrefix: true }).refresh === 'true') {
      getList(tabKey);
    }
  }, []);
  useEffect(() => {
    getList(authorTabList[0]?.key);
    setTabKey(authorTabList[0]?.key);
  }, []);
  return authorTabList.length === 0
    ? (
    <NoPermission />
      )
    : (
    <div className={style.wrap}>
      <Tabs defaultActiveKey={authorTabList?.[0].key || ''} onChange={tabOnChange}>
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
        columns={tableColumnsFun(() => getList(tabKey))}
        setRowKey={(record: IPointsConfigItem) => record.pointsTaskId + '-' + record.logId}
        rowClassName={(record: IPointsConfigItem) => (record.logId ? style.sign : '')}
      />
    </div>
      );
};
export default PointsConfig;
