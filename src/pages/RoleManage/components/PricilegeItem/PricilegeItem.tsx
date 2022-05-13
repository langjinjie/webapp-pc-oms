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

const PricilegeItem: React.FC<IPricilegeItem> = ({ value = [], item, onChange }) => {
  const [extend, setExtend] = useState(false);
  const [treeHeight, setTreeHeight] = useState<number | string>(48);
  const [flatTreeData, setFlatTreeData] = useState<any[]>([]);
  const treeListNode = useRef<HTMLDivElement>(null);
  const [treeProps, setTreeProps] = useState<ItreeProps>({
    autoExpandParent: true,
    expandedKeys: [],
    height: 252,
    virtual: false,
    blockNode: true,
    checkable: true,
    defaultExpandParent: false
  });
  // 获取tree的高度
  const getTreeHeight = () => {
    if (item.children && extend) {
      setTreeHeight(treeListNode.current!.offsetHeight + 48 + 1);
    } else {
      setTreeHeight(48);
    }
  };
  // 点击展开对应功能权限
  const extendHandle = () => {
    if (item.children && extend) {
      // 折叠动画
      setTreeHeight(treeListNode.current!.offsetHeight + 48 + 1);
    }
    setExtend((param) => !param);
  };
  // 展开/折叠触发
  const onExpandHandle = (expandedKeys: Key[]) => {
    setTreeHeight('auto');
    setTreeProps({ ...treeProps, expandedKeys, autoExpandParent: false });
  };
  // 选中节点
  const onCheckHandle = (_: any, e: any) => {
    // 判断是选中还是取消选中
    if (e.checked) {
      const newParamKeys = Array.from(
        new Set([...value.map((valueItem) => valueItem.menuId), ...tree2Arry([e.node]).map((item) => item.menuId)])
      );
      const newValue = [...flatTreeData.filter((flatItem) => newParamKeys.includes(flatItem.menuId))];
      onChange?.(newValue);
    } else {
      const deleParamKeys = tree2Arry([e.node]).map((item) => item.menuId);
      const delValue = [...value.filter((valueItem) => !deleParamKeys.includes(valueItem.menuId))];
      onChange?.(delValue);
    }
  };
  useEffect(() => {
    getTreeHeight();
    if (!extend) {
      setTreeProps((param) => ({ ...param, expandedKeys: [] }));
    }
  }, [extend]);
  useEffect(() => {
    item.children && setFlatTreeData(tree2Arry(item.children));
  }, []);
  return (
    <div
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
              key={childItem.menuName}
              className={style.tree}
              {...treeProps}
              checkedKeys={value
                ?.filter((valueItem) => valueItem.fullMenuId.split('-').includes(childItem.menuId))
                .map((item) => item.menuId)}
              onExpand={onExpandHandle}
              onCheck={onCheckHandle}
              fieldNames={{ title: 'menuName', key: 'menuId' }}
              treeData={[childItem]}
            />
          ))}
      </div>
    </div>
  );
};
export default PricilegeItem;
