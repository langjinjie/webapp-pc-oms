/**
 * @name Organization
 * @author Lester
 * @date 2021-12-10 10:36
 */
import React, { useEffect, useState } from 'react';
import { Input, Tree, Modal as AntdModal, message } from 'antd';
import classNames from 'classnames';
import { setTitle, copy } from 'lester-tools';
import { Icon, Modal } from 'src/components';
import { queryCorpOrg } from 'src/apis/stationConfig';
import StaffList from './StaffList/StaffList';
import StaffDetail from './StaffDetail/StaffDetail';
import SetLeader from './components/SetLeader';
import style from './style.module.less';

const { Search } = Input;

interface OrganizationItem {
  id?: string;
  name?: string;
  key?: string;
  title?: string;
  isParent?: boolean;
  isLeaf?: boolean;
  index?: number;
  total?: number;
  leaderId?: string;
  isRoot?: boolean;
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
  const [currentNode, setCurrentNode] = useState<OrganizationItem>({});
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [searchList, setSearchList] = useState<OrganizationItem[]>([]);
  const [displayType, setDisplayType] = useState<number>(0);
  const [chooseNode, setChooseNode] = useState<OrganizationItem>({});
  const [leaderVisible, setLeaderVisible] = useState<boolean>(false);
  const [currentDepartment, setCurrentDepartment] = useState<OrganizationItem>({});

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
    const index: number = data.findIndex((item) => item.id === key);
    if (index > -1) {
      const copyData = data.slice(0);
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
      return copyData;
    } else {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: moveData(item.children, key, type)
          };
        }
        return item;
      });
    }
  };

  /**
   * 格式化数据源
   * @param data
   * @param isRoot
   */
  const formatData = (data: OrganizationItem[], isRoot?: boolean) => {
    return data.map((item, index) => ({
      ...item,
      isLeaf: !item.isParent,
      index,
      total: data.length,
      isRoot
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
      if (item.id === key) {
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
      const res: any = await queryCorpOrg({ parentId: key });
      if (res) {
        setOrganization((data) => updateData(data, key, res));
      }
    }
  };

  /**
   * 获取组织架构初始数据
   */
  const initCorpOrgData = async () => {
    const res: any = await queryCorpOrg({});
    if (res && res.length > 0) {
      res[0].children = [];
      setOrganization(formatData(res, true));
    }
  };

  /**
   * 删除部门
   */
  const delDepartment = () => {
    if (!currentNode.isParent) {
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
  const onSearch = (val: string) => {
    if (val) {
      setDisplayType(1);
      setSearchList([
        {
          id: '123',
          name: '龙春表'
        },
        {
          id: '456',
          name: '林堞雅'
        }
      ]);
      setChooseNode({
        id: '123',
        name: '龙春表'
      });
    } else {
      setDisplayType(0);
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
      <section className={classNames(style.left, 'scroll-strip')}>
        <div className={style.inputWrap}>
          <Search
            placeholder="搜索成员、部门"
            onSearch={onSearch}
            enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
        </div>
        <div style={{ display: displayType === 0 ? 'block' : 'none' }}>
          <Tree
            className={style.treeWrap}
            fieldNames={{ title: 'name', key: 'id' }}
            blockNode
            expandedKeys={expandIds}
            onExpand={(keys) => setExpandIds(keys)}
            treeData={organization}
            loadData={onLoadData}
            titleRender={(node) => (
              <div className={style.nodeItem}>
                {node.name}({node.isRoot ? '78/80' : '60'})
                <Icon
                  className={style.dotIcon}
                  name="diandian"
                  onClick={(e) => {
                    console.log(node);
                    e.stopPropagation();
                    handlePosition(e.clientX, e.clientY);
                    setShowDepart(true);
                    setCurrentNode(node);
                  }}
                />
              </div>
            )}
            selectedKeys={[currentDepartment.id || '']}
            onSelect={(selectedKeys, { selectedNodes }) => {
              if (selectedNodes.length > 0) {
                setCurrentDepartment(selectedNodes[0]);
              }
            }}
          />
        </div>
        <ul style={{ display: displayType === 1 ? 'block' : 'none' }} className={style.searchList}>
          {searchList.map((item: OrganizationItem) => (
            <li
              key={item.id}
              className={classNames(style.searchItem, {
                [style.active]: item.id === chooseNode.id
              })}
              onClick={() => setChooseNode(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </section>
      <div className={style.right}>
        {displayType === 0
          ? (
          <StaffList setDisplayType={setDisplayType} departmentId={currentDepartment.id!} />
            )
          : (
          <StaffDetail />
            )}
      </div>
      <ul
        style={{ ...position, transform: `scale(${showDepart ? 1 : 0})` }}
        className={style.departmentOperation}
        onClick={(e) => e.stopPropagation()}
      >
        <li
          className={style.operationItem}
          title={currentNode.id}
          onClick={() => {
            copy(currentNode.id!, false);
            message.success('部门id已复制');
          }}
        >
          部门ID：{currentNode.id}
        </li>
        <li className={style.operationItem} onClick={() => setDepartmentVisible(true)}>
          添加子部门
        </li>
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: currentNode.isRoot
          })}
          onClick={() => {
            if (!currentNode.isRoot) {
              setDepartmentVisible(true);
              setDepartmentName(currentNode.name!);
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
            [style.disabled]: currentNode.isParent
          })}
          onClick={() => !currentNode.isParent && setDeleteVisible(true)}
        >
          删除
        </li>
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: currentNode.index === 0
          })}
          onClick={() => currentNode.index! > 0 && setOrganization(moveData(organization, currentNode.id!, 'up'))}
        >
          上移
        </li>
        <li
          className={classNames(style.operationItem, {
            [style.disabled]: currentNode.index! === (currentNode.total || 0) - 1
          })}
          onClick={() =>
            currentNode.index! < (currentNode.total || 0) - 1 &&
            setOrganization(moveData(organization, currentNode.id!, 'down'))
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
          chooseIds={[currentNode.id!]}
          visible={leaderVisible}
          onClose={() => setLeaderVisible(false)}
          onOk={(ids) => {
            console.log(ids);
          }}
        />
      </div>
    </div>
  );
};

export default Organization;
