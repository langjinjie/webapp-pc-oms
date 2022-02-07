import React, { useEffect, useState, Key } from 'react';
import { Modal, Tree, Input, message } from 'antd';
import { Icon, Empty } from 'src/components';
import { requestGetDeptList, requestGetDepStaffList, searchStaffList } from 'src/apis/orgManage';
import { IDepStaffList } from 'src/utils/interface';
import style from './style.module.less';
import classNames from 'classnames';

interface IChooseTreeModalProps {
  chooseTreeParam: { title: string; visible: boolean; isShowStaff: boolean };
  staffInfo: any;
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
  selectedKeys?: Key[];
}

const ChooseTreeModal: React.FC<IChooseTreeModalProps> = ({
  chooseTreeParam,
  staffInfo,
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
      setFlatTreeData([...flatTreeData, ...res2, ...res1]);
    }
    return [...res2, ...res1];
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
  // 本地搜索组织架构
  const onChangeHandle = (value: string) => {
    if (!value) {
      setSearchList([]);
      setSearchValue('');
    }
  };

  // 搜索部门或者员工
  const onSearchHandle = async (val: string) => {
    if (val) {
      const res = await searchStaffList({
        keyWords: val,
        searchType: chooseTreeParam.title === '选择员工' ? undefined : 1,
        isFull: true
      });
      setSearchValue(val);
      let searchList = [];
      if (chooseTreeParam.title === '选择员工') {
        searchList = [...res.staffList, ...(res.deptList || [])];
      } else {
        searchList = res.deptList || [];
      }
      searchList.forEach((item: any) => {
        item.id = item.deptId || item.staffId;
        item.name = item.deptName || item.staffName;
      });
      setSearchList(searchList);
    } else {
      setSearchList([]);
    }
  };

  // 递归处理取消已选中
  const cancelChecked: any = (parentId: string, newSelectList?: any[]) => {
    const parentItem = newSelectList?.find((item) => item.id === parentId);
    if (parentItem) {
      newSelectList = [...(newSelectList as any[]).filter((listItem) => !(listItem.id === parentItem.id))];
      const nextParentId: string = newSelectList.find((item) => item.id === parentItem.parentId)?.id;
      if (nextParentId) {
        newSelectList = cancelChecked(nextParentId);
      }
    }
    return newSelectList;
  };

  // 选择搜索结果的员工列表
  const clickSearchList = async (item: any) => {
    let newSelectList: any[] = [];
    let newSelectedKeys = [];
    let selectDeptStaff: any[] = [];
    // 判断点击的是部门还是员工
    if (chooseTreeParam.title === '选择员工' && !item.staffId) {
      const res = await requestGetDepStaffList({ queryType: 1, deptType: 0, deptId: item.id, pageSize: 9999 });
      res.list.forEach((listItem: any) => {
        listItem.id = listItem.staffId;
        listItem.name = listItem.staffName;
        listItem.parentId = item.deptId;
      });
      selectDeptStaff = res.list;
    }
    // 判断是选中还是取消选中
    if (selectList.some((selectItem) => item.id === selectItem.id)) {
      // 过滤当前点击员工/部门
      newSelectList = [...selectList.filter((listItem) => listItem.id !== item.id)];
      // 过滤当前点击部门下的所有员工
      newSelectList = [
        ...newSelectList.filter((listItem) => !selectDeptStaff.some((staffItem) => staffItem.id === listItem.id))
      ];
      // 过滤当前点击对应的parent(场景:搜索到部门,并且选中部门下的所有员工)
      // newSelectList = [...newSelectList.filter((listItem) => !(listItem.id === selectList.find((selectItem) => item.id === selectItem.id).parentId))];
      const currentItem = selectList.find((selectItem) => item.id === selectItem.id);
      if (currentItem.parentId) {
        newSelectList = cancelChecked(currentItem.parentId, newSelectList);
      }
      // 判断当前节点是否已经在treeData中(在则表示该treeData已经被加载)
      if (flatTreeData.some((flatTreeItem) => flatTreeItem.id === item.id)) {
        newSelectedKeys = [...selectedKeys.filter((key) => key !== item.id)];
      }
    } else {
      if (chooseTreeParam.title === '选择部门') {
        setSelectList([item]);
        newSelectList = [item];
      } else {
        const newSelectListObj = [...selectList, item, ...selectDeptStaff].reduce((prev, now) => {
          prev[now.id] = now;
          return prev;
        }, {});
        newSelectList = Object.values(newSelectListObj);
      }
      // 判断当前节点是否已经在treeData中
      if (flatTreeData.some((flatTreeItem) => flatTreeItem.id === item.id)) {
        newSelectedKeys = Array.from(new Set([...selectedKeys, item.id]));
      }
    }
    setSelectList(newSelectList);
    setSelectedKeys(newSelectedKeys);
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
    // 判断点击的是部门还是员工
    if (!checkedItem.staffId) {
      // 部门
      const res = await requestGetDepStaffList({ queryType: 1, deptType: 0, deptId: info.node.id, pageSize: 9999 });
      res.list.forEach((item: any) => {
        item.id = item.staffId;
        item.name = item.staffName;
        item.isLeaf = true;
      });
      // 判断是选中还是取消选中
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
      // 员工
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
    let newSelectList = [];
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
    newSelectList = selectList.filter((item) => item.id !== id);
    const currentItem = selectList.find((item) => item.id === id);
    if (currentItem.parentId) {
      newSelectList = cancelChecked(currentItem.parentId, newSelectList);
    }
    setSelectList(newSelectList);
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
      setStaffInfo((staffInfo: any) => ({ ...staffInfo, staffList: selectList.filter((item) => item.staffId) }));
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
      if (chooseTreeParam.title === '选择部门') {
        setSelectedKeys([staffInfo.department?.id]);
      } else {
        setSelectList(staffInfo.staffList);
      }
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
      const selectListKeys = flatTreeData
        .filter((flatTreeItem) => selectList.some((selectItem) => selectItem.id === flatTreeItem.id))
        .map((item) => item.id);
      // 找出通过搜索选中的员工
      const selectKeys = Array.from(new Set([...selectedKeys, ...newSelectedKeys, ...selectListKeys]));
      setSelectedKeys(selectKeys);
    })();
  }, [flatTreeData]);
  useEffect(() => {
    if (chooseTreeParam.title === '选择部门') {
      const isLeaderStaff: IDepStaffList[] = staffInfo.staffList.filter((item: IDepStaffList) => item.isLeader);
      const isLeaderStaffOfChangeDept = isLeaderStaff.filter((item) => item.deptId !== selectList[0]?.deptId);
      if (selectList.length && isLeaderStaffOfChangeDept.length) {
        const name = isLeaderStaffOfChangeDept.reduce((prev: string, now, index) => {
          if (index === isLeaderStaffOfChangeDept.length - 1) {
            return prev + now.staffName;
          } else {
            return prev + now.staffName + '，';
          }
        }, '');
        message.warning('部门批量修改不可含有上级身份员工：' + name);
      }
    }
  }, [selectList]);
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
        disabled:
          chooseTreeParam.title === '选择员工' ? !selectList.filter((item) => item.staffId).length : !selectList.length
      }}
    >
      <div className={style.treeWrap}>
        <div className={style.tree}>
          <Search
            className={style.searchTree}
            placeholder={chooseTreeParam.title === '选择员工' ? '搜索员工/部门' : '搜索部门'}
            onChange={(e) => onChangeHandle(e.target.value)}
            onSearch={(val) => onSearchHandle(val)}
            enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
          {!!searchValue && (
            <div className={style.searchListWrap}>
              {searchList.length
                ? (
                    searchList.map((item: any) => (
                  <div
                    key={item.id}
                    className={classNames(style.searchItem, {
                      [style.active]: selectList.some((selectItem) => item.id === selectItem.id)
                    })}
                    onClick={() => clickSearchList(item)}
                  >
                    <div className={style.name}>{item.name}</div>
                  </div>
                    ))
                  )
                : (
                <div className={style.empty}>
                  <Empty />
                </div>
                  )}
            </div>
          )}
          {!searchValue && (
            <Tree
              {...treeProps}
              fieldNames={{ title: 'name', key: 'id' }}
              treeData={treeData}
              loadData={onLoadDataHandle}
              checkedKeys={selectedKeys}
              onExpand={onExpandHandle}
              selectedKeys={chooseTreeParam.title === '选择部门' ? selectedKeys : []}
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
              {selectList.map(
                (item) =>
                  item.staffId && (
                    <div className={style.selectItem} key={item.id}>
                      <span>
                        {item.name}
                        {!!item.isLeader && <span className={style.isLeader}>上级</span>}
                      </span>
                      <Icon
                        className={style.delIcon}
                        name="icon_common_16_inputclean"
                        onClick={() => clickDelStaffHandle(item.id)}
                      />
                    </div>
                  )
              )}
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
