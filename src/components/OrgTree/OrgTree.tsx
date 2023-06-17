import React, { useState, useEffect, Key, useMemo } from 'react';
import { Modal, Tree, Input, ModalProps } from 'antd';
import { Icon, Empty } from 'src/components';
import { requestGetDeptList, requestGetDepStaffList, searchStaffList } from 'src/apis/orgManage';
import { debounce, filterChildren, updateTreeData } from 'src/utils/base';
import classNames from 'classnames';
import style from './style.module.less';

interface IAddLotteryListProps extends ModalProps {
  value?: any[];
  visible: boolean;
  onChange?: (value: any[]) => void;
  showStaff?: boolean;
  selectedDept?: boolean;
  title?: string;
  onCancel?: () => void;
  onOk?: (value: any) => void;
  isDeleted?: 0 | 1; // 0：在职 1：离职
  checkStrictly?: boolean; // checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
  singleChoice?: boolean;
  checkabledDTypeKeys?: Key[]; // 允许被选中的部门类型，不传则全部能选中
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

/**
 * @description 不自动展开的组织架构树
 */
const OrgTree: React.FC<IAddLotteryListProps> = ({
  value,
  visible,
  onChange,
  onOk,
  onCancel: onClose,
  showStaff,
  selectedDept,
  isDeleted,
  checkStrictly,
  singleChoice,
  checkabledDTypeKeys,
  title,
  ...props
}) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [flatTreeData, setFlatTreeData] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [treeSearchValue, setTreeSearchValue] = useState('');
  const [selectSearchValue, setSelectSearchValue] = useState('');
  const [treeSearchList, setTreeSearchList] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<
    | Key[]
    | {
        checked: Key[];
        halfChecked: Key[];
      }
  >([]);
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
    setSelectedList([]);
    setTreeSearchValue('');
    setSelectSearchValue('');
  };

  // 获取组织架构
  const getCorpOrg = async (parentId: string) => {
    let res1 = await requestGetDeptList({ parentId });
    let res2: any = [];
    if (showStaff && parentId) {
      const res = await requestGetDepStaffList({ queryType: 0, deptType: 0, deptId: parentId, isDeleted });
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
            (await requestGetDepStaffList({ queryType: 0, deptType: 0, deptId: item.deptId, isDeleted })).list.length
          ) {
            // deptId是number类型，需要统一转成跟staffId一样的string类型
            return {
              ...item,
              parentId,
              name: item.deptName,
              id: item.deptId.toString(),
              isLeaf: false,
              checkable: !singleChoice,
              disableCheckbox: checkabledDTypeKeys && !checkabledDTypeKeys?.includes(item.dType)
            };
          } else {
            return {
              ...item,
              parentId,
              name: item.deptName,
              id: item.deptId.toString(),
              checkable: !singleChoice,
              disableCheckbox: checkabledDTypeKeys && !checkabledDTypeKeys?.includes(item.dType)
            };
          }
        })
      );
      // 将树结构添加到扁平结构中
      setFlatTreeData((flatTreeData) => [...flatTreeData, ...res2, ...res1]);
    }
    return [...res2, ...res1];
  };

  const onOkHandle = async () => {
    onChange?.(filterChildren(selectedList));
    onOk?.(filterChildren(selectedList));
    onClose?.();
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
    // setAutoExpand(false);
    setTreeProps({ ...treeProps, expandedKeys, autoExpandParent: false });
  };

  // 选中节点
  const onCheckHandle = async (
    checke:
      | Key[]
      | {
          checked: Key[];
          halfChecked: Key[];
        },
    info: any
  ) => {
    let checked: Key[] = [];
    if (checkStrictly) {
      checked = (
        checke as {
          checked: Key[];
          halfChecked: Key[];
        }
      ).checked;
    } else {
      checked = checke as Key[];
    }
    setCheckedKeys(singleChoice ? [checked[checked.length - 1]] : checked);
    let newSelectedList = [...selectedList];

    if (showStaff) {
      if (selectedDept) {
        if (info.checked) {
          newSelectedList = [...newSelectedList, { ...info.node }];
        } else {
          newSelectedList = newSelectedList.filter((filterItem) => !(filterItem.id === info.node.id));
        }
      } else {
        // 判断点击的是部门还是员工
        if (!info.node.staffId) {
          // 获取该部门下的所有员工
          const res = await requestGetDepStaffList({
            queryType: 1,
            deptType: 0,
            deptId: info.node.id,
            pageSize: 9999,
            isDeleted
          });
          res.list.forEach((item: any) => {
            item.id = item.staffId;
            item.name = item.staffName;
            item.isLeaf = true;
          });
          // 判断是选中还是取消
          if (info.checked) {
            const selectedListKeys = selectedList.map((mapItem) => mapItem.id);
            newSelectedList = [
              ...newSelectedList,
              ...res.list.filter((filterItem: { id: string }) => !selectedListKeys.includes(filterItem.id))
            ];
          } else {
            const resListKeys = res.list.map((mapItem: { id: string }) => mapItem.id);
            newSelectedList = newSelectedList.filter((filterItem) => !resListKeys.includes(filterItem.id));
          }
        } else {
          if (info.checked) {
            // 选择单个员工
            newSelectedList = [...newSelectedList, { ...info.node }];
          } else {
            // 取消选择按个员工
            newSelectedList = [...newSelectedList.filter((filterItem) => filterItem.staffId !== info.node.staffId)];
          }
        }
      }
    } else {
      // 判断已选列表是否需要显示部门
      if (info.checked) {
        newSelectedList = [...newSelectedList, { ...info.node }];
      } else {
        newSelectedList = newSelectedList.filter(
          (filterItem) => !(filterItem.id === info.node.id)
          // (filterItem) => !(filterItem.id === info.node.id || filterItem.fullDeptId.includes(info.node.id))
        );
      }
    }
    setSelectedList(
      singleChoice ? [newSelectedList.find((findItem) => findItem.id === checked[checked.length - 1])] : newSelectedList
    );
  };

  // 树列表搜索
  const treeSearchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTreeSearchValue(e.target.value);
  };

  // 已选择成员搜索
  const selectedOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectSearchValue(e.target.value);
  };

  // 删除选中
  const clickDelStaffHandle = (item: any) => {
    setSelectedList((param) => [...param.filter((filterItem) => filterItem.id !== item.id)]);
    if (checkStrictly) {
      setCheckedKeys((keys) => [...(keys as React.Key[]).filter((keysItem) => !(keysItem === item.id))]);
    } else {
      // 当删除员工得时候,如果该员工所在的部门id也被选中,则所在部门也要移除checkedKeys列表
      setCheckedKeys((keys) => [
        ...(keys as React.Key[]).filter(
          (keysItem) => !item.fullDeptId.split(',').includes(keysItem) && keysItem !== item.id
        )
      ]);
    }
  };

  // 点击左侧搜索结果的部门或者
  const searchList = async () => {
    const res = await searchStaffList({
      keyWords: treeSearchValue,
      searchType: showStaff ? (selectedDept ? undefined : 2) : 1, // 1-搜索部门 2-搜索员工 不传则搜索全部
      isFull: true
    });
    if (res) {
      const list = [...(res.staffList || []), ...(res.deptList || [])];
      list.forEach((item: any) => {
        item.id = item.staffId || item.deptId;
        item.name = item.staffName || item.deptName;
      });
      setTreeSearchList(list);
    }
  };

  // 点击搜索出来的列表
  const clickSearchList = (item: any, checked: boolean) => {
    if (!item.staffId && checkabledDTypeKeys && !checkabledDTypeKeys?.includes(item.dType)) {
      return Modal.warning({ title: '操作提示', content: '不能选择该部门', centered: true });
    }
    let selected: any[] = [];
    if (!checked) {
      selected = singleChoice ? [item] : [...selectedList, item];
    } else {
      selected = selectedList.filter((filterItem) => filterItem.id !== item.id);
    }
    setSelectedList(selected);
  };

  const seletedCount = useMemo(() => {
    const seletedCount = filterChildren(selectedList).reduce((prev: number, now: any) => {
      if (!now.staffId) {
        prev += now.effCount || now.staffCount || 0;
      } else {
        prev += 1;
      }
      return prev;
    }, 0);
    return seletedCount;
  }, [selectedList]);

  // 已选择员工-前端搜索实现
  const filterSelectedList = useMemo(() => {
    return filterChildren(selectedList).filter((filterItem) => filterItem.name?.includes(selectSearchValue));
  }, [selectSearchValue, selectedList]);

  useEffect(() => {
    treeSearchValue && searchList();
  }, [treeSearchValue]);

  useEffect(() => {
    if (visible) {
      setSelectedList(
        (value || []).map((mapItem) => ({
          ...mapItem,
          // deptId为number，统一转化为string
          id: mapItem.staffId || mapItem.deptId.toString(),
          name: mapItem.staffName || mapItem.deptName
        }))
      );
      (async () => {
        setTreeData(await getCorpOrg(''));
      })();
    } else {
      onResetHandle();
    }
  }, [visible]);

  // 展开回写
  useEffect(() => {
    if (flatTreeData.length) {
      const valueKeys = selectedList.map((mapItem) => mapItem.id);
      const flatTreeDataKeys: Key[] = flatTreeData.map((mapItem) => mapItem.id);
      const newCheckedKeys = flatTreeDataKeys.filter((item: Key) => valueKeys.includes(item));
      const noCheckedValue = selectedList?.filter((filterItem) =>
        valueKeys.filter((filterKeys) => !newCheckedKeys.includes(filterKeys)).includes(filterItem.id)
      );
      setCheckedKeys(newCheckedKeys);
      // 更新已选择成员信息
      setSelectedList([
        ...noCheckedValue,
        ...flatTreeData.filter((filterItem) => newCheckedKeys.includes(filterItem.id))
      ]);
    }
  }, [flatTreeData]);

  return (
    <Modal
      className={style.modalWrap}
      visible={visible}
      centered
      maskClosable={false}
      closable={false}
      title={'添加成员' || title}
      okText={'确认添加'}
      onOk={onOkHandle}
      onCancel={onClose}
      destroyOnClose
      {...props}
    >
      <div className={style.contentWrap}>
        <div className={style.treeWrap}>
          <Input
            className={style.searchTree}
            placeholder={showStaff ? (selectedDept ? '搜索成员、部门' : '搜索员工') : '搜索部门'}
            // @ts-ignore
            onChange={debounce(treeSearchOnChange, 500)}
            addonBefore={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
          <div className={style.title}>成员</div>
          {!!treeSearchValue && (
            <div className={style.searchListWrap}>
              {treeSearchList.length !== 0 &&
                treeSearchList.map((item: any) => (
                  <div
                    key={item.id}
                    className={classNames(style.searchItem, {
                      [style.active]: selectedList.some((selectItem) => item.id === selectItem.id)
                    })}
                    onClick={() =>
                      clickSearchList(
                        item,
                        selectedList.some((selectItem) => item.id === selectItem.id)
                      )
                    }
                  >
                    <div
                      className={classNames(style.name, 'ellipsis')}
                      title={`${item.name}${item.userId ? ' ' + item.userId + ' ' + item.deptName : ''}`}
                    >
                      {`${item.name}${item.userId ? ' ' + item.userId + ' ' + item.deptName : ''}`}
                    </div>
                  </div>
                ))}
              {treeSearchList.length === 0 && (
                <div className={style.empty}>
                  <Empty />
                </div>
              )}
            </div>
          )}
          <Tree
            checkStrictly={checkStrictly}
            className={classNames(style.tree, { [style.hiden]: !!treeSearchValue })}
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
            placeholder={showStaff ? (selectedDept ? '搜索成员、部门' : '搜索员工') : '搜索部门'}
            // @ts-ignore
            onChange={debounce(selectedOnchange, 500)}
            addonBefore={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
          <div className={style.seletedTitle}>已选择成员 {seletedCount} 人</div>
          <div className={classNames(style.selectList, 'scroll-strip')}>
            {/* 前端搜索已选择 */}
            {filterSelectedList.map(
              (item) =>
                item && (
                  <div className={style.selectItem} key={item.id}>
                    <span
                      className={style.name}
                      title={
                        item.name +
                        (!item.staffId && (item.effCount || item.staffCount)
                          ? '（' + (item.effCount || item.staffCount) + '）'
                          : '') +
                        (item.staffId && item.deptName ? '（' + item.deptName + '）' : '')
                      }
                    >
                      {item.name +
                        (!item.staffId && (item.effCount || item.staffCount)
                          ? '（' + (item.effCount || item.staffCount) + '）'
                          : '') +
                        (item.staffId && item.deptName ? '（' + item.deptName + '）' : '')}
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
    </Modal>
  );
};
export default OrgTree;
