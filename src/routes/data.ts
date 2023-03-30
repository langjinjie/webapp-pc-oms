import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const dataRoutes: RouteProps[] = [
  {
    path: '/fetchData',
    component: lazy(() => import('src/pages/Dashboard/FetchData/FetchData'))
  },
  {
    path: '/fetchData/add',
    component: lazy(() => import('src/pages/Dashboard/FetchData/Add'))
  },
  {
    path: '/fetchData/download',
    component: lazy(() => import('src/pages/Dashboard/FetchData/Download'))
  }
];
