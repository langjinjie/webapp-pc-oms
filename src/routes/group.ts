import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const group: RouteProps[] = [
  // 社群管理
  {
    path: '/customergroup',
    component: lazy(() => import('src/pages/Group/CustomerGroup/CustomerGroup'))
  },
  {
    path: '/customergroup/member',
    component: lazy(() => import('src/pages/Group/CustomerGroup/GroupMember/GroupMember'))
  },
  // 群欢迎语
  {
    path: '/groupgreeting',
    component: lazy(() => import('src/pages/Group/GroupGreeting/GroupGreeting'))
  },
  {
    path: '/groupgreeting/edit',
    component: lazy(() => import('src/pages/Group/GroupGreeting/Edit/Edit'))
  },
  // 社群打卡
  {
    path: '/groupclock',
    component: lazy(() => import('src/pages/Group/GroupClock/GroupClock'))
  }
];
