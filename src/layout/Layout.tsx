/**
 * @name Layout
 * @author Lester
 * @date 2021-05-07 10:35
 */

import React, { useState, useEffect, useContext, Suspense } from 'react';
import { Redirect, Route, withRouter, RouteProps, RouteComponentProps, Switch } from 'react-router-dom';
import classNames from 'classnames';
import { Icon } from 'src/components';
import { Context } from 'src/store';
import { routes, menus, Menu } from 'src/pages/routes';
import { queryUserInfo } from 'src/apis';
import { getCookie } from 'src/utils/base';
import Header from './Header';
import './style.less';

const Routes = withRouter(({ location }) => (
  <Suspense fallback={null}>
    <Switch location={location}>
      {routes.map((item: RouteProps) => (
        <Route key={`rt${item.path}`} {...item} exact />
      ))}
      <Redirect from="/*" to="/index" />
    </Switch>
  </Suspense>
));

const Layout: React.FC<RouteComponentProps> = ({ history }) => {
  const { setUserInfo } = useContext(Context);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const [subMenus, setSubMenus] = useState<Menu[]>([]);
  const [menuIndex, setMenuIndex] = useState<number | null>(null);
  const [subMenuIndex, setSubMenuIndex] = useState<number | null>(null);

  /**
   * 刷新时获取激活菜单
   */
  const initMenu = () => {
    const pathArr: string[] = window.location.pathname.split('/');
    const currentMenu: string = pathArr.length > 3 ? pathArr[pathArr.length - 2] : pathArr[pathArr.length - 1];
    const currentMenuIndex = menus.findIndex((menu: Menu) =>
      menu.children?.some((subMenu: Menu) => subMenu.path.includes(currentMenu))
    );
    if (currentMenuIndex > -1) {
      const subMenus = menus[currentMenuIndex].children || [];
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
    }
  };

  useEffect(() => {
    const token = getCookie('b2632ff42e4a58b67f37c8c1f322b213');
    if (token) {
      initMenu();
      getUserInfo();
    } else if (window.location.pathname !== '/tenacity-oms/login') {
      // history.push('/login');
      console.log(123);
    }
  }, []);

  return (
    <div className="layout-wrap">
      <Header />
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
                  setSubMenuIndex(0);
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
          {subMenus.map((subMenu: Menu, index: number) => (
            <li
              className={classNames('sub-menu-item', {
                'sub-menu-active': subMenuIndex === index
              })}
              key={subMenu.path}
              onClick={() => {
                setSubMenuIndex(index);
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
    </div>
  );
};

export default withRouter(Layout);
