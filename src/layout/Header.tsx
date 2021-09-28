/**
 * @name Header
 * @author Lester
 * @date 2021-05-19 11:02
 */

import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';
import { logout } from 'src/apis';
import { setCookie } from 'src/utils/base';
import { InstItem } from 'src/utils/interface';
import './style.less';

const Header: React.FC = () => {
  const { userInfo, instList, setInstList } = useContext(Context);
  const [changeVisible, setChangeVisible] = useState<boolean>(false);

  const history = useHistory();

  const logoutHandle = async () => {
    await logout();
    history.push('/login');
    setCookie('pmsuid', '', -1);
  };

  useEffect(() => {
    if (instList.length === 0) {
      setInstList([
        {
          id: '123',
          name: '年高科技',
          logo: require('src/assets/images/bg.jpg')
        },
        {
          id: '456',
          name: '中国平安寿险上海分公司',
          logo: require('src/assets/images/bg.jpg')
        },
        {
          id: '789',
          name: '中国人寿保险乌鲁木齐第二分公司',
          logo: require('src/assets/images/bg.jpg')
        },
        {
          id: '025',
          name: '年高科技',
          logo: require('src/assets/images/bg.jpg')
        },
        {
          id: '753',
          name: '中国银行',
          logo: require('src/assets/images/bg.jpg')
        },
        {
          id: '952',
          name: '中国人寿保险乌鲁木齐第二分公司',
          logo: require('src/assets/images/bg.jpg')
        }
      ]);
    }

    const callback = () => setChangeVisible(false);

    window.document.addEventListener('click', callback);
    return () => {
      window.document.removeEventListener('click', callback);
    };
  }, []);

  return (
    <header className="header-wrap">
      <img className="header-logo" src={userInfo.corpLogo || require('src/assets/images/company_logo.png')} alt="" />
      <div className="header-info">
        <img className="header-avatar" src={userInfo.avatarUrl} alt="" />
        <span className="user-name">
          {userInfo.userName} {userInfo.roleName} [{userInfo.corpName}]
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
              <li
                key={item.id}
                className="inst-item"
                onClick={() => {
                  setChangeVisible(false);
                }}
              >
                <img className="inst-img" src={item.logo} alt="" />
                <span className="inst-name">{item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
