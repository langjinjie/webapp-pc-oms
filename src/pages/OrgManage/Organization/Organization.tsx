/**
 * @name Organization
 * @author Lester
 * @date 2021-12-10 10:36
 */
import React, { useEffect, useState } from 'react';
import { Input, Tree, Modal as AntdModal, message } from 'antd';
import classNames from 'classnames';
import { setTitle, copy } from 'lester-tools';
import { Icon, Modal, Empty } from 'src/components';
import { queryDepartmentList, searchStaffAndDepart } from 'src/apis/organization';
import StaffList from './StaffList/StaffList';
import StaffDetail from './StaffDetail/StaffDetail';
import SetLeader from './components/SetLeader';
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
  effCount?: boolean;
  isLeaf?: boolean;
  index?: number;
  totalCount?: number;
  leaderId?: string;
  leaderName?: string;
  total?: number;
  children?: OrganizationItem[];
}

interface PositionValue {
  left: number;
  top: number;
}

type Key = string | number;

const Organization: React.FC = () => {
  const [organization, setOrganization] = useState<OrganizationItem[]>([]);
  const [expandIds, setExpandIds] = useState<Key[]>([]);
  const [position, setPosition] = useState<PositionValue>({ left: 0, top: 0 });
  const [showDepart, setShowDepart] = useState<boolean>(false);
  const [departmentVisible, setDepartmentVisible] = useState<boolean>(false);
  const [departmentName, setDepartmentName] = useState<string>('');
  const [currentNode, setCurrentNode] = useState<OrganizationItem & StaffItem>({});
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [searchList, setSearchList] = useState<OrganizationItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [displayType, setDisplayType] = useState<number>(0);
  const [leaderVisible, setLeaderVisible] = useState<boolean>(false);

  /**
   * 处理/计算左边位置
   * @param x
   * @param y
   */
  const handlePosition = (x: number, y: number) => {
    let top = y + 30;
    if (window.innerHeight - y - 35 < 228) {
      top = y - 30 - 232;
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
  const moveData = (data: OrganizationItem[], key: string, type: string): OrganizationItem[] => {
    const copyData = data.slice(0);
    const isNewStaffDepart = Number(copyData[0].deptId) === -1;
    let newStaffDepart: OrganizationItem[] = [];
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
   * @param isRoot
   */
  const formatData = (data: OrganizationItem[]) => {
    const isNewStaffDepart = Number(data[0].deptId) === -1;
    return data.map((item, index) => ({
      ...item,
      index: isNewStaffDepart ? index - 1 : index,
      total: isNewStaffDepart ? data.length - 1 : data.length,
      children: []
    }));
    /* if (resItem.children && resItem.children.length > 0) {
      resItem.children = formatData(resItem.children);
    } */
  };

  /**
   * 更新数据
   * @param list
   * @param key
   * @param children
   */
  const updateData = (list: OrganizationItem[], key: string, children: OrganizationItem[]): OrganizationItem[] => {
    return list.map((item) => {
      if (item.deptId === key) {
        return {
          ...item,
          children: formatData(children)
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
  const updateNodeInfo = (data: OrganizationItem[], node: OrganizationItem): OrganizationItem[] => {
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
   * 删除部门
   */
  const delDepartment = () => {
    if (currentNode.isLeaf) {
      AntdModal.confirm({
        title: '提示',
        content: '确定删除？',
        async onOk () {
          console.log('1123');
        }
      });
    }
  };

  /**
   * 搜索
   * @param val
   */
  const onSearch = async (val: string) => {
    if (val) {
      const res: any = await searchStaffAndDepart({ keyWords: val });
      if (res) {
        const departList = res.deptList || [];
        const staffList = res.staffList || [];
        setSearchList(departList);
        setStaffList(staffList);
        if (departList.length > 0) {
          setCurrentNode(departList[0]);
        } else if (staffList.length > 0) {
          setCurrentNode(staffList[0]);
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
        <div className={style.inputWrap}>
          <Search
            placeholder="搜索成员、部门"
            onSearch={onSearch}
            enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
        </div>
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
                {Number(node.deptId) > -1 && (
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
                )}
              </div>
            )}
            selectedKeys={[currentNode.deptId || '']}
            onSelect={(selectedKeys, { selectedNodes }) => {
              if (selectedNodes.length > 0) {
                setCurrentNode(selectedNodes[0]);
              }
            }}
          />
        </div>
        <ul style={{ display: displayType === 1 ? 'block' : 'none' }} className={style.searchList}>
          {searchList.length === 0 && staffList.length === 0 && <Empty />}
          {searchList.map((item: OrganizationItem) => (
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
        </ul>
      </section>
      <div className={style.right}>
        {currentNode.staffId
          ? (
          <StaffDetail staffId={currentNode.staffId} />
            )
          : (
          <StaffList departmentId={currentNode.deptId!} deptType={currentNode.deptType!} />
            )}
      </div>
      <ul
        style={{ ...position, transform: `scale(${showDepart ? 1 : 0})` }}
        className={style.departmentOperation}
        onClick={(e) => e.stopPropagation()}
      >
        <li
          className={style.operationItem}
          title={currentNode.deptId}
          onClick={() => {
            copy(currentNode.deptId!, false);
            message.success('部门id已复制');
          }}
        >
          部门ID：{currentNode.deptId}
        </li>
        <li className={style.operationItem} onClick={() => setDepartmentVisible(true)}>
          添加子部门
        </li>
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: currentNode.deptType !== 0
          })}
          onClick={() => {
            if (currentNode.deptType === 0) {
              setDepartmentVisible(true);
              setDepartmentName(currentNode.deptName!);
            }
          }}
        >
          修改名称
        </li>
        <li className={style.operationItem} onClick={() => setLeaderVisible(true)}>
          设置上级
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
          onClick={() => currentNode.index! > 0 && setOrganization(moveData(organization, currentNode.deptId!, 'up'))}
        >
          上移
        </li>
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: currentNode.index! === (currentNode.total || 0) - 1
          })}
          onClick={() =>
            currentNode.index! < (currentNode.total || 0) - 1 &&
            setOrganization(moveData(organization, currentNode.deptId!, 'down'))
          }
        >
          下移
        </li>
      </ul>
      <div onClick={(e) => e.stopPropagation()}>
        <Modal
          visible={departmentVisible}
          onClose={() => setDepartmentVisible(false)}
          title="添加部门"
          onOk={() => {
            setDepartmentVisible(false);
          }}
        >
          <Input
            className={style.inputRadius}
            placeholder="请输入部门名称"
            maxLength={40}
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
        </Modal>
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
            const newNode: OrganizationItem = {
              ...currentNode,
              leaderId: leaderInfo.staffId,
              leaderName: leaderInfo.staffName
            };
            setCurrentNode(newNode);
            setOrganization(updateNodeInfo(organization, newNode));
            setLeaderVisible(false);
          }}
        />
      </div>
    </div>
  );
};

export default Organization;
