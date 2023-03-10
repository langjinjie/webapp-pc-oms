import { Divider, Input, Pagination, Table, Tabs } from 'antd';
import React from 'react';
import { BreadCrumbs } from 'src/components';
import style from './style.module.less';

const MessageDetail: React.FC = () => {
  return (
    <div className="container">
      <BreadCrumbs
        navList={[
          {
            name: '群发停用'
          },
          { name: '群发停用' }
        ]}
      />

      <div className="mt40">
        <h3>
          <span className="f18">群发编码</span> <Divider type="vertical" />{' '}
          <span className="color-text-secondary">QFBM2023020101000001</span>{' '}
        </h3>
        <Divider></Divider>

        <div className="">
          <Tabs defaultActiveKey="1" className={style.tabsWrap}>
            <Tabs.TabPane tab="客户经理" key="1">
              <div className="mb20">
                客户经理：<Input className="width160"></Input>
              </div>
              <Table
                dataSource={[{}]}
                columns={[
                  { title: '客户经理企微', key: 'key1', dataIndex: 'key1' },
                  { title: '客户经理', key: 'key2', dataIndex: 'key3' },
                  { title: '组织架构', key: 'key3', dataIndex: 'key3' }
                ]}
              ></Table>
              <Pagination simple></Pagination>
            </Tabs.TabPane>
            <Tabs.TabPane tab="客户" key="2">
              <div className="mb20">
                客户：<Input className="width160"></Input>
              </div>
              <Table
                dataSource={[{}]}
                columns={[
                  { title: '外部联系人ID', key: 'key1', dataIndex: 'key1' },
                  { title: '客户昵称', key: 'key2', dataIndex: 'key3' }
                ]}
              ></Table>
            </Tabs.TabPane>
          </Tabs>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;
