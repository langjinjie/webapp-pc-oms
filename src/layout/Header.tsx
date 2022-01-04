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

interface IIndexProps {
  setMenuIndex: (param: any) => void;
  setSubMenus: (param: any) => void;
}

interface EnvName {
  [key: string]: string;
}

const Header: React.FC<IIndexProps> = ({ setMenuIndex, setSubMenus }) => {
  const { userInfo, instList, setInstList } = useContext(Context);
  const [changeVisible, setChangeVisible] = useState<boolean>(false);

  const history = useHistory();

  const envNames: EnvName = {
    dev: '测试',
    uat: 'UAT',
    www: '生产',
    local: '本地'
  };

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
    sessionStorage.removeItem('tagOptions');
    if (res) {
      // window.location.reload();
      window.location.href = window.location.origin + '/tenacity-oms/orgManage'; // 切换机构强行跳转到机构列表
    }
  };

  const getEnvName = () => {
    const env: string = (window.location.origin.match(/(?<=\/\/)[a-zA-Z]+(?=\.)/) || ['local'])[0];
    return envNames[env] || '本地';
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
      <div className="header-logo-wrap">
        <img
          className="header-logo"
          src={require('src/assets/images/corp_logo.png')}
          alt=""
          onClick={() => {
            history.push('/index');
            setMenuIndex(null);
            setSubMenus([]);
          }}
        />
        <span>({getEnvName()}环境)</span>
      </div>
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
          切换机构
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
