/**
 * @name Layout
 * @author Lester
 * @date 2021-05-07 10:35
 */

import React, { useState, useEffect, useContext, Suspense } from 'react';
import { Redirect, Route, withRouter, RouteProps, RouteComponentProps, NavLink } from 'react-router-dom';
import CacheRoute, { CacheRouteProps, CacheSwitch } from 'react-router-cache-route';
import classNames from 'classnames';
import { Icon, ConfirmModal } from 'src/components';
import { Context } from 'src/store';
import { routes, cacheRoutes, noVerRoutes } from 'src/pages/routes';
import { queryUserInfo, queryMenuList } from 'src/apis';
import { getCookie } from 'src/utils/base';
import { MenuItem } from 'src/utils/interface';
import Header from './Header';
import './style.less';
import { Affix, message } from 'antd';

const Layout: React.FC<RouteComponentProps> = ({ history, location }) => {
  const { setUserInfo, setIsMainCorp, setCurrentCorpId, menuList, setMenuList, setBtnList } = useContext(Context);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [subMenus, setSubMenus] = useState<MenuItem[]>([]);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  /**
   * 刷新时获取激活菜单
   */
  const initMenu = (menus = menuList): void => {
    const pathArr: string[] = window.location.pathname.split('/');
    const currentMenu: string = pathArr.length > 3 ? pathArr[pathArr.length - 2] : pathArr[pathArr.length - 1];
    const currentMenuIndex = menus.findIndex((menu: MenuItem) =>
      menu.children?.some((subMenu: MenuItem) => subMenu.path.includes(currentMenu))
    );
    if (currentMenuIndex > -1) {
      const subMenus = menus[currentMenuIndex].children || [];
      setMenuIndex(currentMenuIndex);
      setSubMenus(subMenus);

      // 根据路径来判断当前页面的按钮
      const currentIndex = subMenus.findIndex((subMenu: MenuItem) => subMenu.path.includes(currentMenu));
      const subIndex = subMenus.findIndex((subMenu: MenuItem) => subMenu.path.includes(location.pathname));
      // 针对路径和，菜单路径来判断，路由未查找到的时，取菜单的值
      const resIndex = subIndex !== currentIndex && subIndex !== -1 ? subIndex : currentIndex;
      const btnList: MenuItem[] = resIndex > -1 ? subMenus[resIndex].children || [] : [];
      setBtnList(btnList.map((item) => item.path));
    }
  };

  const getMenuList = async () => {
    const res: any = await queryMenuList();
    if (res && res.length > 0) {
      initMenu(res);
      setMenuList(res);
    } else {
      history.push('/noPermission');
    }
    setLoaded(true);
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
    }
  };

  const renderRoute = () => {
    if (!loaded) {
      return false;
    }
    const auThPaths: string[] = menuList.reduce(
      (res: string[], cur: MenuItem) => res.concat((cur.children || []).map((item) => item.path)),
      []
    );

    return (
      <Suspense fallback={null}>
        <CacheSwitch location={location}>
          {noVerRoutes.map(({ path, ...props }: RouteProps) => (
            <Route key={`rt${path}`} path={path} {...props} exact />
          ))}
          {routes
            .filter(({ path }) => auThPaths.some((val) => (path || '').includes(val)))
            .map(({ path, ...props }: RouteProps) => (
              <Route key={`rt${path}`} path={path} {...props} exact />
            ))}
          {cacheRoutes
            .filter(({ path }) => auThPaths.some((val) => (path || '').includes(val)))
            .map(({ path, ...props }: CacheRouteProps) => (
              <CacheRoute saveScrollPosition className="cache-route" key={`rt${path}`} path={path} {...props} exact />
            ))}
          <Redirect from="/*" to="/noPermission" />
        </CacheSwitch>
      </Suspense>
    );
  };

  useEffect(() => {
    menuList.length > 0 && initMenu();
  }, [location]);
  useEffect(() => {
    if (document?.documentElement || document?.body) {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    }
  }, [history.location.pathname]);

  useEffect(() => {
    const token = getCookie('b2632ff42e4a58b67f37c8c1f322b213');
    if (token) {
      getUserInfo();
      getMenuList();
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
        <Affix offsetTop={80}>
          <ul className="menu-list">
            {menuList.map((menu: MenuItem, index: number) => (
              <li
                className={classNames('menu-item', {
                  'menu-active': menuIndex === index
                })}
                key={menu.menuId}
                onClick={() => {
                  setMenuIndex(index);
                  if (menu.children && menu.children.length > 0) {
                    history.push(((menu.children || [])[0] || {}).path);
                  } else {
                    message.warn('无子级菜单，请联系管理员');
                  }
                }}
              >
                <Icon className="menu-icon" name={menu.menuIcon!} />
                <span className="menu-name">{menu.menuName}</span>
              </li>
            ))}
          </ul>
        </Affix>
        <Affix offsetTop={80}>
          <ul style={{ display: isCollapse ? 'none' : 'block' }} className="sub-menu-list">
            {subMenus.map((subMenu: MenuItem) => (
              <li key={subMenu.menuId}>
                <NavLink to={subMenu.path} activeClassName={'sub-menu-active'} className="sub-menu-item">
                  {subMenu.menuName}
                </NavLink>
              </li>
            ))}
          </ul>
        </Affix>

        <div className="content-wrap">
          <div className="route-content">{renderRoute()}</div>
        </div>
      </div>
      <ConfirmModal />
    </div>
  );
};

export default withRouter(Layout);
