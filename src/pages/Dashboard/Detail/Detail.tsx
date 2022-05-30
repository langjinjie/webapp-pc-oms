import { Breadcrumb, Button, Divider } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { TrendChart } from '../components/TrendChart/TrenChart';

import styles from './style.module.less';

const DashboardDetail: React.FC = () => {
  const navigatorToList = () => {
    console.log('aa');
  };
  return (
    <div className="container">
      <div className={'breadcrumbWrap'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>标签配置</Breadcrumb.Item>
          <Breadcrumb.Item>保存与推送记录</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className={styles.contentWrap}>
        <div className={classNames(styles.header, 'flex justify-between align-center ph20')}>
          <div className="flex align-center">
            <h3 className="f18 bold">日均客户信息调用数</h3>
            <Divider
              type="vertical"
              style={{
                borderColor: '#979797',
                margin: '0 30px'
              }}
            />
            <span className="f16 color-text-regular">张成的团队</span>
          </div>
          <Button type="primary" shape="round" ghost className={styles.smallTipBtn}>
            最近6周
          </Button>
        </div>
        <div className={'ml20'}>
          业务模式：<span className="ml10">自续</span>
        </div>
        <TrendChart />
      </div>
    </div>
  );
};

export default DashboardDetail;
