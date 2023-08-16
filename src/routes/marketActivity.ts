import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const marketActivityRoutes: RouteProps[] = [
  { path: '/prizeCenter', component: lazy(() => import('src/pages/MarketingActivity/PrizeCenter/PrizeCenter')) },
  {
    path: '/prizeCenter/add',
    component: lazy(() => import('src/pages/MarketingActivity/PrizeCenter/AddPrize/AddPrize'))
  },
  {
    path: '/prizeCenter/inventoryManage',
    component: lazy(() => import('src/pages/MarketingActivity/PrizeCenter/InventoryManage/InventoryManage'))
  }
];
