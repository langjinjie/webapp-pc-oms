import { Tabs } from 'antd';
import { Icon } from 'lester-ui';
import React from 'react';
import { NgFormSearch } from 'src/components';
import { searchCols } from './Config';

import styles from './style.module.less';

const MenuConfigList: React.FC = () => {
  const onSearch = (values: any) => {
    console.log(values);
  };
  return (
    <div className="container">
      <Tabs>
        <Tabs.TabPane tab="M端（年高后管端）" key={1}></Tabs.TabPane>
        <Tabs.TabPane tab="B端（机构管理端）" key={2}></Tabs.TabPane>
        <Tabs.TabPane tab="A端（坐席管理端）" key={3}></Tabs.TabPane>
        <Tabs.TabPane tab="A端（侧边栏）" key={4}></Tabs.TabPane>
        <Tabs.TabPane tab="A端（移动端）" key={5}></Tabs.TabPane>
      </Tabs>
      <div className={styles.content}>
        <div
          className={styles.addBtn}
          onClick={() => {
            console.log('添加菜单');
          }}
        >
          <Icon className={styles.addIcon} name="xinjian" />
          添加菜单
        </div>
        <NgFormSearch searchCols={searchCols} onSearch={onSearch} />
      </div>
    </div>
  );
};

export default MenuConfigList;
