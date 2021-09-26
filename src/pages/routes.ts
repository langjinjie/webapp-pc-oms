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
  }
];

export const menus: Menu[] = [
  {
    name: '机构管理',
    icon: 'a-bianzu101',
    path: 'seatManage',
    children: [{ name: '账号管理', path: '/index' }]
  }
];
