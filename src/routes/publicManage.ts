import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const publicManage: RouteProps[] = [
  {
    path: '/salesLeads',
    component: lazy(() => import('src/pages/PublicManage/SalesLead/SalesLead'))
  },
  //  活动预约
  {
    path: '/activityReservation',
    component: lazy(() => import('src/pages/PublicManage/ActivityReservation/ActivityReservation'))
  },
  // 新增活动预约
  {
    path: '/activityReservation/add',
    component: lazy(() => import('src/pages/PublicManage/ActivityReservation/AddActivity/AddActivity'))
  }
];
