import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const knowledgeRoutes: RouteProps[] = [
  {
    path: '/knowledge',
    component: lazy(() => import('src/pages/knowledge/List/List'))
  },
  {
    path: '/knowledge/edit',
    component: lazy(() => import('src/pages/knowledge/List/Edit'))
  },

  {
    path: '/knowledge/apply',
    component: lazy(() => import('src/pages/knowledge/Apply/List'))
  },
  {
    path: '/knowledge/apply/detail',
    component: lazy(() => import('src/pages/knowledge/Apply/ApplyDetail'))
  },
  {
    path: '/knowledge/approval',
    component: lazy(() => import('src/pages/knowledge/Approval/List'))
  }
];
