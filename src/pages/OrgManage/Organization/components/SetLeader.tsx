/**
 * @name SetLeader
 * @author Lester
 * @date 2021-12-13 15:20
 */
import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import classNames from 'classnames';
import { Icon, Modal } from 'src/components';
import style from './style.module.less';

interface SetLeaderProps {
  chooseIds: string[];
  visible: boolean;
  onClose: () => void;
  onOk: (ids: string[]) => void;
}

interface UserItem {
  id?: string;
  name?: string;
}

const { Search } = Input;

const SetLeader: React.FC<SetLeaderProps> = ({ chooseIds, visible, onClose, onOk }) => {
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [allUserList, setAllUserList] = useState<UserItem[]>([]);
  const [chooseUser, setChooseUser] = useState<UserItem>({ });

  const onSearch = (val: string) => {
    if (val) {
      setUserList([
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
      setUserList(allUserList);
    }
  };

  useEffect(() => {
    const resList = [{
      id: '123',
      name: '龙春表'
    },
    {
      id: '456',
      name: '林堞雅'
    },
    {
      id: '789',
      name: '周润发'
    }];
    setAllUserList(resList);
    setUserList(resList);
  }, []);

  return (
    <Modal width={620} title="设置上级" visible={visible} onClose={onClose} onOk={() => onOk(chooseIds)}>
      <div className={style.setLeaderWrap}>
        <section className={style.left}>
          <div className={style.inputWrap}>
            <Search
              placeholder="搜索成员"
              onSearch={onSearch}
              enterButton={<Icon className={style.searchIcon} name="icon_common_16_seach" />}
            />
          </div>
          <div className={classNames(style.scrollWrap, 'scroll-strip')}>
            <ul className={style.searchList}>
              {userList.map((item: UserItem) => (
                <li
                  key={item.id}
                  className={classNames(style.searchItem, {
                    [style.active]: item.id === chooseUser.id
                  })}
                  onClick={() => setChooseUser(item)}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section className={style.right}>
          <div className={style.chooseHeader}>已选</div>
          <div className={style.leaderName}>{chooseUser.name}</div>
        </section>
      </div>
    </Modal>
  );
};

export default SetLeader;
