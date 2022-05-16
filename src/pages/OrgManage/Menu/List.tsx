import { Button, message, Tabs } from 'antd';
import { Icon } from 'lester-ui';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { deleteMenu, getMenuList, operateMenu, searchMenu } from 'src/apis/orgManage';
import { NgFormSearch, NgTable } from 'src/components';
import { changeTreeItem, filterTree, treeFindPath } from 'src/utils/base';
import { MenuProps, searchCols, setTableColumns, systemList } from './Config';

import styles from './style.module.less';

const MenuConfigList: React.FC<RouteComponentProps> = ({ history }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [dataSource, setDataSource] = useState<MenuProps[]>();
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
    return arr;
  };
  const getList = async (params?: any) => {
    const res = (await getMenuList({ sysType: currentTab, ...params })) || [];
    setDataSource(res);
  };
  // 搜索菜单
  const onSearch = async (values: any) => {
    console.log(values);
    if (values.menuName === undefined && values.status === undefined) {
      getList();
    } else {
      const res = await searchMenu({ sysType: currentTab, ...values });
      setDataSource(res || []);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const handleOnExpand = async (expanded: boolean, record: MenuProps) => {
    if (expanded) {
      const children = record.children;
      // 判断没有加载children时，请求子列表
      if (!children) {
        const res = await getMenuList({
          parentId: record.menuId,
          sysType: currentTab
        });
        const copyData = deepArr(dataSource!, record.menuId, res);
        // 结构赋值处理，数据动态渲染异常问题
        setDataSource(() => [...copyData]);
      }
    }
  };
  const addMenu = () => {
    history.push('/menu/edit', { sysType: currentTab, writeType: 'add' });
  };

  const addSubMenu = (menuId: string) => {
    console.log(menuId);
    const result = treeFindPath(dataSource!, (node) => node.menuId === menuId);
    console.log(result);
    history.push('/menu/edit', { pathList: result, type: 'add', sysType: currentTab });
  };
  const editMenu = (menuId: string) => {
    const result = treeFindPath(dataSource!, (node) => node.menuId === menuId);
    history.push('/menu/edit', { pathList: result, type: 'edit', sysType: currentTab });
  };

  const deleteItem = async (menuId: string) => {
    const res = await deleteMenu({
      sysType: currentTab,
      menuId
    });
    if (res) {
      message.success('删除成功');
      const filterRes = filterTree(dataSource!, (node: any) => node.menuId !== menuId);
      console.log(filterRes);
      // 结构赋值处理，数据动态渲染异常问题
      setDataSource(() => [...filterRes]);
    }
  };

  const onTapsChange = (value: string) => {
    setCurrentTab(+value);
    getList({ sysType: +value });
  };

  const operateItem = async (menuId: string, status: number) => {
    const res = await operateMenu({
      sysType: currentTab,
      menuId,
      status
    });
    if (res) {
      console.log('=============');
      const operateTree = changeTreeItem(dataSource!, (node) => {
        if (node.menuId === menuId) {
          return (node.enable = status);
        }
      });
      setDataSource(() => [...operateTree]);
      message.success(status === 0 ? '关闭成功' : '启用成功');
    }
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
          columns={setTableColumns({ addSubMenu, editMenu, deleteItem, operateItem })}
          loading={false}
          dataSource={dataSource}
        ></NgTable>
      </div>
    </div>
  );
};

export default MenuConfigList;
