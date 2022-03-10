import React, { useState, useEffect, Key } from 'react';
import { Modal, Tree } from 'antd';
import { requestGetLotteryDeptList } from 'src/apis/pointsMall';
import style from './style.module.less';

interface IAddLotteryListProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  depLsit: { deptId: number; deptName: string }[];
  setDepList: React.Dispatch<React.SetStateAction<{ deptId: number; deptName: string }[]>>;
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

const AddModal: React.FC<IAddLotteryListProps> = ({ visible, setVisible, depLsit, setDepList }) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [flatTreeData, setFlatTreeData] = useState<{ deptId: number; deptName: string }[]>([]);
  // const [checkedList, setCheckedList] = useState<{ deptId: number; deptName: string }[]>([]);
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
  };
  // 获取组织架构部门
  const getCorpOrg = async (deptId?: number) => {
    // 获取部门,并且过滤掉未完善员工
    const res1: {
      deptId: number;
      deptName: string;
    }[] = (await requestGetLotteryDeptList({ deptId })).filter((item: any) => item.deptId !== -1);
    // 将树结构添加到扁平结构中
    setFlatTreeData([...flatTreeData, ...res1]);
    res1.forEach((item: any) => {
      item.isLeaf = item.isLeaf ? 0 : 1;
    });
    return [...res1];
  };
  const onOk = () => {
    setVisible(false);
    // const allDepList = flatTreeData.filter((item) => checkedKeys.includes(item.deptId));
    // const childDepList = [];
    setDepList(flatTreeData.filter((item) => checkedKeys.includes(item.deptId)));
  };
  const onCancel = () => {
    setVisible(false);
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
    res && setTreeData((treeData) => updateTreeData(treeData, key, res));
  };
  // 展开/折叠触发
  const onExpandHandle = (expandedKeys: Key[]) => {
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
    setCheckedKeys(checked as Key[]);
  };
  useEffect(() => {
    if (visible) {
      (async () => {
        setTreeData(await getCorpOrg());
      })();
    } else {
      onResetHandle();
    }
  }, [visible]);
  useEffect(() => {
    console.log(flatTreeData);
    const keys = flatTreeData.filter((item) => depLsit.some((depItem) => depItem.deptId === item.deptId));
    setCheckedKeys((keysItem) => [...keysItem, ...keys.map((filterItem) => filterItem.deptId)]);
  }, [flatTreeData]);
  useEffect(() => {
    console.log(treeData);
  }, [treeData]);
  return (
    <Modal
      className={style.modalWrap}
      visible={visible}
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
        treeData={treeData}
        onExpand={onExpandHandle}
        checkedKeys={checkedKeys}
        onCheck={onCheckHandle}
      />
    </Modal>
  );
};
export default AddModal;
