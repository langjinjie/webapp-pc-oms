/* 分群管理 */

import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

/**
 * 分群管理
 */
export const crowdsManage: RouteProps[] = [
  {
    path: '/tagPackage',
    component: lazy(() => import('src/pages/CrowdsPackage/TagPackage/PackageList'))
  },
  {
    path: '/tagPackage/detail',
    component: lazy(() => import('src/pages/CrowdsPackage/TagPackage/PackageDetail/PackageDetail'))
  },
  {
    path: '/tagPackage/create',
    component: lazy(() => import('src/pages/CrowdsPackage/TagPackage/CreatePackage/CreatePackage'))
  },
  {
    path: '/tagPackage/download',
    component: lazy(() => import('src/pages/CrowdsPackage/TagPackage/DownloadList/DownloadList'))
  }
];
