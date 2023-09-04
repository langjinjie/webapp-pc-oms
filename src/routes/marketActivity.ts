import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const marketActivityRoutes: RouteProps[] = [
  // 奖品中心
  { path: '/prizeCenter', component: lazy(() => import('src/pages/MarketingActivity/PrizeCenter/PrizeCenter')) },
  {
    path: '/prizeCenter/add',
    component: lazy(() => import('src/pages/MarketingActivity/PrizeCenter/AddPrize/AddPrize'))
  },
  {
    path: '/prizeCenter/inventoryManage',
    component: lazy(() => import('src/pages/MarketingActivity/PrizeCenter/InventoryManage/InventoryManage'))
  },
  // 打卡活动
  {
    path: '/checkIn',
    component: lazy(() => import('src/pages/MarketingActivity/CheckInActivity/CheckInActivity'))
  },
  {
    path: '/checkIn/add',
    component: lazy(() => import('src/pages/MarketingActivity/CheckInActivity/Add/Add'))
  },
  // 问答活动
  {
    path: '/questionActivity',
    component: lazy(() => import('src/pages/MarketingActivity/QuestionActivity/QuestionActivity'))
  },
  {
    path: '/questionActivity/add',
    component: lazy(() => import('src/pages/MarketingActivity/QuestionActivity/Add/Add'))
  }
];
