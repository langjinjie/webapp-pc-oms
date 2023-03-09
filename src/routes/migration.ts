import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const migrationRouters: RouteProps[] = [
  // 欢迎语
  {
    path: '/welcome',
    component: lazy(() => import('src/pages/Migration/Welcome/Welcome'))
  },
  {
    path: '/welcome/add',
    component: lazy(() => import('src/pages/Migration/Welcome/AddWelcome/AddWelcome'))
  }
];
