import React, { useState, useEffect, Key, useContext, useMemo } from 'react';
import { Context } from 'src/store';
import { Modal, Tree, Input, ModalProps } from 'antd';
import { Icon, Empty } from 'src/components';
import { requestGetDeptList, requestGetDepStaffList, searchStaffList } from 'src/apis/orgManage';
import { debounce, filterChildren, updateTreeData } from 'src/utils/base';
import classNames from 'classnames';
import style from './style.module.less';

interface IAddLotteryListProps extends ModalProps {
  value?: any[];
  onChange?: (value: any[]) => void;
  showStaff?: boolean;
  selectedDept?: boolean;
  title?: string;
  params: any;
  setParams?: any;
  onCancel?: () => void;
  onOk?: (value: any) => void;
  isDeleted?: 0 | 1; // 0：在职 1：离职
  checkStrictly?: boolean; // checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
  singleChoice?: boolean;
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
  selectedDept = true,
  params,
  setParams,
  onOk,
  onCancel: onClose,
  isDeleted,
  checkStrictly,
  singleChoice,
  ...props
}) => {
  const { currentCorpId: corpId } = useContext<{ currentCorpId: string }>(Context);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [flatTreeData, setFlatTreeData] = useState<any[]>([]);
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [autoExpand, setAutoExpand] = useState(true);
  const [treeSearchValue, setTreeSearchValue] = useState('');
  const [selectSearchValue, setSelectSearchValue] = useState('');
  const [treeSearchList, setTreeSearchList] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<Key[]>([]);
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
              // checkable: selectedDept,
              checkable: !singleChoice,
              isLeaf: false
            };
          } else {
            return {
              ...item,
              parentId,
              name: item.deptName,
              // checkable: selectedDept,
              checkable: !singleChoice,
              id: item.deptId.toString()
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
    setParams?.({ visible: false, added: true, roleId: '' });
    onChange?.(filterChildren(selectedList));
    onOk?.(filterChildren(selectedList));
    onClose?.();
  };
  const onCancel = () => {
    onClose?.();
    setParams?.({ visible: false, added: false, roleId: '' });
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
    checke:
      | Key[]
      | {
          checked: Key[];
          halfChecked: Key[];
        },
    info: any
  ) => {
    setAutoExpand(false);
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
    setCheckedKeys(singleChoice && checked.length ? [checked[checked.length - 1]] : checked);
    let newSelectedList = [...selectedList];

    if (showStaff) {
      if (selectedDept) {
        // 判断已选列表是否需要显示部门
        newSelectedList = [...flatTreeData.filter((filterItem) => (checked as Key[]).includes(filterItem.id))];
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
      if (checkStrictly) {
        newSelectedList = flatTreeData.filter((filterItem) => checked.includes(filterItem.id));
      } else {
        newSelectedList = [...flatTreeData.filter((filterItem) => (checked as Key[]).includes(filterItem.id))];
      }
    }
    setSelectedList(
      singleChoice && checked.length
        ? [newSelectedList.find((findItem) => findItem.id === checked[checked.length - 1])]
        : newSelectedList
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
    if (checkStrictly) {
      setSelectedList((param) => [...param.filter((filterItem) => !(filterItem.id === item.id))]);
      setCheckedKeys((keys) => [...(keys as React.Key[]).filter((keysItem) => !(keysItem === item.id))]);
    } else {
      const itemFullDeptIdList = item.fullDeptId.split(',');
      const itemChildrenKeys = [
        item.id,
        ...selectedList
          .filter((filterItem) => filterItem.fullDeptId.split(',').includes(item.id))
          .map((mapItem) => mapItem.id)
      ];
      // 将该成员、子级及其祖先级全部取消选择
      setSelectedList((param) => [...param.filter((filterItem) => !itemChildrenKeys.includes(filterItem.id))]);
      setCheckedKeys((keys) => [
        ...(keys as React.Key[]).filter(
          (keysItem) => !(keysItem === item.id || [...itemFullDeptIdList, ...itemChildrenKeys].includes(keysItem))
        )
      ]);
    }
  };
  // 点击左侧搜索结果的部门或者
  const searchList = async () => {
    const searchType = showStaff ? (selectedDept ? undefined : 2) : 1;
    const res = await searchStaffList({
      keyWords: treeSearchValue,
      searchType, // 1-搜索部门 2-搜索员工 不传则搜索全部
      isFull: searchType === 1 ? undefined : true,
      isDeleted
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
    let selected: any[] = [];
    if (checked) {
      selected = singleChoice
        ? [{ ...item, id: item.id.toString() }]
        : [...selectedList, { ...item, id: item.id.toString() }];
      if (flatTreeData.some((someItem) => someItem.id === item.id.toString())) {
        setCheckedKeys((keys) =>
          singleChoice ? [item.id.toString()] : [...(keys as React.Key[]), item.id.toString()]
        );
      }
    } else {
      selected = selectedList.filter((filterItem) => filterItem.id !== item.id.toString());
      setCheckedKeys((keys) => [...(keys as React.Key[]).filter((keysItem) => keysItem !== item.id.toString())]);
    }
    setSelectedList(selected);
  };
  useEffect(() => {
    treeSearchValue && searchList();
  }, [treeSearchValue]);
  useEffect(() => {
    if (params.visible) {
      (async () => {
        setTreeData(await getCorpOrg(''));
      })();
    } else {
      onResetHandle();
    }
  }, [params.visible, corpId]);
  // 自动展开以及自动勾选
  useEffect(() => {
    if (params.visible && flatTreeData.length) {
      const filterValue = value?.filter((filterItem) => filterItem.fullDeptId) || [];
      if (autoExpand) {
        // 过滤掉fullDeptId为null的
        const expandedKeys = flatTreeData
          .filter((filterItem) =>
            Array.from(
              new Set(
                filterValue
                  ?.map((mapItem) => [...mapItem.fullDeptId?.split(',')])
                  .toString()
                  .split(',')
              )
            ).includes(
              // .toString().split(',') 数组扁平化
              filterItem.deptId.toString() // fullDeptId 是string deptId 是number
            )
          )
          .map((item) => item.deptId.toString());
        setTreeProps({
          ...treeProps,
          autoExpandParent: true,
          expandedKeys
        });
        const staffKeys = flatTreeData
          .filter((filterItem) => filterValue?.some((someItem) => someItem.staffId === filterItem.id))
          .map((mapItem) => mapItem.id);

        // const deptValue = selectedDept ? filterValue : filterValue.filter((filterItem) => !filterItem.staffId);
        const deptValue = filterValue.filter((filterItem) => !filterItem.staffId);
        const deptKeys = flatTreeData
          .filter((filterItem) =>
            deptValue?.some((someItem) => someItem.deptId.toString() === filterItem.id.toString())
          ) // deptId有时候是string 有时候是number
          .map((mapItem) => mapItem.id);
        setCheckedKeys((checkedKeys) =>
          Array.from(new Set([...(checkedKeys as React.Key[]), ...staffKeys, ...deptKeys]))
        );
        const selectedList = flatTreeData.filter((filterItem) =>
          Array.from(new Set([...staffKeys, ...deptKeys])).includes(filterItem.id)
        );
        setSelectedList(() => [...selectedList]);
      } else {
        // if (!checkStrictly) {
        const selectedListKes = selectedList.map((mapItem) => mapItem.id);
        const newExpandedKeys: Key[] = flatTreeData
          .filter((filterItem) => selectedListKes.includes(filterItem.id))
          .map((mapItem) => mapItem.id);
        setCheckedKeys((keys) => [...(keys as Key[]), ...newExpandedKeys]);
        // }
      }
    }
  }, [flatTreeData, value]);
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
  return (
    <Modal
      className={style.modalWrap}
      visible={params.visible}
      centered
      maskClosable={false}
      closable={false}
      title={(params.added ? '添加' : '编辑') + '成员'}
      okText={'确认添加'}
      onOk={onOkHandle}
      onCancel={onCancel}
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
              {treeSearchList.length
                ? (
                    treeSearchList.map((item: any) => (
                  <div
                    key={item.id}
                    className={classNames(style.searchItem, {
                      [style.active]: selectedList.some((selectItem) => item.id.toString() === selectItem.id)
                    })}
                    onClick={() =>
                      clickSearchList(item, !selectedList.some((selectItem) => item.id.toString() === selectItem.id))
                    }
                  >
                    <div
                      className={classNames(style.name, 'ellipsis')}
                      title={`${item.name}${item.userId ? ' ' + item.userId + ' ' + item.deptName : ''}`}
                    >
                      {`${item.name}${item.userId ? ' ' + item.userId + ' ' + item.deptName : ''}`}
                    </div>
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
          <Tree
            checkStrictly={checkStrictly}
            className={classNames(style.tree, { [style.hiden]: !!treeSearchValue })}
            {...treeProps}
            fieldNames={{ title: 'name', key: 'id' }}
            loadData={onLoadDataHandle}
            // @ts-ignore
            treeData={treeData}
            multiple={false}
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
            {filterChildren(selectedList)
              .filter((filterItem) => filterItem.name.includes(selectSearchValue))
              .map(
                (item) =>
                  item && (
                    <div className={style.selectItem} key={item.id}>
                      <span
                        className={style.name}
                        title={
                          item.name +
                          (!item.staffId ? '（' + (item.effCount || item.staffCount || 0) + '）' : '') +
                          (item.staffId ? '（' + item.deptName + '）' : '')
                        }
                      >
                        {item.name +
                          (!item.staffId ? '（' + (item.effCount || item.staffCount || 0) + '）' : '') +
                          (item.staffId ? '（' + item.deptName + '）' : '')}
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
export default OrganizationalTree;
