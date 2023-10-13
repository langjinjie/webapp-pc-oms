/**
 * 内容管理路由
 */
import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export const market: RouteProps[] = [
  /**
   * 今日朋友圈
   */
  {
    path: '/todayMoment',
    component: lazy(() => import('src/pages/Marketing/TodayMoment/TodayMoment'))
  },
  // 创建今日朋友圈
  {
    path: '/todayMoment/add',
    component: lazy(() => import('src/pages/Marketing/TodayMoment/AddMoment/AddMoment'))
  },
  // 机构渠道维护
  {
    path: '/channelManage',
    component: lazy(() => import('src/pages/Marketing/Channel/ChannelList'))
  }
];
