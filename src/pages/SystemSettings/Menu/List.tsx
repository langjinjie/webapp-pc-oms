import { Button, message, Tabs } from 'antd';
import Icon from 'src/components/SvgIcon/SvgIcon';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { deleteMenu, getMenuList, operateMenu, searchMenu } from 'src/apis/orgManage';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import { changeTreeItem, filterTree, listToTree, treeFindPath, URLSearchParams } from 'src/utils/base';
import { MenuProps, searchCols, setTableColumns, systemList } from './Config';
import { useDidRecover } from 'react-router-cache-route';

import styles from './style.module.less';

const MenuConfigList: React.FC<RouteComponentProps> = ({ history }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [dataSource, setDataSource] = useState<MenuProps[]>();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const deepArr = (arr: MenuProps[], menuId: string, children: MenuProps[]) => {
    if (arr.length === 0) return children;
    arr.forEach((item) => {
      if (item.menuId === menuId) {
        item.isLeaf = 0;
        item.children = children;
        return item;
      } else {
        if (item.children) {
          deepArr(item.children, menuId, children);
        }
      }
    });
    return arr;
  };
  const getList = async (params?: any) => {
    setExpandedRowKeys([]);
    const res = (await getMenuList({ sysType: currentTab, ...params })) || [];
    setDataSource(res);
  };
  // 搜索菜单
  const onSearch = async (values: any) => {
    if ((values.menuName === undefined || values.menuName === '') && values.status === undefined) {
      console.log('reset');

      getList();
    } else {
      const res = await searchMenu({ sysType: currentTab, ...values });
      console.log(res);

      const tree = listToTree(res, 'parentId', 'menuId');
      console.log(tree);

      setDataSource(tree);
    }
  };
  useDidRecover(async () => {
    const { menuId } = URLSearchParams(window.location.search) as { menuId: string };
    console.log(menuId);
    if (menuId) {
      const res = await getMenuList({
        parentId: menuId,
        sysType: currentTab
      });
      // 结构赋值处理，数据动态渲染异常问题
      if (menuId === '0') {
        setDataSource(() => [...res]);
      } else {
        const copyData = deepArr(dataSource!, menuId, res);
        setDataSource(() => [...copyData]);
      }
    }
  }, [dataSource]);
  useEffect(() => {
    getList();
  }, []);

  const handleOnExpand = async (expanded: boolean, record: MenuProps) => {
    if (expanded) {
      const copyArr = [...expandedRowKeys];
      copyArr.push(record.menuId);
      setExpandedRowKeys(copyArr);
    } else {
      const copyArr = [...expandedRowKeys];
      const res = copyArr.filter((item) => item !== record.menuId);
      setExpandedRowKeys(res);
    }
    if (expanded) {
      const children = record.children;
      // 判断没有加载children时，请求子列表
      if (!children || children.length === 0) {
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
    const result = treeFindPath(dataSource!, (node) => node.menuId === menuId);
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
        <AuthBtn path="/addMenu">
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
        </AuthBtn>
        <AuthBtn path="/query">
          <NgFormSearch searchCols={searchCols} onSearch={onSearch} className="mt20" />
        </AuthBtn>
        <NgTable
          className="mt30"
          rowKey={(record) => record.menuId}
          expandable={{
            // fixed: 'left',
            expandedRowKeys: expandedRowKeys,
            indentSize: 30,
            expandRowByClick: false, // 点击行可以展开
            expandIconColumnIndex: 1, // 设置安装放置在第二列
            showExpandColumn: true,
            onExpand: (expanded, record) => handleOnExpand(expanded, record),
            expandIcon: ({ expanded, onExpand, record }) => {
              return (
                <>
                  {record.isLeaf === 0
                    ? (
                        expanded
                          ? (
                      <Icon
                        key={record.menuId + 'down'}
                        className={styles.iconExpand}
                        name="icon_common_16_Line_Down"
                        onClick={(e: any) => onExpand(record, e)}
                      />
                            )
                          : (
                      <Icon
                        key={record.menuId + 'up'}
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
