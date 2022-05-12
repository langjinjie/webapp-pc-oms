import { Tabs } from 'antd';
import { Icon } from 'lester-ui';
import React, { useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { MenuProps, searchCols, setTableColumns } from './Config';

import styles from './style.module.less';

const MenuConfigList: React.FC = () => {
  const onSearch = (values: any) => {
    console.log(values);
  };
  const [dataSource, setDataSource] = useState<MenuProps[]>([
    {
      menuName: '主页',
      sortId: 60,
      path: '/index',
      menuIcon: 'icon_daohang_28_jigouguanli',
      isLeaf: 0,
      menuId: '122',
      level: 1,
      enable: 1,
      fullMenuId: '12',
      menuType: 0
    },
    {
      menuName: '运营配置',
      sortId: 32,
      path: '/product',
      isLeaf: 0,
      menuId: '211',
      level: 1,
      enable: 1,
      fullMenuId: '12',
      menuType: 0
    }
  ]);
  const deepArr = (arr: MenuProps[], menuId: string, children: MenuProps[]) => {
    arr.forEach((item) => {
      if (item.menuId === menuId) {
        return (item.children = children);
      } else {
        if (item.children) {
          deepArr(item.children, menuId, children);
        }
      }
    });
    console.log(arr);
    return arr;
  };
  const handleOnExpand = (expanded: boolean, record: any) => {
    if (expanded) {
      const children = record.children;
      console.log(children);
      if (!children) {
        const copyData = deepArr(dataSource, record.menuId, [
          {
            menuName: '运营配置-1',
            sortId: 32,
            path: '/product',
            isLeaf: 0,
            menuId: Math.random() * 10000 + '',
            level: 1,
            enable: 1,
            fullMenuId: '12',
            menuType: 0
          },
          {
            menuName: '运营配置-2',
            sortId: 32,
            path: '/product',
            isLeaf: 1,
            menuId: Math.random() * 10000 + '',
            level: 1,
            enable: 1,
            fullMenuId: '12',
            menuType: 0
          }
        ]);
        setDataSource(copyData);
      }

      console.log('点击了展开按钮', expanded, children);
    }
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
        <NgTable
          rowKey={'menuId'}
          expandable={{
            fixed: 'left',
            onExpand: (expanded, record) => handleOnExpand(expanded, record),
            expandIcon: ({ expanded, onExpand, record }) => {
              return (
                <>
                  {record.isLeaf === 0
                    ? (
                        expanded
                          ? (
                      <Icon
                        className={styles.iconExpand}
                        name="icon_common_16_Line_Down"
                        onClick={(e: any) => onExpand(record, e)}
                      />
                            )
                          : (
                      <Icon
                        className={styles.iconExpand}
                        name="iconfontjiantou2"
                        onClick={(e: any) => onExpand(record, e)}
                      />
                            )
                      )
                    : null}
                </>
              );
            }
          }}
          columns={setTableColumns()}
          loading={false}
          dataSource={dataSource}
        ></NgTable>
      </div>
    </div>
  );
};

export default MenuConfigList;
