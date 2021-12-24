import React, { useEffect, useState, Key } from 'react';
import { Modal, Tree, Input } from 'antd';
import { Icon } from 'src/components';
import { requestGetDeptList, requestGetDepStaffList, searchStaffList } from 'src/apis/orgManage';
import style from './style.module.less';
import classNames from 'classnames';

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
  const [treeData, setTreeData] = useState<any[]>([]);
  const [flatTreeData, setFlatTreeData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
  const [selectList, setSelectList] = useState<any[]>([]);
  const [searchList, setSearchList] = useState<any[]>([]);
  // const [noRenderDelStaff, setNoRenderDelStaff] = useState<any[]>([]); // 保存 在数结构中为渲染但是被删除的元素
  const [treeProps, setTreeProps] = useState<ItreeProps>({
    autoExpandParent: true,
    expandedKeys: [],
    height: 331,
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
    setSearchList([]);
  };

  // 获取组织架构
  const getCorpOrg = async (parentId: string) => {
    let res1 = await requestGetDeptList({ parentId });
    let res2 = [];
    if (chooseTreeParam.title === '选择员工' && parentId) {
      const res = await requestGetDepStaffList({ queryType: 0, deptType: 0, deptId: parentId });
      res2 = res.list.map((item: any) => ({
        ...item,
        name: item.staffName,
        id: item.staffId,
        isLeaf: true,
        // isStaff: true,
        parentId
      }));
    }
    if (res1) {
      res1 = res1.filter((item: any) => item.deptId !== -1);
      const productTagRequestList = res1.map((item: any) =>
        requestGetDepStaffList({ queryType: 0, deptType: 0, deptId: item.deptId })
      );
      const productTagResponseList = await Promise.all(productTagRequestList);
      // 将树结构添加到扁平结构中
      res1 = res1.map((item: any, index: number) => {
        if (chooseTreeParam.title === '选择员工' && productTagResponseList[index].list.length) {
          return { ...item, parentId, name: item.deptName, id: item.deptId, isLeaf: false };
        } else {
          return { ...item, parentId, name: item.deptName, id: item.deptId };
        }
      });
      setFlatTreeData([...flatTreeData, ...res1, ...res2]);
    }
    return [...res1, ...res2];
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

  // 异步获取组织架构及当前目录下的员工
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
        return { isLeaf: item.isLeaf, name, id: item.id, children: loop(item.children) };
      }
      return {
        isLeaf: item.isLeaf,
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
  const onSearchHandle = async (val: string) => {
    if (val) {
      const res = await searchStaffList({
        keyWords: val,
        searchType: chooseTreeParam.title === '选择员工' ? 2 : 1,
        isFull: true
      });
      if (chooseTreeParam.title === '选择员工') {
        res.staffList.forEach((item: any) => {
          item.id = item.staffId;
          item.name = item.staffName;
          item.isLeaf = true;
          // item.isStaff = true;
        });
        setSearchList(res.staffList);
      } else {
        res.deptList.forEach((item: any) => {
          item.id = item.deptId;
          item.name = item.deptName;
          // item.isLeaf = true;
          // item.isStaff = true;
        });
        setSearchList(res.deptList);
      }
    } else {
      setSearchList([]);
    }
  };

  // 选择搜索结果的员工列表
  const clickSearchList = (item: any) => {
    if (selectList.some((selectItem) => item.id === selectItem.id)) {
      setSelectList((list) => {
        return [...list.filter((listItem) => listItem.id !== item.id)];
      });
      // 判断当前节点是否已经在treeData中
      if (flatTreeData.some((flatTreeItem) => flatTreeItem.id === item.id)) {
        setSelectedKeys([...selectedKeys.filter((key) => key !== item.id)]);
      }
    } else {
      setSelectList((list) => [...list, item]);
      // 判断当前节点是否已经在treeData中
      if (flatTreeData.some((flatTreeItem) => flatTreeItem.id === item.id)) {
        setSelectedKeys(Array.from(new Set([...selectedKeys, item.id])));
      }
    }
  };

  // 展开/折叠触发
  const onExpandHandle = (expandedKeys: Key[]) => {
    setTreeProps({ ...treeProps, expandedKeys, autoExpandParent: false });
  };

  // 选中复选框
  const onCheckedHandle = async (checked: Key[], info: any) => {
    let currentNodeStaffList = [...selectList];
    setSelectedKeys(checked);
    const checkedItem = flatTreeData.find((flatTreeDataItem) => flatTreeDataItem.id === info.node.id);
    // 判断点击的是
    if (!checkedItem.staffId) {
      const res = await requestGetDepStaffList({ queryType: 1, deptType: 0, deptId: info.node.id, pageSize: 9999 });
      res.list.forEach((item: any) => {
        item.id = item.staffId;
        item.name = item.staffName;
        item.isLeaf = true;
      });
      setSelectList([...currentNodeStaffList]);
      if (info.checked) {
        currentNodeStaffList = [...currentNodeStaffList, ...res.list];
        const currentNodeStaffListKeys = Array.from(new Set(currentNodeStaffList.map((item) => item.id)));
        currentNodeStaffList = currentNodeStaffListKeys.map((key) => ({
          ...currentNodeStaffList.find((item) => item.id === key)
        }));
      } else {
        currentNodeStaffList = [
          ...currentNodeStaffList.filter(
            (currentStaffItem) => !res.list.some((item: any) => item.id === currentStaffItem.id)
          )
        ];
      }
    } else {
      if (info.checked) {
        currentNodeStaffList = [
          ...currentNodeStaffList,
          ...flatTreeData.filter((flatTreeItem) => flatTreeItem.id === info.node.id)
        ];
      } else {
        currentNodeStaffList = [...selectList.filter((flatTreeItem) => flatTreeItem.id !== info.node.id)];
      }
    }
    setSelectList(currentNodeStaffList);
  };

  // 点击节点
  const onSelectHandle = (selectKeys: any) => {
    if (!chooseTreeParam.isShowStaff) {
      setSelectedKeys(selectKeys);
      setSelectList([...flatTreeData.filter((flatTreeItem) => flatTreeItem.id === selectKeys[0])]);
    }
  };

  // 点击单个删除选中员工
  const clickDelStaffHandle = (id: string, filterKeys = [...selectedKeys]) => {
    // 找出当前点击删除的节点
    const currentNode = flatTreeData.find((item) => item.id === id);
    // 找到当前元素的父级,并且从selectKeys中删除
    const parentId = currentNode?.parentId;
    filterKeys = filterKeys.filter((key: Key) => key !== id);
    // 判断当前节点的父级是否被选中
    if (selectedKeys.some((item) => item === parentId)) {
      clickDelStaffHandle(currentNode.parentId, filterKeys);
    } else {
      setSelectedKeys(filterKeys);
    }
    setSelectList([...selectList.filter((item) => item.id !== id)]);
    if (![...selectList.filter((item) => item.id !== id)].length) {
      setSelectedKeys([]);
    }
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
    onResetHandle();
  };

  // 确认modal
  const onOkHandle = () => {
    // 判断是选中员工还是选择部门
    if (chooseTreeParam.title === '选择员工') {
      setStaffInfo((staffInfo: any) => ({ ...staffInfo, staffList: selectList }));
    } else {
      setStaffInfo((staffInfo: any) => ({
        ...staffInfo,
        department: selectList[0]
      }));
    }
    setChooseTreeParam({ ...chooseTreeParam, visible: false });
    setMultiVisible(true);
  };
  useEffect(() => {
    if (chooseTreeParam.visible) {
      setTreeProps({ ...treeProps, checkable: chooseTreeParam.isShowStaff });
      (async () => {
        setTreeData(await getCorpOrg(''));
      })();
    }
    !chooseTreeParam.visible && onResetHandle();
  }, [chooseTreeParam]);
  useEffect(() => {
    (() => {
      // 将被选中父级的所有子节点被异步请求完成后手动添加为选中节点
      const newSelectedKeys = flatTreeData
        .filter((item: any) => selectedKeys.includes(item.parentId))
        .map((item) => item.id);
      // 找出通过搜索选中的员工
      const selectKeys = Array.from(new Set([...selectedKeys, ...newSelectedKeys]));
      // 找出被删除的staffId
      setSelectedKeys(selectKeys);
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
      okButtonProps={{
        disabled: !selectList.length
      }}
    >
      <div className={style.treeWrap}>
        <div className={style.tree}>
          <Search
            className={style.searchTree}
            placeholder={chooseTreeParam.title === '选择员工' ? '搜索员工' : '搜索部门'}
            onChange={(e) => onChangeHandle(e.target.value)}
            onSearch={(val) => onSearchHandle(val)}
            enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
          {!!searchList.length && (
            <div className={style.searchListWrap}>
              {searchList.map((item: any) => (
                <div
                  key={item.id}
                  className={classNames(style.searchItem, {
                    [style.active]: selectList.some((selectItem) => item.id === selectItem.id)
                  })}
                  onClick={() => clickSearchList(item)}
                >
                  <div className={style.name}>{item.name}</div>
                </div>
              ))}
            </div>
          )}
          {!searchList.length && (
            <Tree
              {...treeProps}
              fieldNames={{ title: 'name', key: 'id' }}
              treeData={loop(treeData)}
              loadData={onLoadDataHandle}
              checkedKeys={selectedKeys}
              onExpand={onExpandHandle}
              // @ts-ignore
              onCheck={onCheckedHandle}
              onSelect={(selectKeys) => onSelectHandle(selectKeys)}
            />
          )}
        </div>
        {chooseTreeParam.isShowStaff && (
          <div className={style.choosedStaff}>
            <div className={style.title}>已选</div>
            <div className={classNames(style.selectList, 'scroll-strip')}>
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
