import { Button, Spin, Tabs } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getDashboardData } from 'src/apis/dashboard';
import { AuthBtn } from 'src/components';
import { exportFile, throttle, useDocumentTitle } from 'src/utils/base';
import { groupArr } from 'src/utils/tools';
import { DataItem } from './components/DataItem/DataItem';
import { CodeListType } from './List/config';

import styles from './style.module.less';

const Dashboard: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('数据看板');
  const [dataSource, setDataSource] = useState<CodeListType>([]);
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    const res = await getDashboardData({ queryType: 1 });
    setLoading(false);
    if (res) {
      setDataSource(res);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const navigateToDetail = (path: string) => {
    history.push(`dashboardList/${path}`);
  };

  const download = throttle(async () => {
    const { data } = await getDashboardData(
      { queryType: 2 },
      {
        responseType: 'blob'
      }
    );
    exportFile(data, '整体看板');
  }, 500);
  return (
    <div className={styles.addFriend}>
      <Tabs defaultActiveKey={'整体看板'}>
        <Tabs.TabPane tab={'整体看板'} key="整体看板" />
      </Tabs>
      <Spin spinning={loading} tip="加载中...">
        <div className="container">
          {groupArr(dataSource!, 2)?.map((codes: CodeListType, index) => {
            return (
              <div className={classNames('flex', { [styles.isSingle]: codes.length === 1 })} key={index}>
                {codes?.map((code, index) => (
                  <DataItem
                    data={code}
                    onClick={() => navigateToDetail(code.dataCode!)}
                    key={code.dataCode + '' + index}
                  />
                ))}
              </div>
            );
          })}
          <div className={styles.desc}>从机构的坐席账号激活日期开始计算，截止昨日的累计数据</div>

          <div className="flex justify-center mt40">
            {dataSource.length > 0 && (
              <AuthBtn path="/export">
                <Button type="primary" shape="round" className={styles.confirmBtn} onClick={() => download()}>
                  下载
                </Button>
              </AuthBtn>
            )}
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default Dashboard;
