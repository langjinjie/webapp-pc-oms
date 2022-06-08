import { Button } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getDashboardData } from 'src/apis/dashboard';
import { exportFile, throttle, useDocumentTitle } from 'src/utils/base';
import { groupArr } from 'src/utils/tools';
import { DataItem } from './components/DataItem/DataItem';
import { CodeListType, dataCodeList } from './List/config';

import styles from './style.module.less';

const Dashboard: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('数据看板');
  const [dataSource, setDataSource] = useState<CodeListType>([]);
  const getData = async () => {
    const res = await getDashboardData({ queryType: 1 });
    if (res) {
      setDataSource(res);
    }
    console.log(res);
  };
  useEffect(() => {
    setDataSource(dataCodeList);
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
    <div className="container">
      {groupArr(dataSource!, 2)?.map((codes: CodeListType, index) => {
        return (
          <div className={classNames('flex', { [styles.isSingle]: codes.length === 1 })} key={index}>
            {codes?.map((code, index) => (
              <DataItem data={code} onClick={() => navigateToDetail(code.dataCode!)} key={code.dataCode + '' + index} />
            ))}
          </div>
        );
      })}

      <div className="flex justify-center mt40">
        <Button type="primary" shape="round" className={styles.confirmBtn} onClick={() => download()}>
          下载
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
