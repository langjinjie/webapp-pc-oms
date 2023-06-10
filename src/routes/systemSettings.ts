import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const operationRoutes: RouteProps[] = [
  {
    path: '/tagParsing',
    component: lazy(() => import('src/pages/SystemSettings/TagParsing/TagParsing'))
  }
];
