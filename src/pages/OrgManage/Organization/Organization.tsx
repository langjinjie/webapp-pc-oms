/**
 * @name Organization 头铁
 * @author Lester
 * @date 2021-12-10 10:36
 */
import React, { useEffect, useState, useContext, useRef, MutableRefObject } from 'react';
import { Input, Tree, TreeSelect, message } from 'antd';
import classNames from 'classnames';
import { setTitle, copy } from 'tenacity-tools';
import { Icon, Modal, Empty, AuthBtn } from 'src/components';
import {
  queryDepartmentList,
  searchStaffAndDepart,
  saveDepartment,
  operateDepartment,
  exportOrganization,
  transferDepartment
} from 'src/apis/organization';
import { exportFile } from 'src/utils/base';
import { Context } from 'src/store';
import { IOrganizationItem } from 'src/utils/interface';

import StaffList from './StaffList/StaffList';
import StaffDetail from './StaffDetail/StaffDetail';
import SetLeader from './components/SetLeader';
import EditDepart from './components/EditDepart';
import style from './style.module.less';

const { Search } = Input;

interface StaffItem {
  staffId?: string;
  staffName?: string;
}

interface OrganizationItem {
  deptId?: string;
  deptName?: string;
  deptType?: number;
  dType?: number;
  effCount?: number;
  isLeaf?: boolean;
  index?: number;
  totalCount?: number;
  leaderId?: string;
  leaderName?: string;
  total?: number;
  path?: string[];
  disabled?: boolean;
  children?: OrganizationItem[];
}

interface PositionValue {
  left: number;
  top: number;
}

type Key = string | number;

const Organization: React.FC = () => {
  const { userInfo } = useContext(Context);
  const [organization, setOrganization] = useState<IOrganizationItem[]>([]);
  const [expandIds, setExpandIds] = useState<Key[]>([]);
  const [position, setPosition] = useState<PositionValue>({ left: 0, top: 0 });
  const [showDepart, setShowDepart] = useState<boolean>(false);
  const [departmentVisible, setDepartmentVisible] = useState<boolean>(false);
  const [isAddDepart, setIsAddDepart] = useState<boolean>(true);
  const [currentNode, setCurrentNode] = useState<IOrganizationItem & StaffItem>({});
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [searchList, setSearchList] = useState<IOrganizationItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [displayType, setDisplayType] = useState<number>(0);
  const [leaderVisible, setLeaderVisible] = useState<boolean>(false);
  const [transferVisible, setTransferVisible] = useState<boolean>(false);
  const [transferId, setTransferId] = useState<string>('');
  const [parentDepartName, setParentDepartName] = useState<string>('');

  const staffListRef: MutableRefObject<any> = useRef(null);

  /**
   * 处理/计算左边位置
   * @param x
   * @param y
   */
  const handlePosition = (x: number, y: number) => {
    let top = y + 30;
    if (window.innerHeight - y - 35 < 292) {
      top = y - 30 - 296;
    }
    setPosition({
      left: 445,
      top
    });
  };

  /**
   * 上下移动
   * @param data
   * @param key
   * @param type
   */
  const moveData = (data: IOrganizationItem[], key: string, type: string): IOrganizationItem[] => {
    const copyData = data.slice(0);
    const isNewStaffDepart = Number(copyData[0].deptId) === -1;
    let newStaffDepart: IOrganizationItem[] = [];
    if (isNewStaffDepart) {
      newStaffDepart = copyData.splice(0, 1);
    }
    const index: number = copyData.findIndex((item) => item.deptId === key);
    if (index > -1) {
      const temp = copyData[index];
      const nextIndex = type === 'up' ? index - 1 : index + 1;
      copyData[index] = {
        ...copyData[nextIndex],
        index
      };
      copyData[nextIndex] = {
        ...temp,
        index: nextIndex
      };
      setCurrentNode({
        ...temp,
        index: nextIndex
      });
      return newStaffDepart.concat(copyData);
    } else {
      return newStaffDepart.concat(
        copyData.map((item) => {
          if (item.children && item.children.length > 0) {
            return {
              ...item,
              children: moveData(item.children, key, type)
            };
          }
          return item;
        })
      );
    }
  };

  /**
   * 格式化数据源
   * @param data
   * @param path
   */
  const formatData = (data: IOrganizationItem[], path?: string[]): IOrganizationItem[] => {
    if (data.length === 0) {
      return [];
    }
    const isNewStaffDepart = Number(data[0].deptId) === -1;
    return data.map((item, index) => ({
      ...item,
      index: isNewStaffDepart ? index - 1 : index,
      total: isNewStaffDepart ? data.length - 1 : data.length,
      path: path || item.path || [],
      children: formatData(item.children || [], [...(path || []), item.deptId!])
    }));
  };

  /**
   * 更新数据
   * @param list
   * @param key
   * @param children
   */
  const updateData = (list: IOrganizationItem[], key: string, children: IOrganizationItem[]): IOrganizationItem[] => {
    return list.map((item) => {
      if (item.deptId === key) {
        return {
          ...item,
          children: formatData((item.children || []).concat(children), [...(item.path || []), item.deptId])
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateData(item.children, key, children)
        };
      }
      return item;
    });
  };

  /**
   * 异步加载数据
   * @param key
   * @param children
   */
  const onLoadData = async ({ key, children }: any): Promise<void> => {
    if (!children || children?.length === 0) {
      const res: any = await queryDepartmentList({ parentId: key });
      if (res) {
        setOrganization((data) => updateData(data, key, res));
      }
    }
  };

  /**
   * 更新节点信息
   * @param data
   * @param node
   */
  const updateNodeInfo = (data: IOrganizationItem[], node: IOrganizationItem): IOrganizationItem[] => {
    return data.map((item) => {
      if (item.deptId === node.deptId) {
        return node;
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateNodeInfo(item.children, node)
        };
      }
      return item;
    });
  };

  /**
   * 获取组织架构初始数据
   */
  const initCorpOrgData = async () => {
    const res: any = await queryDepartmentList({});
    if (res && res.length > 0) {
      setOrganization(formatData(res));
    }
  };

  /**
   * 添加节点-新增部门
   * @param data
   * @param node
   */
  const addData = (data: IOrganizationItem[], node: IOrganizationItem): IOrganizationItem[] => {
    return data.map((item) => {
      if (item.deptId === currentNode.deptId) {
        const parentNode: IOrganizationItem = {
          ...currentNode,
          isLeaf: false,
          children: formatData([...(item.children || []), node], [...(currentNode.path || []), currentNode.deptId!])
        };
        return parentNode;
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: addData(item.children, node)
        };
      }
      return item;
    });
  };

  /**
   * 移动部门
   * @param type
   */
  const onMoveDepartment = async (type: string) => {
    const param = {
      deptId: currentNode.deptId,
      opstatus: type === 'up' ? 1 : 2
    };
    const res: any = await operateDepartment(param);
    if (res) {
      message.success(`${type === 'up' ? '上' : '下'}移成功`);
      setOrganization(moveData(organization, currentNode.deptId!, type));
    }
  };

  /**
   * 保存部门
   */
  const saveDepart = async (values: any) => {
    console.log(values);
    const param: any = {
      ...values,
      parentId: isAddDepart ? currentNode.deptId : '',
      deptId: isAddDepart ? '' : currentNode.deptId
    };
    const res: any = await saveDepartment(param);
    if (res) {
      setDepartmentVisible(false);
      if (isAddDepart) {
        message.success('添加成功');
        if ((currentNode.isLeaf || (currentNode.children || []).length > 0) && typeof res === 'number') {
          const newDepart: IOrganizationItem = {
            deptId: String(res),
            ...values,
            deptType: 0,
            effCount: 0,
            isLeaf: true
          };
          setOrganization(addData(organization, newDepart));
        }
      } else {
        setOrganization(
          updateNodeInfo(organization, {
            ...currentNode,
            ...values
          })
        );
        message.success('修改成功');
      }
    }
  };

  /**
   * 删除节点
   * @param data
   */
  const deleteData = (data: IOrganizationItem[]): IOrganizationItem[] => {
    return data.map((item) => {
      const index: number = (item.children || []).findIndex((item) => item.deptId === currentNode.deptId);
      if (index > -1) {
        const resChildren = formatData((item.children || []).filter((item) => item.deptId !== currentNode.deptId));
        return {
          ...item,
          children: resChildren,
          isLeaf: resChildren.length === 0
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: deleteData(item.children)
        };
      }
      return item;
    });
  };

  /**
   * 删除部门
   */
  const delDepartment = async () => {
    const res: any = await operateDepartment({ deptId: currentNode.deptId, opstatus: 9 });
    if (res) {
      message.success('删除成功');
      setShowDepart(false);
      setOrganization(deleteData(organization));
    }
  };

  /**
   * 搜索
   * @param val
   */
  const onSearch = async (val: string) => {
    if (val) {
      const res: any = await searchStaffAndDepart({ keyWords: val, isDeleted: false });
      if (res) {
        const departList = res.deptList || [];
        const staffList = res.staffList || [];
        setSearchList(departList);
        setStaffList(staffList);
        if (staffList.length > 0) {
          setCurrentNode(staffList[0]);
        } else if (departList.length > 0) {
          setCurrentNode(departList[0]);
        }
      }
      setDisplayType(1);
    } else {
      setDisplayType(0);
      setCurrentNode({});
    }
  };

  /**
   * 隐藏部门操作浮窗
   */
  const hideDepart = () => setShowDepart(false);

  /**
   * 导出组织架构
   */
  const onExport = async () => {
    const res: any = await exportOrganization();
    if (res) {
      exportFile(res.data, `${currentNode.deptName}组织架构`);
    }
  };

  /* const onDrop = (info: any) => {
    console.log(info, 'onDrop');
    const dropKey = info.node.deptId;
    const dragKey = info.dragNode.deptId;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: OrganizationItem[], key: string, callback: Function) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].deptId === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children || [], key, callback);
        }
      }
    };
    const data = [...organization];

    // Find dragObject
    let dragObj: OrganizationItem;
    loop(data, dragKey, (item: OrganizationItem, index: number, arr: OrganizationItem[]) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item: OrganizationItem) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item: OrganizationItem) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: OrganizationItem[];
      let i: number;
      loop(data, dropKey, (item: OrganizationItem, index: number, arr: OrganizationItem[]) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setOrganization(data);
  }; */

  /**
   * 获取当前部门父部门名称
   * @param data
   */
  const getParentDepartName = (data: OrganizationItem[]) => {
    data.forEach((item) => {
      const index: number = (item.children || []).findIndex((item) => item.deptId === currentNode.deptId);
      if (index > -1) {
        setParentDepartName(item.deptName!);
      } else if (item.children && item.children.length > 0) {
        getParentDepartName(item.children);
      }
    });
  };

  /**
   * 格式化禁用节点
   * @param data
   */
  const formatDisabled = (data: OrganizationItem[]): OrganizationItem[] => {
    if (data.length === 0) {
      return [];
    }
    return data.map((item) => {
      const path = currentNode.path || [];
      return {
        ...item,
        disabled:
          (item.path || []).includes(currentNode.deptId!) ||
          item.deptId === currentNode.deptId ||
          path[path.length - 1] === item.deptId ||
          item.deptType === 2,
        children: formatDisabled(item.children || [])
      };
    });
  };

  /**
   * 转移部门
   * @param data
   */
  const transferData = (data: OrganizationItem[]): OrganizationItem[] => {
    return data.map((item) => {
      if (item.deptId === transferId) {
        /* const isRoot = ((item.children || [])[0] || {}).deptType === 2;
        const children = item.children || [];
        if (isRoot) {
          children.splice(1, 0, currentNode);
        } else {
          children.push(currentNode);
        } */
        return {
          ...item,
          isLeaf: false,
          children: formatData([...(item.children || []), currentNode], [...(item.path || []), transferId])
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: transferData(item.children)
        };
      }
      return item;
    });
  };

  /**
   * 确定转移部门
   */
  const transferDepart = async () => {
    const res: any = await transferDepartment({ deptId: currentNode.deptId, newParentId: transferId });
    if (res) {
      message.success('转移部门成功！');
      setOrganization(transferData(deleteData(organization)));
      setTransferVisible(false);
      setShowDepart(false);
    }
  };
  useEffect(() => {
    !transferVisible && setTransferId('');
  }, [transferVisible]);

  useEffect(() => {
    getParentDepartName(organization);
  }, [currentNode]);

  useEffect(() => {
    setTitle('组织架构管理');
    initCorpOrgData();

    window.addEventListener('click', hideDepart);

    return () => {
      window.removeEventListener('click', hideDepart);
    };
  }, []);

  return (
    <div className={style.wrap}>
      <section className={style.left}>
        <AuthBtn path="/query">
          <div className={style.inputWrap}>
            <Search
              placeholder="搜索成员、部门"
              onSearch={onSearch}
              enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
            />
          </div>
        </AuthBtn>
        <div
          style={{ display: displayType === 0 ? 'block' : 'none' }}
          className={classNames(style.treeContainer, 'scroll-strip')}
        >
          <Tree
            className={style.treeWrap}
            fieldNames={{ title: 'deptName', key: 'deptId' }}
            blockNode
            expandedKeys={expandIds}
            onExpand={(keys) => setExpandIds(keys)}
            treeData={organization}
            loadData={onLoadData}
            titleRender={(node) => (
              <div className={style.nodeItem}>
                {node.deptName}({node.deptType === 1 ? `${node.effCount}/${node.totalCount}` : node.effCount})
                {Number(node.deptId) !== -1 && (
                  <AuthBtn path="/operate">
                    <Icon
                      className={style.dotIcon}
                      name="diandian"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePosition(e.clientX, e.clientY);
                        setShowDepart(true);
                        setCurrentNode(node);
                      }}
                    />
                  </AuthBtn>
                )}
              </div>
            )}
            selectedKeys={[currentNode.deptId || '']}
            onSelect={(selectedKeys, { selectedNodes }) => {
              if (selectedNodes.length > 0) {
                setCurrentNode(selectedNodes[0]);
              }
            }}
            /* draggable={(node: any) => node.deptType === 0}
            onDragEnter={(info) => {
              console.log(info, 'onDragEnter');
            }}
            onDrop={onDrop} */
          />
        </div>
        <ul style={{ display: displayType === 1 ? 'block' : 'none' }} className={style.searchList}>
          {searchList.length === 0 && staffList.length === 0 && <Empty />}
          {staffList.map((item: StaffItem) => (
            <li
              key={item.staffId}
              className={classNames(style.searchItem, {
                [style.active]: item.staffId === currentNode.staffId
              })}
              onClick={() => setCurrentNode(item)}
            >
              {item.staffName}
            </li>
          ))}
          {searchList.map((item: IOrganizationItem) => (
            <li
              key={item.deptId}
              className={classNames(style.searchItem, {
                [style.active]: item.deptId === currentNode.deptId
              })}
              onClick={() => setCurrentNode(item)}
            >
              {item.deptName}
            </li>
          ))}
        </ul>
      </section>
      <div className={style.right}>
        {currentNode.staffId
          ? (
          <StaffDetail staffId={currentNode.staffId} />
            )
          : (
          <StaffList
            staffListRef={staffListRef}
            department={currentNode as IOrganizationItem}
            deptType={currentNode.deptType!}
          />
            )}
      </div>
      <ul
        style={{ ...position, transform: `scale(${showDepart ? 1 : 0})` }}
        className={style.departmentOperation}
        onClick={(e) => e.stopPropagation()}
      >
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: currentNode.deptType !== 1
          })}
          onClick={() => {
            if (currentNode.deptType === 1) {
              onExport();
            }
          }}
        >
          导出
        </li>
        <li
          className={style.operationItem}
          title={userInfo.depPrefix + String(currentNode.deptId)}
          onClick={() => {
            copy(userInfo.depPrefix + currentNode.deptId!, false);
            message.success('部门id已复制');
          }}
        >
          部门ID：{userInfo.depPrefix + currentNode.deptId}
        </li>
        <li
          className={style.operationItem}
          onClick={() => {
            setDepartmentVisible(true);
            setIsAddDepart(true);
          }}
        >
          添加子部门
        </li>
        <li
          className={style.operationItem}
          onClick={() => {
            setDepartmentVisible(true);
            setIsAddDepart(false);
          }}
        >
          修改部门
        </li>
        <li className={style.operationItem} onClick={() => setLeaderVisible(true)}>
          设置上级
        </li>
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: currentNode.deptType !== 0
          })}
          onClick={() => {
            if (currentNode.deptType === 0) {
              setTransferVisible(true);
              console.log(currentNode);
            }
          }}
        >
          转移团队
        </li>
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: !currentNode.isLeaf || currentNode.deptType !== 0
          })}
          onClick={() => currentNode.isLeaf && currentNode.deptType === 0 && setDeleteVisible(true)}
        >
          删除
        </li>
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: currentNode.index === 0
          })}
          onClick={() => currentNode.index! > 0 && onMoveDepartment('up')}
        >
          上移
        </li>
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: currentNode.index! === (currentNode.total || 0) - 1
          })}
          onClick={() => currentNode.index! < (currentNode.total || 0) - 1 && onMoveDepartment('down')}
        >
          下移
        </li>
      </ul>
      <div onClick={(e) => e.stopPropagation()}>
        <EditDepart
          deptName={currentNode.deptName}
          dType={currentNode.dType}
          visible={departmentVisible}
          onClose={() => setDepartmentVisible(false)}
          isAddDepart={isAddDepart}
          onOk={saveDepart}
        />
        <Modal
          title="提示"
          visible={deleteVisible}
          onClose={() => setDeleteVisible(false)}
          onOk={() => {
            setDeleteVisible(false);
            delDepartment();
          }}
        >
          <div className={style.textCenter}>确定删除？</div>
        </Modal>
        <SetLeader
          deptId={currentNode.deptId!}
          deptType={currentNode.deptType!}
          leaderInfo={{
            staffId: currentNode.leaderId,
            staffName: currentNode.leaderName
          }}
          visible={leaderVisible}
          onClose={() => setLeaderVisible(false)}
          onOk={(leaderInfo) => {
            const newNode: IOrganizationItem = {
              ...currentNode,
              leaderId: leaderInfo.staffId || '',
              leaderName: leaderInfo.staffName || ''
            };
            setCurrentNode(newNode);
            setOrganization(updateNodeInfo(organization, newNode));
            staffListRef.current?.resetHandle();
          }}
        />
        <Modal
          title="转移团队"
          visible={transferVisible}
          onClose={() => setTransferVisible(false)}
          onOk={transferDepart}
        >
          <div className={style.transferWrap}>
            <div className={style.transferRow}>
              <span className={style.transferLabel}>目前上级部门：</span>
              <span className={style.transferValue}>{parentDepartName}</span>
            </div>
            <div className={style.transferRow}>
              <span className={style.transferLabel}>修改上级部门：</span>
              <span className={style.transferValue}>
                <TreeSelect
                  showSearch
                  filterTreeNode={(val, node) => node.deptName?.includes(val)}
                  style={{ width: '100%' }}
                  fieldNames={{ label: 'deptName', value: 'deptId' }}
                  treeData={formatDisabled(organization)}
                  loadData={onLoadData}
                  treeDefaultExpandAll
                  placeholder="请选择部门"
                  allowClear
                  value={transferId || undefined}
                  onChange={(val) => setTransferId(val)}
                />
              </span>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Organization;
