/**
 * @name routes
 * @author Lester
 * @date 2021-05-07 09:35
 */

import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export interface Menu {
  name: string;
  icon?: string;
  path: string;
  children?: Menu[];
}

export const routes: RouteProps[] = [
  {
    path: '/index',
    component: lazy(() => import('src/pages/Index/Index'))
  },
  // 营销平台
  {
    path: '/marketing/product',
    component: lazy(() => import('src/pages/Marketing/Product/List'))
  },
  {
    path: '/marketing/activity',
    component: lazy(() => import('src/pages/Marketing/Activity/List'))
  },
  {
    path: '/marketing/article',
    component: lazy(() => import('src/pages/Marketing/Article/List'))
  },
  {
    path: '/marketing/poster',
    component: lazy(() => import('src/pages/Marketing/Poster/List'))
  }
];

export const menus: Menu[] = [
  {
    name: '机构管理',
    icon: 'a-bianzu101',
    path: 'seatManage',
    children: [{ name: '账号管理', path: '/index' }]
  },
  {
    name: '营销素材',
    icon: 'icon_daohang_28_yingxiaopingtai',
    path: 'marketing',
    children: [
      {
        name: '文章库',
        path: '/marketing/article'
      },
      {
        name: '海报库',
        path: '/marketing/poster'
      },
      {
        name: '活动库',
        path: '/marketing/activity'
      },
      {
        name: '产品库',
        path: '/marketing/product'
      }
    ]
  }
];
