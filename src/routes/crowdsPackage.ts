/* 分群管理 */

import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

/**
 * 分群管理
 */
export const crowdsManage: RouteProps[] = [
  {
    path: '/tagCrowds',
    component: lazy(() => import('src/pages/CrowdsManage/TagCrowds/TagCrowdsList'))
  },
  {
    path: '/tagCrowds/detail',
    component: lazy(() => import('src/pages/CrowdsManage/TagCrowds/CrowdsDetail/CrowdsDetail'))
  },
  {
    path: '/tagCrowds/create',
    component: lazy(() => import('src/pages/CrowdsManage/TagCrowds/CreateCrowds/CreateCrowds'))
  },
  {
    path: '/tagCrowds/download',
    component: lazy(() => import('src/pages/CrowdsManage/TagCrowds/DownloadList/DownloadList'))
  }
];
