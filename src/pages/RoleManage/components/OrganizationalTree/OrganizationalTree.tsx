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
            return { ...item, parentId, name: item.deptName, id: item.deptId, isLeaf: false };
          } else {
            return { ...item, parentId, name: item.deptName, id: item.deptId };
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
    onChange?.(selectedList);
    onOk?.(selectedList);
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
    checked:
      | Key[]
      | {
          checked: Key[];
          halfChecked: Key[];
        },
    info: any
  ) => {
    setAutoExpand(false);
    setCheckedKeys(checked);
    let newSelectedList = [...selectedList];

    if (showStaff) {
      if (selectedDept) {
        // 判断已选列表是否需要显示部门
        newSelectedList = filterChildren([
          ...flatTreeData.filter((filterItem) => (checked as Key[]).includes(filterItem.id))
        ]);
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
      newSelectedList = filterChildren([
        ...flatTreeData.filter((filterItem) => (checked as Key[]).includes(filterItem.id))
      ]);
      if (checkStrictly) {
        newSelectedList = flatTreeData.filter((filterItem) =>
          (
            checked as {
              checked: Key[];
              halfChecked: Key[];
            }
          ).checked.includes(filterItem.id)
        );
      } else {
        newSelectedList = filterChildren([
          ...flatTreeData.filter((filterItem) => (checked as Key[]).includes(filterItem.id))
        ]);
      }
    }
    setSelectedList(newSelectedList);
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
      setCheckedKeys((keys) => ({
        checked: (
          keys as {
            checked: Key[];
            halfChecked: Key[];
          }
        ).checked.filter((keysItem) => keysItem !== item.id),
        halfChecked: []
      }));
    } else {
      setCheckedKeys((keys) => [...(keys as React.Key[]).filter((keysItem) => keysItem !== item.id)]);
    }
  };
  // 点击左侧搜索结果的部门或者
  const searchList = async () => {
    const res = await searchStaffList({
      keyWords: treeSearchValue,
      searchType: selectedDept ? 1 : 2, // 1-搜索部门 2-搜索员工 不传则搜索全部
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
    let selected: any[] = [];
    if (!checked) {
      selected = [...selectedList, item];
      if (checkStrictly) {
        setCheckedKeys((keys) => ({
          checked: [
            ...(
              keys as {
                checked: Key[];
                halfChecked: Key[];
              }
            ).checked,
            item.id
          ],
          halfChecked: []
        }));
      } else {
        setCheckedKeys((keys) => [...(keys as React.Key[]), item.id]);
      }
      // onChange?.([...selectedList, item]);
    } else {
      selected = selectedList.filter((filterItem) => filterItem.id !== item.id);
      if (checkStrictly) {
        setCheckedKeys((keys) => ({
          checked: (
            keys as {
              checked: Key[];
              halfChecked: Key[];
            }
          ).checked.filter((keysItem) => keysItem !== item.id),
          halfChecked: []
        }));
      } else {
        setCheckedKeys((keys) => [...(keys as React.Key[]).filter((keysItem) => keysItem !== item.id)]);
      }
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
    if (params.visible && value && flatTreeData.length && autoExpand) {
      // 过滤掉fullDeptId为null的
      const filterValue = value.filter((filterItem) => filterItem.fullDeptId);
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
        .map((item) => item.deptId);
      setTreeProps({
        ...treeProps,
        autoExpandParent: true,
        expandedKeys
      });
      const staffKeys = flatTreeData
        .filter((filterItem) => filterValue?.some((someItem) => someItem.staffId === filterItem.id))
        .map((mapItem) => mapItem.id);

      const deptValue = selectedDept ? filterValue : filterValue.filter((filterItem) => !filterItem.staffId);
      // const deptValue = filterValue.filter((filterItem) => !filterItem.staffId);
      const deptKeys = flatTreeData
        .filter((filterItem) => deptValue?.some((someItem) => someItem.deptId.toString() === filterItem.id.toString())) // deptId有时候是string 有时候是number
        .map((mapItem) => mapItem.id);
      if (checkStrictly) {
        const oldData = (checkedKeys as { checked: Key[]; halfChecked: Key[] })?.checked
          ? (checkedKeys as { checked: Key[]; halfChecked: Key[] })?.checked
          : [];
        setCheckedKeys(() => ({
          checked: Array.from(new Set([...oldData, ...staffKeys, ...deptKeys])),
          halfChecked: []
        }));
      } else {
        setCheckedKeys((checkedKeys) =>
          Array.from(new Set([...(checkedKeys as React.Key[]), ...staffKeys, ...deptKeys]))
        );
      }
      const selectedList = flatTreeData.filter((filterItem) =>
        Array.from(new Set([...staffKeys, ...deptKeys])).includes(filterItem.id)
      );
      setSelectedList(() => [...selectedList]);
    }
  }, [flatTreeData, value]);
  const seletedCount = useMemo(() => {
    const seletedCount = selectedList.reduce((prev: number, now: any) => {
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
                      [style.active]: selectedList.some((selectItem) => item.id === selectItem.id)
                    })}
                    onClick={() =>
                      clickSearchList(
                        item,
                        selectedList.some((selectItem) => item.id === selectItem.id)
                      )
                    }
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
            {selectedList
              .filter((filterItem) => filterItem.name.includes(selectSearchValue))
              .map(
                (item) =>
                  item && (
                    <div className={style.selectItem} key={item.id}>
                      <span
                        className={style.name}
                        title={
                          item.name +
                          (!item.staffId ? '（' + (item.effCount || item.staffCount) + '）' : '') +
                          (item.staffId ? '（' + item.deptName + '）' : '')
                        }
                      >
                        {item.name +
                          (!item.staffId ? '（' + (item.effCount || item.staffCount) + '）' : '') +
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
