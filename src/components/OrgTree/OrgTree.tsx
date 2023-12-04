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
  selectedType?: 'staff' | 'dept' | 'all'; // 选择模式,staff-员工 dept-部门 all-都能选择
  title?: string;
  onCancel?: () => void;
  onOk?: (value: any) => void;
  isDeleted?: 0 | 1; // 0：在职 1：离职
  checkStrictly?: boolean; // checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
  singleChoice?: boolean;
  checkabledDTypeKeys?: Key[]; // 允许被选中的部门类型，不传则全部能选中
  isDeptActiveStaff?: boolean;
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
  selectedType = 'all',
  onOk,
  onCancel: onClose,
  isDeleted = 0,
  checkStrictly,
  singleChoice,
  checkabledDTypeKeys,
  title,
  isDeptActiveStaff,

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
    let res1 = await requestGetDeptList({ parentId, activeStatus: isDeptActiveStaff ? 1 : undefined });
    let res2: any = [];
    if (['staff', 'all'].includes(selectedType) && parentId) {
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
            ['staff', 'all'].includes(selectedType) &&
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
              // 多选模式判断 部门不展示勾选框只是当选择模式是staff,并且为singleChoice
              checkable: !(singleChoice && selectedType === 'staff'),
              disableCheckbox: checkabledDTypeKeys && !checkabledDTypeKeys?.includes(item.dType)
            };
          } else {
            return {
              ...item,
              parentId,
              name: item.deptName,
              id: item.deptId.toString(),
              checkable: !(singleChoice && selectedType === 'staff'),
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
    let newSelectedList = [...selectedList];

    if (checkStrictly) {
      checked = (
        checke as {
          checked: Key[];
          halfChecked: Key[];
        }
      ).checked;
      newSelectedList = info.checked
        ? [...newSelectedList, info.node]
        : newSelectedList.filter(({ id }) => id !== info.node.id);
    } else {
      checked = checke as Key[];
      // 只选择员工
      if (selectedType === 'staff') {
        if (!info.node.staffId) {
          // 如果点击的是部门: 获取该部门下的所有员工
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
          // 点击的是员工
          if (info.checked) {
            // 选择单个员工
            newSelectedList = [...newSelectedList, { ...info.node }];
          } else {
            // 取消选择按个员工,需要将祖先部门也取消选中
            newSelectedList = newSelectedList.filter(
              (filterItem) => !(filterItem.id === info.node.id || info.node.fullDeptId?.includes(filterItem.id))
            );
          }
        }
      } else {
        if (!info.checked && !info.node.staffId) {
          // 取消勾选部门
          // 如果点击的是部门并且是取消选中，则需要过滤掉该部门下面的所有的部门员工,它的祖先部门也要被取消选择
          newSelectedList = newSelectedList.filter(
            (item) =>
              !item.fullDeptId?.split(',').includes(info.node.id) && !info.node.fullDeptId?.split(',').includes(item.id)
          );
        } else {
          // 包含两种情况:1.选中部门;2.选中/取消员工
          // 将不在树中的单独拎出来放在新的选中列表中,然后再使用checked来过滤添加到新的选中列表中
          newSelectedList = [
            ...selectedList.filter((filterItem) => !flatTreeData.some(({ id }) => id === filterItem.id)),
            ...flatTreeData.filter((filterItem) => (checked as Key[]).includes(filterItem.id))
          ];
        }
      }
    }
    setCheckedKeys(singleChoice ? (info.checked ? [info.node.id] : []) : checked);
    setSelectedList(singleChoice ? (info.checked ? [info.node] : []) : newSelectedList);
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
    const newSelectedList = filterChildren(selectedList).filter((filterItem) => filterItem.id !== item.id);
    setSelectedList(newSelectedList);
    if (checkStrictly) {
      setCheckedKeys((keys) => [...(keys as React.Key[]).filter((keysItem) => !(keysItem === item.id))]);
    } else {
      if (item.staffId) {
        // 当删除员工得时候,如果该员工所在的部门id也被选中,则所在部门也要移除checkedKeys列表
        setCheckedKeys((keys) => [
          ...(keys as React.Key[]).filter(
            (keysItem) => !item.fullDeptId?.split(',').includes(keysItem) && keysItem !== item.id
          )
        ]);
      } else {
        // 确保key在tree中
        setCheckedKeys((keys) => (keys as Key[]).filter((key) => newSelectedList.map(({ id }) => id).includes(key)));
      }
    }
  };

  // 点击左侧搜索结果的部门或者
  const searchList = async () => {
    const res = await searchStaffList({
      keyWords: treeSearchValue,
      searchType: selectedType === 'dept' ? 1 : selectedType === 'all' ? undefined : 2, // 1-搜索部门 2-搜索员工 不传则搜索全部
      isFull: true,
      isDeleted
    });
    if (res) {
      const list = [...(res.staffList || []), ...(res.deptList || [])];
      list.forEach((item: any) => {
        // deptId后端返回为number 需要转换为string
        item.id = item.staffId || item.deptId.toString();
        item.name = item.staffName || item.deptName;
      });
      setTreeSearchList(list.filter(({ fullDeptId }) => fullDeptId));
    }
  };

  // 点击搜索出来的列表
  const clickSearchList = (item: any, checked: boolean) => {
    if (!item.staffId && checkabledDTypeKeys && !checkabledDTypeKeys?.includes(item.dType)) {
      return Modal.warning({ title: '操作提示', content: '不能选择该部门', centered: true });
    }
    let selected: any[] = [];
    if (checked) {
      selected = singleChoice ? [item] : [...selectedList, item];
    } else {
      selected = selectedList.filter(
        (filterItem) =>
          // 如果是员工,则需要将员工的祖先部门取消勾选,如果是部门,则需要将部门的上下级部门和下级员工全部取消勾选
          !(
            filterItem.id === item.id ||
            item.fullDeptId?.split(',').includes(filterItem.id) ||
            (!item.staffId && filterItem.fullDeptId?.split(',').includes(item.id))
          )
      );
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
      console.log(value);

      setSelectedList(
        (value || [])
          .map((mapItem) => ({
            ...mapItem,
            // deptId为number，统一转化为string
            id:
              mapItem.staffId ||
              mapItem.deptId?.toString() ||
              mapItem.fullDeptId?.split(',')[mapItem.fullDeptId?.split(',').length - 1],
            name: mapItem.staffName || mapItem.deptName
          }))
          .filter(({ name }) => name)
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
      // 已选择的keys(包含在树中为展开)
      const valueKeys = selectedList.map((mapItem) => mapItem.id);
      // 已在Tree中渲染出来的选中的keys
      const renderKeys = flatTreeData
        .filter(
          (item: any) =>
            // 过滤部门的下级,
            item.fullDeptId?.split(',').some((deptId: string) => valueKeys.includes(deptId)) ||
            // 过滤当前级
            valueKeys.includes(item.id)
        )
        .map(({ id }) => id);
      // 未在Tree中渲染的valueKeys
      const noRenderValue = selectedList?.filter((filterItem) =>
        valueKeys.filter((filterKeys) => !renderKeys.includes(filterKeys)).includes(filterItem.id)
      );
      setCheckedKeys(renderKeys);
      // 更新已选择成员信息
      setSelectedList([...noRenderValue, ...flatTreeData.filter((filterItem) => renderKeys.includes(filterItem.id))]);
    }
  }, [flatTreeData]);

  return (
    <Modal
      className={style.modalWrap}
      visible={visible}
      centered
      maskClosable={false}
      closable={false}
      title={title || '添加成员'}
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
            placeholder={selectedType === 'all' ? '搜索成员、部门' : selectedType === 'staff' ? '搜索员工' : '搜索部门'}
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
                      [style.active]: selectedList.some(
                        (selectItem) => item.id === selectItem.id || item.fullDeptId?.split(',').includes(selectItem.id)
                      )
                    })}
                    onClick={() =>
                      clickSearchList(
                        item,
                        !selectedList.some(
                          (selectItem) =>
                            item.id === selectItem.id || item.fullDeptId?.split(',').includes(selectItem.id)
                        )
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
            placeholder={selectedType === 'all' ? '搜索成员、部门' : selectedType === 'staff' ? '搜索员工' : '搜索部门'}
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
