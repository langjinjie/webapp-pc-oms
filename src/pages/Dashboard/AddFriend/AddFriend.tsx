import classNames from 'classnames';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgTable } from 'src/components';
import { tableColumns } from './config';
import { Button, Divider, Radio, Select, Tabs } from 'antd';
import styles from '../style.module.less';

const AddFriend: React.FC<RouteComponentProps> = ({ history }) => {
  const toDetailPage = (record: any) => {
    console.log(record);
    history.push('/dashboard/AddFriend/detail');
  };
  const handleModelChange = () => {
    console.log('change');
  };
  const onTabsChange = () => {
    console.log('onTabsChange');
  };
  return (
    <div className={classNames(styles.addFriend)}>
      <Tabs defaultActiveKey="1" onChange={onTabsChange}>
        <Tabs.TabPane tab="客户信息" key={'1'}></Tabs.TabPane>
        <Tabs.TabPane tab="客户雷达" key={'2'}></Tabs.TabPane>
      </Tabs>
      <div className="container">
        <div className={classNames(styles.contentWrap, 'pb20')}>
          <div className={classNames(styles.header, 'flex justify-between align-center ml20 mr20')}>
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
            <Radio.Group defaultValue="a" size="middle">
              <Radio.Button value="a">最近6周</Radio.Button>
              <Radio.Button value="b">最近6个月</Radio.Button>
            </Radio.Group>
          </div>
          <div className={'ml20 mt20 mb20'}>
            业务模式：{' '}
            <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleModelChange}>
              <Select.Option value="jack">Jack</Select.Option>
              <Select.Option value="lucy">Lucy</Select.Option>
            </Select>
          </div>
          <div className="ph20 mb20">
            <NgTable
              rowClassName={(record, index) => {
                if (index === 0) {
                  return 'trHighlight';
                }
                return '';
              }}
              columns={tableColumns({ toDetailPage })}
              dataSource={[
                {
                  taskName1: '测试',
                  id: 1,
                  taskName2: '广东'
                },
                {
                  taskName1: '开发',
                  taskName2: '广东',
                  id: 2
                },
                {
                  taskName1: '产品',
                  taskName2: '广东',
                  id: 3
                }
              ]}
              rowKey="id"
              loading={false}
            ></NgTable>
          </div>

          <div className="flex justify-center mt40">
            <Button type="primary" shape="round" className={styles.confirmBtn}>
              下载
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
