import React, { useState, useEffect, Key, useContext, Dispatch, SetStateAction } from 'react';
import { Modal, Tree } from 'antd';
import { requestGetLotteryDeptList, requestAddLotteryScope } from 'src/apis/pointsMall';
import { ITreeDate, IDeptRecord, IConfirmModalParam } from 'src/utils/interface';
import { Context } from 'src/store';
import style from './style.module.less';

interface IAddLotteryListProps {
  addScopeParam: { visible: boolean; added: boolean };
  setAddScopeParam: React.Dispatch<React.SetStateAction<{ visible: boolean; added: boolean }>>;
  depLsit: IDeptRecord;
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

const AddModal: React.FC<IAddLotteryListProps> = ({ addScopeParam, setAddScopeParam, depLsit }) => {
  const { setConfirmModalParam } = useContext<{ setConfirmModalParam: Dispatch<SetStateAction<IConfirmModalParam>> }>(
    Context
  );
  const [treeData, setTreeData] = useState<ITreeDate[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [flatTreeData, setFlatTreeData] = useState<ITreeDate[]>([]);
  const [autoExpand, setAutoExpand] = useState(true);
  const [treeProps, setTreeProps] = useState<ItreeProps>({
    autoExpandParent: true,
    expandedKeys: [],
    height: 252,
    virtual: false,
    blockNode: true,
    checkable: true,
    defaultExpandParent: false
  });
  // 重置
  const onResetHandle = () => {
    setTreeData([]);
    setTreeProps({ ...treeProps, autoExpandParent: true, expandedKeys: [] });
    setCheckedKeys([]);
    // setCheckedList([]);
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
        if (childrenItem.fullDeptId?.split(',').includes(item.deptId)) {
          newArr1.push(childrenItem.deptId);
        }
      });
    });
    // 过滤掉所有选中节点的后代节点
    return newArr.filter((item) => !newArr1.includes(item.deptId));
  };
  const onConfirm = async () => {
    const deptIdList = flatTreeData.filter((item) => checkedKeys.includes(item.deptId));
    const res = await requestAddLotteryScope({
      deptIds: filterChildren(deptIdList)
        .map((item) => item.deptId)
        .toString()
        .replace(/,/g, ';')
    });
    if (res) {
      setConfirmModalParam((param) => ({ ...param, visible: false }));
      setAddScopeParam({ visible: false, added: true });
    }
  };
  const onOk = () => {
    const deptIdNameList = flatTreeData
      .filter((item) => checkedKeys.includes(item.deptId))
      .map((mapItem) => mapItem.deptName)
      .toString()
      .replace(/,/g, '，');
    setConfirmModalParam((param) => ({
      ...param,
      visible: true,
      title: '温馨提示',
      tips: `是否确定将 <b>${deptIdNameList}</b> 添加进抽奖可见名单？`,
      onOk: onConfirm
    }));
  };
  const onCancel = () => {
    setAddScopeParam({ visible: false, added: false });
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
  };
  useEffect(() => {
    if (addScopeParam.visible) {
      (async () => {
        setTreeData(await getCorpOrg());
      })();
    } else {
      onResetHandle();
    }
  }, [addScopeParam.visible]);

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
      visible={addScopeParam.visible}
      centered
      maskClosable={false}
      closable={false}
      title={'添加抽奖可见名单'}
      okText={'确认添加'}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
    >
      <Tree
        {...treeProps}
        fieldNames={{ title: 'deptName', key: 'deptId' }}
        loadData={onLoadDataHandle}
        // @ts-ignore
        treeData={treeData}
        onExpand={onExpandHandle}
        checkedKeys={checkedKeys}
        onCheck={onCheckHandle}
      />
    </Modal>
  );
};
export default AddModal;
