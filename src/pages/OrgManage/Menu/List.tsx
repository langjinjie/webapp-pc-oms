import { Button, Tabs } from 'antd';
import { Icon } from 'lester-ui';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { NgFormSearch, NgTable } from 'src/components';
import { treeFindPath } from 'src/utils/base';
import { MenuProps, searchCols, setTableColumns, systemList } from './Config';

import styles from './style.module.less';

const MenuConfigList: React.FC<RouteComponentProps> = ({ history }) => {
  const onSearch = (values: any) => {
    console.log(values);
  };
  const [currentTab, setCurrentTab] = useState(1);
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

  useEffect(() => {
    console.log('1');
  }, []);
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
  const addMenu = () => {
    history.push('/menu/edit', { sysType: currentTab });
  };

  const addSubMenu = (menuId: string) => {
    console.log(menuId);
    const result = treeFindPath(dataSource, (node) => node.menuId === menuId);
    console.log(result);
    history.push('/menu/edit', { pathList: result, type: 'add', sysType: currentTab });
  };
  const editMenu = (menuId: string) => {
    console.log(menuId);
    const result = treeFindPath(dataSource, (node) => node.menuId === menuId);
    console.log(result);
    history.push('/menu/edit', { pathList: result, type: 'edit', sysType: currentTab });
  };
  const deleteItem = (menuId: string) => {
    console.log(menuId);
  };

  const onTapsChange = (value: string) => {
    setCurrentTab(+value);
  };
  return (
    <div className="container">
      <Tabs onChange={onTapsChange} defaultActiveKey={currentTab + ''}>
        {systemList.map((system) => (
          <Tabs.TabPane tab={system.label} key={system.value} />
        ))}
      </Tabs>
      <div className={styles.content}>
        <Button
          type="primary"
          shape="round"
          className={'addBtn'}
          onClick={() => {
            addMenu();
            console.log('添加菜单');
          }}
        >
          <Icon className={styles.addIcon} name="xinjian" />
          添加菜单
        </Button>
        <NgFormSearch searchCols={searchCols} onSearch={onSearch} className="mt20" />
        <NgTable
          className="mt30"
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
          columns={setTableColumns({ addSubMenu, editMenu, deleteItem })}
          loading={false}
          dataSource={dataSource}
        ></NgTable>
      </div>
    </div>
  );
};

export default MenuConfigList;
