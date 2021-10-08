/**
 * @name Header
 * @author Lester
 * @date 2021-05-19 11:02
 */

import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';
import { chooseInst, logout, queryInstList } from 'src/apis';
// import { setCookie } from 'src/utils/base';
import { InstItem } from 'src/utils/interface';
import './style.less';

const Header: React.FC = () => {
  const { userInfo, instList, setInstList } = useContext(Context);
  const [changeVisible, setChangeVisible] = useState<boolean>(false);

  const history = useHistory();

  const logoutHandle = async () => {
    await logout();
    history.push('/login');
    // setCookie('b2632ff42e4a58b67f37c8c1f322b213', '', -1);
  };

  const getInstList = async () => {
    const res: any = await queryInstList();
    if (Array.isArray(res)) {
      setInstList(res);
    }
  };

  const handleChooseInst = async (corpId: string) => {
    const res: any = await chooseInst({ corpId });
    if (res) {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (instList.length === 0) {
      getInstList();
    }

    const callback = () => setChangeVisible(false);

    window.document.addEventListener('click', callback);
    return () => {
      window.document.removeEventListener('click', callback);
    };
  }, []);

  return (
    <header className="header-wrap">
      <img
        className="header-logo"
        src={require('src/assets/images/corp_logo.png')}
        alt=""
        onClick={() => history.push('/index')}
      />
      <div className="header-info">
        <img className="header-avatar" src={userInfo.avatar} alt="" />
        <span className="user-name">
          {userInfo.name} [{userInfo.corpName}]
        </span>
        <span
          className="change-btn"
          onClick={(e) => {
            e.stopPropagation();
            setChangeVisible(true);
          }}
        >
          切换角色
        </span>
        <span className="logout-btn" onClick={() => logoutHandle()}>
          退出
        </span>
        {changeVisible && (
          <ul className="inst-list" onClick={(e) => e.stopPropagation()}>
            {instList.map((item: InstItem) => (
              <li key={item.corpId} className="inst-item" onClick={() => handleChooseInst(item.corpId)}>
                <img className="inst-img" src={item.logo} alt="" />
                <span className="inst-name">{item.corpName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
