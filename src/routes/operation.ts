import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const operationRoutes: RouteProps[] = [
  {
    path: '/messagestop',
    component: lazy(() => import('src/pages/Operation/Message/MessageStop/MessageStop'))
  },
  {
    path: '/messagestop/detail',
    component: lazy(() => import('src/pages/Operation/Message/MessageDetail/MessageDetail'))
  }
];
