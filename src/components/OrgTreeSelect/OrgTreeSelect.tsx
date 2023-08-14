import React, { Key, useEffect, useMemo, useState } from 'react';
import { Tree } from 'antd';
import { IOrganizationItem } from 'src/utils/interface';
import { requestGetDeptList } from 'src/apis/orgManage';
import style from './style.module.less';

interface OrgTreeSelectProps {
  onChange: (val: any) => void;
  selectedKey?: string;
}
const OrgTreeSelect: React.FC<OrgTreeSelectProps> = ({ onChange, selectedKey }) => {
  const [orgList, setOrganization] = useState<IOrganizationItem[]>([]);
  const [expandIds, setExpandIds] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);

  useMemo(() => {
    if (!selectedKey) {
      setSelectedKeys([]);
    }
  }, [selectedKey]);
  /**
   * 格式化数据源
   * @param data
   * @param path
   */
  const formatData = (data: IOrganizationItem[], path?: string[]): IOrganizationItem[] => {
    if (data.length === 0) {
      return [];
    }
    const isNewStaffDepart = Number(data[0].deptId) === -1;
    return data.map((item, index) => ({
      ...item,
      index: isNewStaffDepart ? index - 1 : index,
      total: isNewStaffDepart ? data.length - 1 : data.length,
      path: path || item.path || [],
      children: formatData(item.children || [], [...(path || []), item.deptId!])
    }));
  };

  const updateData = (list: IOrganizationItem[], key: string, children: IOrganizationItem[]): IOrganizationItem[] => {
    return list.map((item) => {
      if (item.deptId === key) {
        return {
          ...item,
          children: formatData((item.children || []).concat(children), [...(item.path || []), item.deptId])
        };
      }
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateData(item.children, key, children)
        };
      }
      return item;
    });
  };

  const onLoadData = async ({ key, children }: any): Promise<void> => {
    if (!children || children?.length === 0) {
      const res: any = await requestGetDeptList({ parentId: key });
      if (res) {
        setOrganization((data) => updateData(data, key, res));
      }
    }
  };

  const initCorpOrgData = async () => {
    const res: any = await requestGetDeptList({});
    if (res && res.length > 0) {
      setOrganization(formatData(res));
    }
  };

  useEffect(() => {
    initCorpOrgData();
  }, []);

  return (
    <div className={style.treeWrap}>
      <Tree
        fieldNames={{ title: 'deptName', key: 'deptId' }}
        blockNode
        expandedKeys={expandIds}
        titleRender={(node) => <div className={style.nodeItem}>{node.deptName}</div>}
        onExpand={(keys) => setExpandIds(keys)}
        treeData={orgList}
        loadData={onLoadData}
        selectedKeys={selectedKeys}
        onSelect={(selectedKeys, { selectedNodes }) => {
          if (selectedKeys.length > 0) {
            setSelectedKeys(selectedKeys);
            if (selectedNodes.length > 0) {
              onChange(selectedNodes[0]);
            }
          }
        }}
      />
    </div>
  );
};

export default OrgTreeSelect;
