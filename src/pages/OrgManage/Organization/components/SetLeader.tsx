/**
 * @name SetLeader
 * @author Lester
 * @date 2021-12-13 15:20
 */
import React, { useEffect, useState } from 'react';
import { Input, Tree } from 'antd';
import classNames from 'classnames';
import { Icon, Modal } from 'src/components';
import { queryCorpOrg } from 'src/apis/stationConfig';
import style from './style.module.less';

interface SetLeaderProps {
  chooseIds: string[];
  visible: boolean;
  onClose: () => void;
  onOk: (ids: string[]) => void;
}

interface OrganizationItem {
  id?: string;
  name?: string;
  key?: string;
  title?: string;
  isParent?: boolean;
  isLeaf?: boolean;
  index?: number;
  total?: number;
  children?: OrganizationItem[];
}

type Key = string | number;

const { Search } = Input;

const SetLeader: React.FC<SetLeaderProps> = ({ chooseIds, visible, onClose, onOk }) => {
  const [organization, setOrganization] = useState<OrganizationItem[]>([]);
  const [expandIds, setExpandIds] = useState<Key[]>([]);
  const [searchList, setSearchList] = useState<OrganizationItem[]>([]);
  const [displayType, setDisplayType] = useState<number>(0);
  const [chooseNode, setChooseNode] = useState<OrganizationItem>({});

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

  const onSearch = (val: string) => {
    if (val) {
      setDisplayType(1);
      setSearchList([
        {
          id: '123',
          name: '龙春表'
        },
        {
          id: '456',
          name: '林堞雅'
        }
      ]);
    } else {
      setDisplayType(0);
    }
  };

  useEffect(() => {
    initCorpOrgData();
  }, []);

  return (
    <Modal width={620} title="设置上级" visible={visible} onClose={onClose} onOk={() => onOk(chooseIds)}>
      <div className={style.setLeaderWrap}>
        <section className={style.left}>
          <div className={style.inputWrap}>
            <Search
              placeholder="搜索成员、部门"
              onSearch={onSearch}
              enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
            />
          </div>
          <div
            style={{ display: displayType === 0 ? 'block' : 'none' }}
            className={classNames(style.scrollWrap, 'scroll-strip')}
          >
            <Tree
              className={style.treeWrap}
              fieldNames={{ title: 'name', key: 'id' }}
              blockNode
              expandedKeys={expandIds}
              onExpand={(keys) => setExpandIds(keys)}
              treeData={organization}
              selectedKeys={[chooseNode.id || '']}
              onSelect={(selectedKeys, { selectedNodes }) => {
                console.log(selectedNodes);
                if (selectedNodes.length > 0 && !selectedNodes[0].isParent) {
                  setChooseNode(selectedNodes[0]);
                }
              }}
            />
          </div>
          <ul style={{ display: displayType === 1 ? 'block' : 'none' }} className={style.searchList}>
            {searchList.map((item: OrganizationItem) => (
              <li
                key={item.id}
                className={classNames(style.searchItem, {
                  [style.active]: item.id === chooseNode.id
                })}
                onClick={() => setChooseNode(item)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </section>
        <section className={style.right}>
          <div className={style.chooseHeader}>已选</div>
          <div className={style.leaderName}>{chooseNode.name}</div>
        </section>
      </div>
    </Modal>
  );
};

export default SetLeader;
