import React, { useContext, useEffect, useState, Key } from 'react';
import { Modal, Tree, Input, TreeDataNode } from 'antd';
import { Icon } from 'src/components';
import { queryCorpOrg } from 'src/apis/stationConfig';
import { Context } from 'src/store';
// import { IOrganizationItem } from 'src/utils/interface';
import style from './style.module.less';

interface IChooseTreeModalProps {
  chooseTreeParam: { title: string; visible: boolean; isShowStaff: boolean };
  setStaffInfo: (param: any) => void;
  setMultiVisible: (param: boolean) => void;
  setChooseTreeParam: (param: { title: string; visible: boolean; isShowStaff: boolean }) => void;
}

interface ItreeProps {
  autoExpandParent: boolean;
  expandedKeys: Key[];
  height: number;
  virtual: boolean;
  blockNode: boolean;
  checkable: boolean;
  defaultExpandParent: boolean;
}

const ChooseTreeModal: React.FC<IChooseTreeModalProps> = ({
  chooseTreeParam,
  setStaffInfo,
  setMultiVisible,
  setChooseTreeParam
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [flatTreeData, setFlatTreeData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [selectList, setSelectList] = useState<any[]>([]);
  const [searchList, setSearchList] = useState<any[]>([]);
  const [treeProps, setTreeProps] = useState<ItreeProps>({
    autoExpandParent: true,
    expandedKeys: [],
    height: 332,
    virtual: false,
    blockNode: true,
    checkable: true,
    defaultExpandParent: false
  });
  const { Search } = Input;
  // 重置
  const onResetHandle = () => {
    setSelectedKeys([]);
    setTreeProps({ ...treeProps, autoExpandParent: true, expandedKeys: [] });
    setSearchValue('');
    setSelectList([]);
    setFlatTreeData([]);
  };

  // 获取组织架构
  const getCorpOrg = async (parentId = '0') => {
    const res = await queryCorpOrg({ corpId, parentId });
    if (res) {
      // 将树结构添加到扁平结构中
      setFlatTreeData([...flatTreeData, ...res]);
      res.forEach((item: any) => {
        item.isLeaf = !item.isParent;
      });
    }
    return res || [];
  };

  // 向树结构添加子节点
  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] => {
    return list.map((node) => {
      if (node.id === key) {
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

  // 异步获取组织架构
  const onLoadDataHandle = async ({ key }: any) => {
    // 获取对应的子节点
    const res = await getCorpOrg(key);
    res && setTreeData((treeData) => updateTreeData(treeData, key, res));
  };

  // 搜索部门之后过滤
  const loop = (data: any) =>
    data.map((item: any) => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const name =
        index > -1
          ? (
          <span>
            {beforeStr}
            <span className={style['site-tree-search-value']}>{searchValue}</span>
            {afterStr}
          </span>
            )
          : (
          <span>{item.name}</span>
            );
      if (item.children) {
        return { isLeaf: !item.isParent, name, id: item.id, children: loop(item.children) };
      }
      return {
        isLeaf: !item.isParent,
        name,
        id: item.id
      };
    });

  // 获取父节点的id
  const getParentKey = (key: string, tree: any[]): any => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: any) => item.id === key)) {
          parentKey = node.id;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  // 本地搜索组织架构
  const onChangeHandle = (value: string) => {
    value || setSearchList([]);
    setSearchValue(value);
    const expandedKeys = flatTreeData
      .map((item) => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setTreeProps({ ...treeProps, expandedKeys, autoExpandParent: true });
  };

  // 搜索部门或者员工
  const onSearchHandle = (val: string) => {
    if (val) {
      setSearchList([{ name: '郎金杰' }]);
    } else {
      setSearchList([]);
    }
  };

  // 折叠父级,将所有的子级全部折叠逻辑
  const expandedHandle = (expandedKeys: Key[], expandedId: string) => {
    // 找出点击折叠的节点的所有子节点
    const arr1 = flatTreeData.filter((item) => item.parentId === expandedId);
    // 找出当前节点已经展开的子节点
    const arr2 = arr1.filter((item) => expandedKeys.includes(item.id)).map((item) => item.id);
    if (arr2.length) {
      // 将展开的子节点过滤掉
      const newExpandedKeys = expandedKeys.filter((item) => !arr2.includes(item));
      arr2.forEach((item) => {
        expandedHandle(newExpandedKeys, item);
      });
    } else {
      setTreeProps({ ...treeProps, expandedKeys, autoExpandParent: false });
    }
  };

  // 展开/折叠触发
  const onExpandHandle = (
    expandedKeys: Key[],
    info: {
      node: TreeDataNode;
      expanded: boolean;
      nativeEvent: MouseEvent;
    }
  ) => {
    // 判断是折叠还是展开
    if (info.expanded) {
      setTreeProps({ ...treeProps, expandedKeys, autoExpandParent: false });
    } else {
      expandedHandle(expandedKeys, info.node.key as string);
    }
  };

  // 选中复选框
  const onCheckedHandle = (checked: Key[]) => {
    setSelectedKeys(checked);
    // 过滤出已经选中的节点
    const filterChecked = flatTreeData.filter((item) => !item.isParent && checked.includes(item.id));
    setSelectList(filterChecked);
  };

  // 点击节点
  const onSelectHandle = (selectKeys: any) => {
    chooseTreeParam.isShowStaff || setSelectedKeys(selectKeys);
  };

  // 点击单个删除选中员工
  const clickDelStaffHandle = (id: string, filterKeys = [...selectedKeys]) => {
    // 找出当前点击删除的节点
    const currentNode = flatTreeData.find((item) => item.id === id);
    // 找到当前元素的父级,并且从selectKeys中删除
    const parentId = currentNode?.parentId;
    filterKeys = filterKeys.filter((key: Key) => key !== id && (!parentId || key !== parentId));
    // 判断当前节点的父级是否备选中
    if (selectedKeys.some((item) => item === parentId)) {
      clickDelStaffHandle(currentNode.parentId, filterKeys);
    } else {
      setSelectedKeys(filterKeys);
    }
    setSelectList([...selectList.filter((item) => item.id !== id)]);
  };

  // 全部清除选中的staffList
  const clearSelectList = () => {
    setSelectList([]);
    setSelectedKeys([]);
  };

  // 取消modal
  const onCancelHandle = () => {
    setChooseTreeParam({ ...chooseTreeParam, visible: false });
    setMultiVisible(true);
  };

  // 确认modal
  const onOkHandle = () => {
    // 判断是选中员工还是选择部门
    if (chooseTreeParam.title === '选择员工') {
      setStaffInfo((staffInfo: any) => ({ ...staffInfo, staffList: selectList }));
    } else {
      console.log(flatTreeData.find((item) => item.id === selectedKeys[0]));
      setStaffInfo((staffInfo: any) => ({
        ...staffInfo,
        department: flatTreeData.find((item) => item.id === selectedKeys[0])
      }));
    }
    setChooseTreeParam({ ...chooseTreeParam, visible: false });
    setMultiVisible(true);
  };
  useEffect(() => {
    if (chooseTreeParam.visible) {
      setTreeProps({ ...treeProps, checkable: chooseTreeParam.isShowStaff });
      (async () => {
        setTreeData(await getCorpOrg());
      })();
    }
    !chooseTreeParam.visible && onResetHandle();
  }, [chooseTreeParam.visible]);
  useEffect(() => {
    (() => {
      // 将被选中父级的所有子节点被异步请求完成后手动添加为选中节点
      const newSelectedKeys = flatTreeData
        .filter((item: any) => selectedKeys.includes(item.parentId))
        .map((item) => item.id);
      setSelectedKeys(Array.from(new Set([...selectedKeys, ...newSelectedKeys])));
      setSelectList(
        flatTreeData.filter((item) => !item.isParent && [...selectedKeys, ...newSelectedKeys].includes(item.id))
      );
    })();
  }, [flatTreeData]);
  return (
    <Modal
      width={'auto'}
      className={style.modalWrap}
      title={chooseTreeParam.title}
      visible={chooseTreeParam.visible}
      centered={true}
      maskClosable={false}
      closeIcon={<Icon className={style.closeIcon} name={'biaoqian_quxiao'} />}
      onCancel={onCancelHandle}
      onOk={onOkHandle}
      destroyOnClose={true}
    >
      <div className={style.treeWrap}>
        <div className={style.tree}>
          <Search
            className={style.searchTree}
            placeholder="搜索成员"
            onChange={(e) => onChangeHandle(e.target.value)}
            onSearch={(val) => onSearchHandle(val)}
            enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
          {searchList.length
            ? (
            <div className={style.searchListWrap}>
              {searchList.map((item: any) => (
                <div key={item} className={style.searchItem}>
                  <div className={style.name}>{item.name}</div>
                </div>
              ))}
            </div>
              )
            : (
            <Tree
              {...treeProps}
              fieldNames={{ title: 'name', key: 'id' }}
              treeData={loop(treeData)}
              loadData={onLoadDataHandle}
              checkedKeys={selectedKeys}
              onExpand={onExpandHandle}
              onCheck={(checked) => onCheckedHandle(checked as Key[])}
              onSelect={(selectKeys) => onSelectHandle(selectKeys)}
            />
              )}
        </div>
        {chooseTreeParam.isShowStaff && (
          <div className={style.choosedStaff}>
            <div className={style.title}>已选</div>
            <div className={style.selectList}>
              {selectList.map((item) => (
                <div className={style.selectItem} key={item.id}>
                  <span className={style.itemName}>{item.name}</span>
                  <Icon
                    className={style.delIcon}
                    name="icon_common_16_inputclean"
                    onClick={() => clickDelStaffHandle(item.id)}
                  />
                </div>
              ))}
            </div>
            <div className={style.cancel} onClick={clearSelectList}>
              全部取消
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
export default ChooseTreeModal;
