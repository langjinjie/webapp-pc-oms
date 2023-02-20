import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const knowledgeRoutes: RouteProps[] = [
  {
    path: '/knowledge',
    component: lazy(() => import('src/pages/knowledge/List/List'))
  },
  {
    path: '/knowledge/approval'
  },
  {
    path: '/knowledge/apply'
  }
];
