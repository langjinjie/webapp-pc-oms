/**
 * @name SetLeader
 * @author Lester
 * @date 2021-12-13 15:20
 */
import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';
import classNames from 'classnames';
import { Icon, Modal, Empty } from 'src/components';
import { queryStaffList, searchStaffAndDepart, saveDepartmentLeader } from 'src/apis/organization';
import style from './style.module.less';

interface UserItem {
  staffId?: string;
  staffName?: string;
  userId?: string;
}

interface SetLeaderProps {
  deptId?: string;
  deptType: number;
  visible: boolean;
  onClose: () => void;
  onOk: (leader: UserItem) => void;
  leaderInfo?: UserItem;
}

const { Search } = Input;

const SetLeader: React.FC<SetLeaderProps> = (props) => {
  const { deptId, deptType, leaderInfo, visible, onClose, onOk } = props;
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [allUserList, setAllUserList] = useState<UserItem[]>([]);
  const [chooseUser, setChooseUser] = useState<UserItem>({});
  const [keyword, setKeyword] = useState<string>('');

  const onSearch = async (val: string) => {
    if (val) {
      const res: any = await searchStaffAndDepart({ deptId, keyWords: val, searchType: 2, isDeleted: false });
      if (res) {
        setUserList(res.staffList || []);
      }
    } else {
      setUserList(allUserList);
    }
  };

  const getStaffList = async () => {
    const res: any = await queryStaffList({ deptId, deptType, queryType: 0 });
    if (res) {
      const resList = res.list || [];
      setAllUserList(resList);
      setUserList(resList);
      if (leaderInfo?.staffId) {
        setChooseUser(resList.find((item: UserItem) => item.staffId === leaderInfo?.staffId) || {});
      } else if (resList.length > 0) {
        setChooseUser(resList[0]);
      } else {
        setChooseUser({});
      }
    }
  };

  /**
   * 保存
   */
  const onSave = async () => {
    const res: any = await saveDepartmentLeader({ staffId: chooseUser.staffId, deptId });
    if (res) {
      onClose();
      onOk(chooseUser);
      message.success('设置成功!');
    }
  };

  useEffect(() => {
    if (visible) {
      getStaffList();
    } else {
      setAllUserList([]);
      setUserList([]);
      setChooseUser({});
      setKeyword('');
    }
  }, [visible]);

  return (
    <Modal width={620} title="设置上级" visible={visible} onClose={onClose} onOk={onSave}>
      <div className={style.setLeaderWrap}>
        <section className={style.left}>
          <div className={style.inputWrap}>
            <Search
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索成员"
              onSearch={onSearch}
              enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
            />
          </div>
          <div className={classNames(style.scrollWrap, 'scroll-strip')}>
            {userList.length === 0 && <Empty />}
            <ul className={style.searchList}>
              {userList.map((item: UserItem) => (
                <li
                  key={item.staffId}
                  className={classNames(style.searchItem, {
                    [style.active]: item.staffId === chooseUser.staffId
                  })}
                  onClick={() => setChooseUser(item)}
                >
                  {item.staffName} ({item.userId})
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className={style.right}>
          <div className={style.chooseHeader}>已选</div>
          {chooseUser.staffId && (
            <div className={style.leaderName}>
              {chooseUser.staffName} ({chooseUser.userId})
              <Icon className={style.closeIcon} name="guanbi" onClick={() => setChooseUser({})} />
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
};

export default SetLeader;
