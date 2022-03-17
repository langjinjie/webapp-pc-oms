/**
 * @name Layout
 * @author Lester
 * @date 2021-05-07 10:35
 */

import React, { useState, useEffect, useContext, Suspense } from 'react';
import { Redirect, Route, withRouter, RouteProps, RouteComponentProps } from 'react-router-dom';
import CacheRoute, { CacheRouteProps, CacheSwitch } from 'react-router-cache-route';
import classNames from 'classnames';
import { Icon, ConfirmModal } from 'src/components';
import { Context } from 'src/store';
import { routes, menus, Menu, cacheRoutes } from 'src/pages/routes';
import { queryUserInfo } from 'src/apis';
import { getCookie } from 'src/utils/base';
import Header from './Header';
import './style.less';

const Routes = withRouter(({ location }) => {
  const { isMainCorp } = useContext(Context);

  return (
    <Suspense fallback={null}>
      <CacheSwitch location={location}>
        {routes
          .filter(({ onlyMain }) => !onlyMain || isMainCorp)
          .map(({ path, ...props }: RouteProps) => (
            <Route key={`rt${path}`} path={path} {...props} exact />
          ))}
        {cacheRoutes
          .filter(({ onlyMain }) => !onlyMain || isMainCorp)
          .map(({ path, ...props }: CacheRouteProps) => (
            <CacheRoute saveScrollPosition className="cache-route" key={`rt${path}`} path={path} {...props} exact />
          ))}
        <Redirect from="/*" to="/index" />
      </CacheSwitch>
    </Suspense>
  );
});

const Layout: React.FC<RouteComponentProps> = ({ history, location }) => {
  const { isMainCorp, userInfo, setUserInfo, setIsMainCorp, setCurrentCorpId } = useContext(Context);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [subMenus, setSubMenus] = useState<Menu[]>([]);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [subMenuIndex, setSubMenuIndex] = useState<number | null>(null);

  /**
   * 刷新时获取激活菜单
   */
  const initMenu = (isMain: boolean): void => {
    const pathArr: string[] = window.location.pathname.split('/');
    const currentMenu: string = pathArr.length > 3 ? pathArr[pathArr.length - 2] : pathArr[pathArr.length - 1];
    const currentMenuIndex = menus.findIndex((menu: Menu) =>
      menu.children?.some((subMenu: Menu) => subMenu.path.includes(currentMenu))
    );
    if (currentMenuIndex > -1) {
      const subMenus = (menus[currentMenuIndex].children || []).filter(({ onlyMain }) => !onlyMain || isMain);
      console.log('subMenus', subMenus);
      setMenuIndex(currentMenuIndex);
      setSubMenus(subMenus);
      setSubMenuIndex(subMenus.findIndex((subMenu: Menu) => subMenu.path.includes(currentMenu)));
    }
  };

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    const res = await queryUserInfo();
    if (res) {
      setUserInfo(res);
      setIsMainCorp(res.isMainCorp === 1);
      setCurrentCorpId(res.corpId);
      initMenu(res.isMainCorp === 1);
    }
  };

  useEffect(() => {
    Object.keys(userInfo).length > 0 && initMenu(userInfo.isMainCorp);
  }, [location]);

  useEffect(() => {
    const token = getCookie('b2632ff42e4a58b67f37c8c1f322b213');
    if (token) {
      getUserInfo();
    } else if (window.location.pathname !== '/tenacity-oms/login') {
      history.push('/login');
    }
  }, []);

  return (
    <div className="layout-wrap">
      <Header setMenuIndex={setMenuIndex} setSubMenus={setSubMenus} />
      <div className="layout-content">
        <div
          className={classNames('collapse-wrap', isCollapse ? 'is-collapse' : 'is-expand')}
          onClick={() => setIsCollapse((state) => !state)}
        >
          <Icon className="arrow-icon" name={isCollapse ? 'iconfontjiantou2' : 'zuojiantou-copy'} />
        </div>
        <ul className="menu-list">
          {menus.map((menu: Menu, index: number) => (
            <li
              className={classNames('menu-item', {
                'menu-active': menuIndex === index
              })}
              key={menu.path}
              onClick={() => {
                setMenuIndex(index);
                setSubMenuIndex(null);
                setSubMenus(menu.children || []);
                if (menu.children && menu.children.length > 0) {
                  history.push(menu.children[0].path);
                }
              }}
            >
              <Icon className="menu-icon" name={menu.icon!} />
              <span className="menu-name">{menu.name}</span>
            </li>
          ))}
        </ul>
        <ul style={{ display: isCollapse ? 'none' : 'block' }} className="sub-menu-list">
          {subMenus
            .filter(({ onlyMain }) => !onlyMain || isMainCorp)
            .map((subMenu: Menu, index: number) => (
              <li
                className={classNames('sub-menu-item', {
                  'sub-menu-active': subMenuIndex === index
                })}
                key={subMenu.path}
                onClick={() => {
                  console.log(index);
                  history.push(subMenu.path);
                }}
              >
                {subMenu.name}
              </li>
            ))}
        </ul>
        <div className="content-wrap">
          <div className="route-content">
            <Routes />
          </div>
        </div>
      </div>
      <ConfirmModal />
    </div>
  );
};

export default withRouter(Layout);
