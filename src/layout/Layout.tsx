/**
 * @name Layout
 * @author Lester
 * @date 2021-05-07 10:35
 */

import React, { useState, useEffect, useContext, Suspense } from 'react';
import { Redirect, Route, withRouter, RouteProps, RouteComponentProps } from 'react-router-dom';
import CacheRoute, { CacheRouteProps, CacheSwitch } from 'react-router-cache-route';
import { Icon, ConfirmModal } from 'src/components';
import { Context } from 'src/store';
import { routes, cacheRoutes, noVerRoutes } from 'src/pages/routes';
import { queryUserInfo, queryMenuList, requestGetMstatus } from 'src/apis';
import { MenuItem } from 'src/utils/interface';
import Header from './Header';
import './style.less';
import { Layout, Menu, MenuProps, Space, Switch } from 'antd';
import { TOKEN_KEY } from 'src/utils/config';
import Update from 'src/pages/Update/Update';

type SiderMenuItem = Required<MenuProps>['items'][number];
function getItem (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: SiderMenuItem[],
  type?: 'group'
): SiderMenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as SiderMenuItem;
}
const MyLayout: React.FC<RouteComponentProps> = ({ history, location }) => {
  const { setUserInfo, setIsMainCorp, setCurrentCorpId, menuList, setMenuList, setBtnList, setBeforePath } =
    useContext(Context);
  const [isCollapse] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [siderMenuList, setSiderMenuList] = useState<SiderMenuItem[]>([]);
  const [selectedKeys, setSelectKeys] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  /**
   * 刷新时获取激活菜单
   */
  const initMenu = (menus = menuList): void => {
    const pathArr: string[] = window.location.pathname.split('/');
    const currentMenu: string = pathArr.length > 3 ? pathArr[pathArr.length - 2] : pathArr[pathArr.length - 1];
    const currentMenuIndex = menus.findIndex((menu: MenuItem) =>
      menu.children?.some((subMenu: MenuItem) => subMenu.path?.includes(currentMenu))
    );
    if (currentMenuIndex > -1) {
      const subMenus = menus[currentMenuIndex].children || [];

      // 根据路径来判断当前页面的按钮
      const currentIndex = subMenus.findIndex((subMenu: MenuItem) => subMenu.path.includes(currentMenu));
      const subIndex = subMenus.findIndex((subMenu: MenuItem) => subMenu.path?.includes(location.pathname));
      // 针对路径和，菜单路径来判断，路由未查找到的时，取菜单的值
      const resIndex = subIndex !== currentIndex && subIndex !== -1 ? subIndex : currentIndex;
      const btnList: MenuItem[] = resIndex > -1 ? subMenus[resIndex].children || [] : [];
      setBtnList(btnList.map((item) => item.path));
    }
  };

  const getMenuList = async () => {
    const res: any = await queryMenuList();
    if (res && res.length > 0) {
      const items = res.map((item: any) =>
        getItem(
          item.menuName,
          item.menuId,
          <Icon className="menu-icon" name={item.menuIcon!} />,
          item.children.map((child: any) => getItem(child.menuName, child.path))
        )
      );
      setSiderMenuList(items);
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
      setIsMainCorp(!res.desc && res.isMainCorp === 1);
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

  //
  const login = async () => {
    // 判断是否处于系统更新中
    const res = await requestGetMstatus();
    // 999 维护中
    if (res === '999') {
      return setUpdating(true);
    }
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      getUserInfo();
      getMenuList();
    } else if (window.location.pathname !== '/tenacity-oms/login') {
      history.push('/login');
    }

    const keyPath = JSON.parse(sessionStorage.getItem('keyPath') || '[]');
    if (keyPath.length === 2) {
      setOpenKeys([keyPath[1]]);
      setSelectKeys([keyPath[0]]);
    }
  };

  useEffect(() => {
    menuList.length > 0 && initMenu();
    return () => {
      setBeforePath(location.pathname);
    };
  }, [location]);
  useEffect(() => {
    if (document?.documentElement || document?.body) {
      document.documentElement.scrollTop = document.body.scrollTop = 0;
    }
  }, [history.location.pathname]);

  useEffect(() => {
    login();
  }, []);

  // submenu keys of first level
  const onOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const onMenuClick = ({ key, keyPath }: any) => {
    sessionStorage.setItem('keyPath', JSON.stringify(keyPath));
    setSelectKeys([key]);
    if (key.indexOf('http') > -1) {
      window.open(key);
    } else {
      history.push(key);
    }
  };

  return (
    <>
      <Space style={{ height: 60, padding: '0 20px', position: 'fixed', zIndex: 999999 }}>
        切换主题
        <Switch
          onChange={(checked) => {
            const htmlEl = document.documentElement;
            htmlEl.setAttribute('data-theme', checked ? 'dark' : 'light');
            htmlEl.setAttribute('style', `color-scheme: ${checked ? 'dark' : 'light'};`);
          }}
        />
      </Space>
      {updating || (
        <Layout className="layout">
          <Layout.Header style={{ position: 'fixed', zIndex: 1000, width: '100%' }}>
            <Header />
          </Layout.Header>
          <Layout.Sider
            trigger={null}
            collapsible
            width={252}
            collapsedWidth={88}
            className={'navWrap'}
            collapsed={isCollapse}
          >
            <Menu
              className="menuWrap"
              mode="inline"
              items={siderMenuList}
              openKeys={openKeys}
              selectedKeys={selectedKeys}
              onClick={onMenuClick}
              onOpenChange={onOpenChange}
            />
          </Layout.Sider>
          <Layout style={{ marginTop: 80, background: '#fff', width: 'auto' }}>
            <Layout.Content>
              <div>{renderRoute()}</div>
            </Layout.Content>
          </Layout>

          <ConfirmModal />
        </Layout>
      )}
      {updating && <Update />}
    </>
  );
};

export default withRouter(MyLayout);
