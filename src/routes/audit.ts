import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const auditRoutes: RouteProps[] = [
  {
    path: '/audit/flow',
    component: lazy(() => import('src/pages/Audit/AuditFlow/AuditFlow'))
  },
  {
    path: '/audit/flow/detail',
    component: lazy(() => import('src/pages/Audit/AuditFlow/AuditFlowDetail'))
  }
];
