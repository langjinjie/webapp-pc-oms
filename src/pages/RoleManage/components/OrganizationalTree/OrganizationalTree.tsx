import React, { useState, useEffect, Key, Dispatch, SetStateAction, useContext } from 'react';
import { Context } from 'src/store';
import { Modal, Tree, Input } from 'antd';
import { Icon } from 'src/components';
import { requestGetDeptList, requestGetDepStaffList } from 'src/apis/orgManage';
import { debounce } from 'src/utils/base';
import classNames from 'classnames';
import style from './style.module.less';

interface IAddLotteryListProps {
  value?: any[];
  onChange?: (value: any[]) => void;
  showStaff?: boolean;
  roleType?: 1 | 2 | 3;
  params: { visible: boolean; added: boolean; roleId: string };
  setParams: Dispatch<SetStateAction<{ visible: boolean; added: boolean; roleId: string }>>;
  onOk?: (value: any) => void;
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

const OrganizationalTree: React.FC<IAddLotteryListProps> = ({
  value,
  onChange,
  showStaff,
  roleType,
  params,
  setParams,
  onOk
}) => {
  const { currentCorpId: corpId } = useContext<{ currentCorpId: string }>(Context);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
  const [flatTreeData, setFlatTreeData] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [autoExpand, setAutoExpand] = useState(true);
  const [treeSearchValue, setTreeSearchValue] = useState('');
  const [selectedCount, setSeletedCount] = useState(0);
  const [treeProps, setTreeProps] = useState<ItreeProps>({
    autoExpandParent: true,
    expandedKeys: [],
    height: 370,
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
    setFlatTreeData([]);
    setAutoExpand(true);
    setSelectedList([]);
  };
  // 获取组织架构
  const getCorpOrg = async (parentId: string) => {
    let res1 = await requestGetDeptList({ parentId });
    let res2 = [];
    if (showStaff && parentId) {
      console.log('获取员工列表');
      const res = await requestGetDepStaffList({ queryType: 0, deptType: 0, deptId: parentId });
      res2 = res.list.map((item: any) => ({
        ...item,
        name: item.staffName,
        id: item.staffId,
        isLeaf: true,
        parentId
      }));
    }
    if (res1) {
      // 过滤掉未完善员工
      res1 = res1.filter((item: any) => item.deptId !== -1);
      res1 = await Promise.all(
        res1.map(async (item: any) => {
          // 判断叶子部门节点下是否还有员工，有员工则不能作为叶子节点
          if (
            showStaff &&
            item.isLeaf &&
            (await requestGetDepStaffList({ queryType: 0, deptType: 0, deptId: item.deptId })).list.length
          ) {
            return { ...item, parentId, name: item.deptName, id: item.deptId, isLeaf: false };
          } else {
            return { ...item, parentId, name: item.deptName, id: item.deptId };
          }
        })
      );
      // 将树结构添加到扁平结构中
      setFlatTreeData([...flatTreeData, ...res2, ...res1]);
    }
    return [...res2, ...res1];
  };
  // 将已被选中的节点的所有后代节点过滤掉
  const filterChildren = (arr: any[]) => {
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
  const onOkHandle = async () => {
    onChange?.(selectedList);
    setParams({ visible: false, added: true, roleId: '' });
    onOk?.(selectedList);
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
  const onCheckHandle = async (
    checked:
      | Key[]
      | {
          checked: Key[];
          halfChecked: Key[];
        },
    info: any
  ) => {
    setAutoExpand(false);
    setCheckedKeys(checked as Key[]);
    let selectedList = [];
    if (showStaff) {
      selectedList = flatTreeData.filter((filterItem) => (checked as Key[]).includes(filterItem.staffId));
      // 判断点击的是部门还是员工
      if (!info.node.staffId) {
        // 获取该部门下的所有员工
        const res = await requestGetDepStaffList({ queryType: 1, deptType: 0, deptId: info.node.id, pageSize: 9999 });
        res.list.forEach((item: any) => {
          item.id = item.staffId;
          item.name = item.staffName;
          item.isLeaf = true;
        });
        // 判断是选中还是取消
        if (info.checked) {
          selectedList = [...selectedList, ...res.list];
        }
      }
    } else {
      selectedList = flatTreeData.filter((filterItem) => (checked as Key[]).includes(filterItem.id));
    }
    setSelectedList(selectedList);
  };
  // 树列表搜索
  const treeSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeSearchValue(e.target.value);
  };
  // 已选择成员搜索
  const selectedOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeSearchValue(e.target.value);
  };
  // 删除选中
  const clickDelStaffHandle = (item: any) => {
    setSelectedList((param) => [...param.filter((filterItem) => filterItem.id !== item.id)]);
    setCheckedKeys((keys) => [...keys.filter((keysItem) => keysItem !== item.id)]);
  };
  useEffect(() => {
    filterChildren([]);
    console.log('treeSearchValue', treeSearchValue);
  }, [treeSearchValue]);
  useEffect(() => {
    if (roleType !== 1) {
      if (params.visible) {
        (async () => {
          setTreeData(await getCorpOrg(''));
        })();
      } else {
        onResetHandle();
      }
    }
  }, [params.visible, corpId]);
  // 自动展开以及自动勾选
  useEffect(() => {
    if (value && flatTreeData.length && autoExpand) {
      const expandedKeys = flatTreeData
        .filter((filterItem) =>
          Array.from(new Set(value?.map((mapItem) => [...mapItem.fullDeptId.split(',')]).flat(Infinity))).includes(
            filterItem.deptId.toString() // fullDeptId 是string deptId 是number
          )
        )
        .map((item) => item.deptId);
      setTreeProps({
        ...treeProps,
        autoExpandParent: true,
        expandedKeys
      });
      const staffKeys = flatTreeData
        .filter((filterItem) => value?.some((someItem) => someItem.staffId === filterItem.id))
        .map((mapItem) => mapItem.id);
      const deptKeys = flatTreeData
        .filter((filterItem) => value?.some((someItem) => !someItem.staffId && someItem.deptId === filterItem.id))
        .map((mapItem) => mapItem.id);
      setCheckedKeys((checkedKeys) => Array.from(new Set([...checkedKeys, ...staffKeys, ...deptKeys])));
      const selectedList = flatTreeData.filter((filterItem) =>
        Array.from(new Set([...staffKeys, ...deptKeys])).includes(filterItem.id)
      );
      setSelectedList((param) => [...param, ...selectedList]);
    }
  }, [flatTreeData]);
  useEffect(() => {
    const seletedCount = selectedList.reduce((prev: number, now: any) => {
      if (!now.staffId) {
        prev += now.effCount || 0;
      } else {
        prev += 1;
      }
      return prev;
    }, 0);
    setSeletedCount(seletedCount);
  }, [selectedList]);
  return (
    <Modal
      className={classNames(style.modalWrap, { [style.omsWrap]: roleType === 1 })}
      visible={params.visible}
      centered
      maskClosable={false}
      closable={false}
      title={(params.added ? '添加' : '编辑') + '成员'}
      okText={'确认添加'}
      onOk={onOkHandle}
      onCancel={onCancel}
      destroyOnClose
    >
      {roleType !== 1 && (
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
              fieldNames={{ title: 'name', key: 'id' }}
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
              {selectedList.map(
                (item) =>
                  item && (
                    <div className={style.selectItem} key={item.id}>
                      <span className={style.name}>
                        {item.name}
                        {!item.staffId && '（' + item.effCount + '）'}
                      </span>
                      <Icon
                        className={style.delIcon}
                        name="icon_common_16_inputclean"
                        onClick={() => clickDelStaffHandle(item)}
                      />
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
export default OrganizationalTree;
