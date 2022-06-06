import { Breadcrumb, Button, Divider } from 'antd';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { TrendChart } from '../components/TrendChart/TrenChart';
import { RouteComponentProps } from 'react-router-dom';

import styles from './style.module.less';
import { getDashboardTeamDetail } from 'src/apis/dashboard';

interface StateProps {
  businessModel: string;
  dayType: number;
  leaderId: string;
  leaderName: string;
}
const DashboardDetail: React.FC<RouteComponentProps<{ id: string }, any, StateProps>> = ({ match, location }) => {
  const [stateProps, setStateProps] = useState<StateProps>();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const getDetail = async () => {
    const res = await getDashboardTeamDetail({
      dayType: location.state.dayType,
      queryType: 1,
      dataCode: match.params.id,
      leaderId: location.state.leaderId || '',
      businessModel: location.state.businessModel
    });
    if (res) {
      setDataSource(res);
    }
    console.log(res);
  };
  useEffect(() => {
    setStateProps(location.state);
    getDetail();
  }, []);
  const navigatorToList = () => {
    console.log('aa');
  };
  console.log(match.params);

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
            <span className="f16 color-text-regular">
              {stateProps?.leaderName ? stateProps.leaderName + '的团队' : '全部团队'}
            </span>
          </div>
          <Button type="primary" shape="round" ghost className={styles.smallTipBtn}>
            {stateProps?.dayType === 2 ? '最近6周' : '最近6月'}
          </Button>
        </div>
        <div className={'ml20'}>
          业务模式：<span className="ml10">{stateProps?.businessModel}</span>
        </div>
        <TrendChart data={dataSource} />
      </div>
    </div>
  );
};

export default DashboardDetail;
