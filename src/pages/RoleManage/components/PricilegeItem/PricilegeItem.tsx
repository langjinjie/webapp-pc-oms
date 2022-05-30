import React, { useState, Key, useEffect, useRef } from 'react';
import { Tree } from 'antd';
import { Icon } from 'src/components';
import { tree2Arry } from 'src/utils/base';
import classNames from 'classnames';
import style from './style.module.less';

interface IPricilegeItem {
  value?: { menuId: string; fullMenuId: string }[];
  item: any;
  onChange?: (menuList: { menuId: string; fullMenuId: string }[]) => void;
  readonly?: true;
  addMenu?: boolean;
  disabled?: boolean;
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

const PricilegeItem: React.FC<IPricilegeItem> = ({ value = [], item, onChange, readonly, disabled }) => {
  const [extend, setExtend] = useState(false);
  const [treeHeight, setTreeHeight] = useState<number | string>(48);
  const [flatTreeData, setFlatTreeData] = useState<any[]>([]);
  const treeListNode = useRef<HTMLDivElement>(null);
  const treeWrap = useRef<HTMLDivElement>(null);
  const [treeProps, setTreeProps] = useState<ItreeProps>({
    autoExpandParent: true,
    expandedKeys: [],
    height: 252,
    virtual: false,
    blockNode: true,
    checkable: !readonly,
    defaultExpandParent: false
  });

  // 获取tree的高度
  const extendLinster = () => {
    if (item.children && extend) {
      setTreeHeight(treeListNode.current!.offsetHeight + 48 + 1);
    } else {
      setTreeHeight(48);
      setTimeout(() => {
        setTreeProps((param) => ({ ...param, expandedKeys: [] }));
      }, 300);
    }
  };
  // 折叠活
  // 点击展开对应功能权限
  const extendHandle = () => {
    if (item.children && extend) {
      // 点击折叠时,让height立即设置为当前高度,让transition能够生效
      setTreeHeight(treeListNode.current!.offsetHeight + 48 + 1);
    }
    setExtend((param) => !param);
  };
  // 展开/折叠触发
  const onExpandHandle = (expandedKeys: Key[]) => {
    // 折叠/展开tree的时候,高度自适应
    setTreeHeight('auto');
    setTreeProps({ ...treeProps, expandedKeys, autoExpandParent: false });
  };
  // 选中节点
  const onCheckHandle = (_: any, e: any) => {
    // 判断是选中还是取消选中
    if (e.checked) {
      // 判断点击的是否是非查询按钮
      let searchButtonKeys: string[] = [];
      if (e.node.buttonType && e.node.buttonType !== 1) {
        searchButtonKeys = flatTreeData
          .find((findItem: any) => findItem.menuId === e.node.parentId)
          .children.filter((filterItem: any) => filterItem.buttonType === 1)
          .map((mapItem: any) => mapItem.menuId);
      }
      // 将该菜单的所有子菜单选中
      const newParamKeys: Key[] = Array.from(
        new Set([
          ...value.map((valueItem) => valueItem.menuId), // 已有的节点
          ...tree2Arry([e.node]).map((item) => item.menuId), // 将子节点也选中
          ...e.node.fullMenuId.split(','), // 将父节点也选上
          ...searchButtonKeys // 按钮节点
        ])
      );
      const newValue = newParamKeys.map((mapItem) => {
        const item = [...value, ...flatTreeData].find((findItem) => findItem.menuId === mapItem);
        return {
          menuId: item.menuId,
          fullMenuId: item.fullMenuId
        };
      });
      onChange?.(newValue);
    } else {
      const deleParamKeys = tree2Arry([e.node]).map((item) => item.menuId);
      const currentParantsList: string[] = e.node.fullMenuId
        .split(',')
        .slice(0, e.node.fullMenuId.split(',').length - 1);
      currentParantsList.reverse().some((item) => {
        const parentMenu = flatTreeData.find((findItem) => findItem.menuId === item);
        const currentTreeValueKeys = value.map((mapItem) => mapItem.menuId);
        // 判断该节点的父节点是否需要取消选择
        if (
          !e.node.buttonType &&
          parentMenu.children.filter((filterItem: any) => currentTreeValueKeys.includes(filterItem.menuId)).length <= 1
        ) {
          deleParamKeys.push(item);
          return false;
        } else {
          return true;
        }
      });
      // 将该菜单的所有子菜单取消选中
      const delValue = [...value.filter((valueItem) => !deleParamKeys.includes(valueItem.menuId))];
      onChange?.(delValue);
    }
  };

  useEffect(() => {
    extendLinster();
  }, [extend]);
  useEffect(() => {
    item.children && setFlatTreeData(tree2Arry(item.children));
  }, []);
  return (
    <div
      ref={treeWrap}
      className={classNames(style.wrap, { [style.extend]: extend })}
      style={{ height: treeHeight }}
      onClick={extendHandle}
    >
      <Icon className={classNames(style.menuIcon, { [style.extend]: extend })} name={'icon_common_16_Line_Down'} />
      {item.menuName}
      <div
        ref={treeListNode}
        className={classNames(style.treeList, { [style.empty]: !item.children })}
        onClick={(e) => e.stopPropagation()}
      >
        {!item.children ||
          item.children.map((childItem: any) => (
            <Tree
              checkStrictly
              disabled={disabled}
              key={childItem.menuName}
              className={style.tree}
              {...treeProps}
              onCheck={onCheckHandle}
              checkedKeys={value
                ?.filter((valueItem) => valueItem.fullMenuId.split(',').includes(childItem.menuId))
                .map((item) => item.menuId)}
              onExpand={onExpandHandle}
              fieldNames={{ title: 'menuName', key: 'menuId' }}
              treeData={[childItem]}
            />
          ))}
      </div>
    </div>
  );
};
export default PricilegeItem;
