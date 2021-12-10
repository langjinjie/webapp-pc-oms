/**
 * @name Organization
 * @author Lester
 * @date 2021-12-10 10:36
 */
import React, { useEffect, useState } from 'react';
import { Input, Tree } from 'antd';
import classNames from 'classnames';
import { Icon } from 'src/components';
import { queryCorpOrg } from 'src/apis/stationConfig';
import StaffList from './StaffList/StaffList';
import style from './style.module.less';

const { Search } = Input;

interface OrganizationItem {
  id: string;
  name: string;
  key: string;
  title?: string;
  isLeaf?: boolean;
  children?: OrganizationItem[]
}

interface PositionValue {
  left: number;
  top: number;
}

type Key = string | number;

const Organization: React.FC = () => {
  const [organization, setOrganization] = useState<OrganizationItem[]>([]);
  const [expandIds, setExpandIds] = useState<Key []>([]);
  const [position, setPosition] = useState<PositionValue>({ left: 0, top: 0 });
  const [showDepart, setShowDepart] = useState<boolean>(false);

  const handlePosition = (x: number, y: number) => {
    console.log(x, y);
    setPosition({
      left: x,
      top: y
    });
  };

  /**
   * 获取组织架构
   * @param parentId
   */
  const getCorpOrgData = async (parentId?: string) => {
    return await queryCorpOrg({ parentId });
  };

  /**
   * 获取组织架构初始数据
   */
  const initCorpOrgData = async () => {
    const res: any = await getCorpOrgData();
    if (res && res.length > 0) {
      setOrganization(res);
      setExpandIds([res[0].id]);
    }
  };

  const hideDepart = () => setShowDepart(false);

  useEffect(() => {
    initCorpOrgData();

    window.addEventListener('click', hideDepart);

    return () => {
      window.removeEventListener('click', hideDepart);
    };
  }, []);

  return (
    <div className={style.wrap}>
      <section className={classNames(style.left, 'scroll-strip')}>
        <div className={style.inputWrap}>
          <Search
            placeholder="搜索成员、部门"
            onSearch={(val) => console.log(val)}
            enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
          />
        </div>
        <Tree
          className={style.treeWrap}
          fieldNames={{ title: 'name', key: 'id' }}
          blockNode
          expandedKeys={expandIds}
          onExpand={(keys => setExpandIds(keys))}
          treeData={organization}
          titleRender={(node) => (
            <div className={style.nodeItem}>
              {node.name}
              <Icon
                className={style.dotIcon}
                name="diandian"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePosition(e.clientX, e.clientY);
                  setShowDepart(true);
                }}
              />
            </div>
          )}
          onSelect={(selectedKeys) => {
            console.log(selectedKeys);
          }}
        />
      </section>
      <div className={style.right}>
        <StaffList />
      </div>
      <ul
        style={{ ...position, display: showDepart ? 'block' : 'none' }}
        className={style.departmentOperation}
        onClick={(e) => e.stopPropagation()}
      >
        <li>部门ID：123</li>
        <li>添加子部门</li>
        <li>修改名称</li>
        <li>设置上级</li>
        <li>删除</li>
        <li>上移</li>
        <li>下移</li>
      </ul>
    </div>
  );
};

export default Organization;
