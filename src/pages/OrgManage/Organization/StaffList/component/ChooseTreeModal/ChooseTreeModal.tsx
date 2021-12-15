import React, { useContext, useEffect, useState } from 'react';
import { Modal, Tree, Input } from 'antd';
import { Icon } from 'src/components';
import { queryCorpOrg } from 'src/apis/stationConfig';
import { Context } from 'src/store';
// import { IOrganizationItem } from 'src/utils/interface';
import style from './style.module.less';

interface IChooseTreeModalProps {
  chooseTreeParam: { title: string; visible: boolean; isShowStaff: boolean };
  setStaffList: (param: any) => void;
  setMultiVisible: (param: boolean) => void;
  setChooseTreeParam: (param: { title: string; visible: boolean; isShowStaff: boolean }) => void;
}

interface ItreeProps {
  autoExpandParent: boolean;
  expandedKeys: string[];
  height: number;
  virtual: boolean;
  blockNode: boolean;
  checkable: boolean;
  defaultExpandParent: boolean;
}

const ChooseTreeModal: React.FC<IChooseTreeModalProps> = ({
  chooseTreeParam,
  setStaffList,
  setMultiVisible,
  setChooseTreeParam
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectList, setSelectList] = useState<any[]>([]);
  const [treeProps, setTreeProps] = useState<ItreeProps>({
    autoExpandParent: true,
    expandedKeys: [],
    height: 334,
    virtual: false,
    blockNode: true,
    checkable: true,
    defaultExpandParent: false
  });
  const { Search } = Input;
  const [dataList] = useState<any[]>([]);

  // 重置
  const onResetHandle = () => {
    setSelectedKeys([]);
    setTreeProps({ ...treeProps, autoExpandParent: true, expandedKeys: [] });
    setSearchValue('');
    setSelectList([]);
  };

  // 获取企业组织架构
  const getCorpOrg = async () => {
    const res = await queryCorpOrg({ corpId });
    res && setTreeData(res);
  };

  // 组织架构扁平化
  const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      // const { id, name } = node;
      dataList.push({ ...node, children: null });
      if (node.children) {
        generateList(node.children);
      }
    }
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
        return { name, id: item.id, children: loop(item.children) };
      }
      return {
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

  // 搜索组织架构
  const searchHandle = (value: string) => {
    setSearchValue(value);
    console.log('搜索', value);
    const expandedKeys = dataList
      .map((item) => {
        if (item.name.indexOf(value) > -1) {
          return getParentKey(item.id, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setTreeProps({ ...treeProps, expandedKeys });
  };

  // 展开/折叠触发
  const onExpandHandle = (expandedKeys: any) => {
    setTreeProps({ ...treeProps, expandedKeys, autoExpandParent: false });
  };

  // 选中复选框
  const onCheckedHandle = (checked: any) => {
    setSelectedKeys(checked);
    // 过滤出已经选中的节点
    const filterChecked = dataList.filter((item) => !item.isParent && checked.includes(item.id));
    setSelectList(filterChecked);
  };

  // 点击节点
  const onSelectHandle = (selectKeys: any) => {
    chooseTreeParam.isShowStaff || setSelectedKeys(selectKeys);
  };

  // 点击单个去选选中员工
  const clickDelStaffHandle = (id: string, filterKeys = [...selectedKeys]) => {
    filterKeys = filterKeys.filter((key: string) => key !== id);
    setSelectedKeys(filterKeys);
    // 判断当前点击的是否有父级
    const currentNode = selectList.find((item) => item.id === id);
    if (currentNode && currentNode.parentId !== '0') {
      clickDelStaffHandle(currentNode.parentId, filterKeys);
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
    console.log('cancel~');
    setChooseTreeParam({ ...chooseTreeParam, visible: false });
    setMultiVisible(true);
  };

  // 确认modal
  const onOkHandle = () => {
    console.log('ok~');
    setStaffList(['李斯']);
    console.log(selectedKeys);
    setChooseTreeParam({ ...chooseTreeParam, visible: false });
    setMultiVisible(true);
  };
  useEffect(() => {
    if (chooseTreeParam.visible) {
      setTreeProps({ ...treeProps, checkable: chooseTreeParam.isShowStaff });
      getCorpOrg();
    }
    !chooseTreeParam.visible && onResetHandle();
  }, [chooseTreeParam.visible]);
  useEffect(() => {
    treeData.length && generateList(treeData);
  }, [treeData, searchValue]);
  return (
    <Modal
      width={'auto'}
      className={style.modalWrap}
      title={chooseTreeParam.title}
      visible={chooseTreeParam.visible}
      centered={true}
      closeIcon={<Icon className={style.closeIcon} name={'biaoqian_quxiao'} />}
      onCancel={onCancelHandle}
      onOk={onOkHandle}
      destroyOnClose={true}
    >
      <div className={style.treeWrap}>
        <div className={style.tree}>
          <Search className={style.searchTree} placeholder="搜索成员" onSearch={(e) => searchHandle(e)} />
          <Tree
            {...treeProps}
            fieldNames={{ title: 'name', key: 'id', children: 'children' }}
            treeData={loop(treeData)}
            checkedKeys={selectedKeys}
            onExpand={onExpandHandle}
            onCheck={(checked) => onCheckedHandle(checked)}
            onSelect={(selectKeys) => onSelectHandle(selectKeys)}
          />
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
