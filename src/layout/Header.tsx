/**
 * @name Header
 * @author Lester
 * @date 2021-05-19 11:02
 */

import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';
import { logout } from 'src/apis';
import { setCookie } from 'src/utils/base';
import './style.less';

const Header: React.FC = () => {
  const { userInfo } = useContext(Context);
  const history = useHistory();

  const logoutHandle = async () => {
    await logout();
    history.push('/login');
    setCookie('pmsuid', '', -1);
  };

  return (
    <header className="header-wrap">
      <img className="header-logo" src={userInfo.corpLogo || require('src/assets/images/company_logo.png')} alt="" />
      <div className="header-info">
        <img className="header-avatar" src={userInfo.avatarUrl} alt="" />
        <span className="user-name">
          {userInfo.userName} {userInfo.roleName} [{userInfo.corpName}]
        </span>
        <span className="logout-btn" onClick={() => logoutHandle()}>
          退出
        </span>
      </div>
    </header>
  );
};

export default Header;
