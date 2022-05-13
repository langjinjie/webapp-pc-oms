import React, { useState, useEffect, Key, Dispatch, SetStateAction } from 'react';
import { Modal, Tree, Input } from 'antd';
import { Icon } from 'src/components';
import { requestGetLotteryDeptList } from 'src/apis/pointsMall';
import { ITreeDate, IDeptRecord } from 'src/utils/interface';
import { debounce } from 'src/utils/base';
import classNames from 'classnames';
import style from './style.module.less';

interface IAddLotteryListProps {
  params: { visible: boolean; added: boolean; roleId: string };
  setParams: Dispatch<SetStateAction<{ visible: boolean; added: boolean; roleId: string }>>;
  depLsit?: IDeptRecord;
}

interface ItreeProps {
  autoExpandParent: boolean;
  expandedKeys: Key[];
  height: number;
  virtual: boolean;
  blockNode: boolean;
  checkable: boolean;
  defaultExpandParent: boolean;
  selectedKeys?: Key[];
}

const AddOrEditUser: React.FC<IAddLotteryListProps> = ({ params, setParams, depLsit }) => {
  const [treeData, setTreeData] = useState<ITreeDate[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [flatTreeData, setFlatTreeData] = useState<ITreeDate[]>([]);
  const [autoExpand, setAutoExpand] = useState(true);
  const [treeSearchValue, setTreeSearchValue] = useState('');
  const [selectedCount, setSeletedCount] = useState(6);
  const [treeProps, setTreeProps] = useState<ItreeProps>({
    autoExpandParent: true,
    expandedKeys: [],
    height: 370,
    virtual: false,
    blockNode: true,
    checkable: true,
    defaultExpandParent: false
  });
  // const { Search } = Input;
  // 重置
  const onResetHandle = () => {
    setTreeData([]);
    setTreeProps({ ...treeProps, autoExpandParent: true, expandedKeys: [] });
    setCheckedKeys([]);
    setFlatTreeData([]);
    setAutoExpand(true);
  };
  // 获取组织架构部门
  const getCorpOrg = async (deptId?: string) => {
    // 获取部门,并且过滤掉未完善员工
    const res1: ITreeDate[] = (await requestGetLotteryDeptList({ deptId })).map((item: ITreeDate) => ({
      ...item,
      parentId: deptId
    }));
    // 将树结构添加到扁平结构中
    setFlatTreeData((flatTreeData) => [...flatTreeData, ...res1]);
    res1.forEach((item: any) => {
      item.isLeaf = item.isLeaf ? 0 : 1;
    });
    return [...res1];
  };

  // 将已被选中的节点的所有后代节点过滤掉
  const filterChildren = (arr: ITreeDate[]) => {
    const newArr = [...arr];
    const newArr1: string[] = [];
    newArr.forEach((item) => {
      newArr.forEach((childrenItem) => {
        if (item === childrenItem) return;
        // 找出该选中节点的所有后代节点
        if (childrenItem.fullDeptId.split(',').includes(item.deptId)) {
          newArr1.push(childrenItem.deptId);
        }
      });
    });
    // 过滤掉所有选中节点的后代节点
    return newArr.filter((item) => !newArr1.includes(item.deptId));
  };
  const onOk = async () => {
    const deptIdList = flatTreeData.filter((item) => checkedKeys.includes(item.deptId));
    // const res = await requestAddLotteryScope({
    //   deptIds: filterChildren(deptIdList)
    //     .map((item) => item.deptId)
    //     .toString()
    //     .replace(/,/g, ';')
    // });
    console.log(
      filterChildren(deptIdList)
        .map((item) => item.deptId)
        .toString()
        .replace(/,/g, ';')
    );
    console.log('deptIdList', deptIdList);
    const res = {};
    if (res) {
      setParams({ visible: false, added: true, roleId: '' });
    }
  };
  const onCancel = () => {
    setParams({ visible: false, added: false, roleId: '' });
  };
  // 向树结构添加子节点
  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] => {
    return list.map((node) => {
      if (node.deptId === key) {
        return {
          ...node,
          children
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children)
        };
      }
      return node;
    });
  };

  // 异步获取组织架构及当前目录下的员工
  const onLoadDataHandle = async ({ key }: any) => {
    // 获取对应的子节点
    const res: any = await getCorpOrg(key);
    if (res) {
      setTreeData((treeData) => updateTreeData(treeData, key, res));
    }
  };
  // 展开/折叠触发
  const onExpandHandle = (expandedKeys: Key[]) => {
    setAutoExpand(false);
    setTreeProps({ ...treeProps, expandedKeys, autoExpandParent: false });
  };
  // 选中节点
  const onCheckHandle = (
    checked:
      | Key[]
      | {
          checked: Key[];
          halfChecked: Key[];
        }
  ) => {
    setAutoExpand(false);
    setCheckedKeys(checked as Key[]);
    setSeletedCount(6);
  };

  // 树列表搜索
  const treeSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeSearchValue(e.target.value);
  };

  // 已选择成员搜索
  const selectedOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeSearchValue(e.target.value);
  };

  useEffect(() => {
    console.log('treeSearchValue', treeSearchValue);
  }, [treeSearchValue]);
  useEffect(() => {
    if (params.visible) {
      (async () => {
        setTreeData(await getCorpOrg());
      })();
    } else {
      onResetHandle();
    }
  }, [params.visible]);

  // 自动展开以及自动勾选
  useEffect(() => {
    // setTimeout(() => {
    if (depLsit && flatTreeData.length && autoExpand) {
      setTreeProps({
        ...treeProps,
        autoExpandParent: true,
        expandedKeys: flatTreeData
          .filter((item) =>
            Array.from(new Set(depLsit.scopeFullDeptIds.replace(/,/g, ';').split(';'))).includes(item.deptId)
          )
          .map((filterItem) => filterItem.deptId)
      });
      const keys = flatTreeData
        .filter((item) => depLsit.scopeDeptIds.split(';').includes(item.deptId))
        .map((filterItem) => filterItem.deptId);
      setCheckedKeys((checkedKeys) => Array.from(new Set([...checkedKeys, ...keys])));
    }
    // }, 200);
  }, [flatTreeData]);
  return (
    <Modal
      className={style.modalWrap}
      visible={params.visible}
      centered
      maskClosable={false}
      closable={false}
      title={(params.added ? '添加' : '编辑') + '成员'}
      okText={'确认添加'}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <div className={style.contentWrap}>
        <div className={style.treeWrap}>
          <Input
            className={style.searchTree}
            placeholder={'搜索成员、部门'}
            onChange={debounce(treeSearchOnChange, 500)}
            addonBefore={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
          <div className={style.title}>成员</div>
          <Tree
            className={style.tree}
            {...treeProps}
            fieldNames={{ title: 'deptName', key: 'deptId' }}
            loadData={onLoadDataHandle}
            // @ts-ignore
            treeData={treeData}
            onExpand={onExpandHandle}
            checkedKeys={checkedKeys}
            onCheck={onCheckHandle}
          />
        </div>
        <div className={style.selectedWrap}>
          <Input
            placeholder={'搜索成员、部门'}
            onChange={debounce(selectedOnchange, 500)}
            addonBefore={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
          <div className={style.seletedTitle}>已选择成员 {selectedCount} 人</div>
          <div className={classNames(style.selectList, 'scroll-strip')}>
            {checkedKeys.map(
              (item) =>
                item && (
                  <div className={style.selectItem} key={item}>
                    <span>
                      {item}
                      {/* {!!item.isLeader && <span className={style.isLeader}>上级</span>} */}
                    </span>
                    <Icon
                      className={style.delIcon}
                      name="icon_common_16_inputclean"
                      // onClick={() => clickDelStaffHandle(item)}
                    />
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default AddOrEditUser;
