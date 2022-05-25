import { Button } from 'antd';
import React from 'react';
import { DataItem } from './components/DataItem/DataItem';

import styles from './style.module.less';

const Dashboard: React.FC = () => {
  return (
    <div className="container">
      <div className="flex">
        <DataItem />
        <DataItem />
      </div>

      <div className="flex justify-center mt40">
        <Button type="primary" shape="round" className={styles.confirmBtn}>
          下载
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
