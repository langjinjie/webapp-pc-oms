/**
 * @name routes
 * @author Lester
 * @date 2021-05-07 09:35
 */

import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';

export interface Menu {
  name: string;
  icon?: string;
  path: string;
  children?: Menu[];
}

export const routes: RouteProps[] = [
  {
    path: '/index',
    component: lazy(() => import('src/pages/Index/Index'))
  },
  // 营销平台
  {
    path: '/marketingProduct',
    component: lazy(() => import('src/pages/Marketing/Product/List'))
  },
  {
    path: '/marketingProduct/edit',
    component: lazy(() => import('src/pages/Marketing/Product/EditGoods'))
  },
  {
    path: '/marketingProduct/edit-choiceness',
    component: lazy(() => import('src/pages/Marketing/Product/EditChoiceness'))
  },
  {
    path: '/marketingActivity',
    component: lazy(() => import('src/pages/Marketing/Activity/List'))
  },
  {
    path: '/marketingActivity/Edit',
    component: lazy(() => import('src/pages/Marketing/Activity/Edit'))
  },
  {
    path: '/marketingArticle',
    component: lazy(() => import('src/pages/Marketing/Article/List'))
  },
  {
    path: '/marketingArticle/edit',
    component: lazy(() => import('src/pages/Marketing/Article/Edit'))
  },
  {
    path: '/marketingArticle/editGuide',
    component: lazy(() => import('src/pages/Marketing/Article/Guide'))
  },
  {
    path: '/marketingPoster',
    component: lazy(() => import('src/pages/Marketing/Poster/List'))
  },
  {
    path: '/marketingPoster/edit',
    component: lazy(() => import('src/pages/Marketing/Poster/Edit'))
  },
  // 首页配置
  {
    path: '/marketingIndex',
    component: lazy(() => import('src/pages/Marketing/Index/Index'))
  },
  {
    path: '/notice',
    component: lazy(() => import('src/pages/Marketing/Notice/Notice'))
  },
  /**
   * 机构管理->账号管理
   */
  {
    path: '/orgManage',
    component: lazy(() => import('src/pages/OrgManage/AccountManage/CorpList/CorpList'))
  },
  // 员工列表
  {
    path: '/orgManage/detail',
    component: lazy(() => import('src/pages/OrgManage/AccountManage/StaffList/StaffList'))
  },
  // 座席战报
  {
    path: '/seatReport',
    component: lazy(() => import('src/pages/Statistics/SeatReport/SeatReport'))
  },
  // 小站配置
  {
    path: '/station',
    component: lazy(() => import('src/pages/Operation/StationConfig/StationConfig'))
  },
  {
    path: '/tagConfig',
    component: lazy(() => import('src/pages/Operation/TagConfig/List'))
  },
  // 新增小站配置
  {
    path: '/station/add',
    component: lazy(() => import('src/pages/Operation/AddStationConfig/AddStationConfig'))
  },
  // 系统设置
  {
    path: '/categoryManage',
    component: lazy(() => import('src/pages/SystemSettings/categoryManage/categoryManage'))
  },
  {
    path: '/tagManage',
    component: lazy(() => import('src/pages/SystemSettings/tagManage/tagManage'))
  },
  // 周报配置
  {
    path: '/weekly',
    component: lazy(() => import('src/pages/Operation/WeeklyConfig/WeeklyConfig'))
  },
  // 新增周报配置
  {
    path: '/weekly/add',
    component: lazy(() => import('src/pages/Operation/AddWeeklyConfig/AddWeeklyConfig'))
  }
];

export const menus: Menu[] = [
  {
    name: '机构管理',
    icon: 'icon_daohang_28_jigouguanli',
    path: 'seatManage',
    children: [{ name: '账号管理', path: '/orgManage' }]
  },
  {
    name: '营销素材',
    icon: 'icon_daohang_28_yingxiaopingtai',
    path: 'marketing',
    children: [
      {
        name: '文章库',
        path: '/marketingArticle'
      },
      {
        name: '海报库',
        path: '/marketingPoster'
      },
      {
        name: '活动库',
        path: '/marketingActivity'
      },
      {
        name: '产品库',
        path: '/marketingProduct'
      },
      {
        name: '首页配置',
        path: '/marketingIndex'
      },
      {
        name: '上新通知',
        path: '/notice'
      }
    ]
  },
  {
    name: '运营配置',
    icon: 'a-icon_daohang_28_yunyingpeizhi1',
    path: 'operation',
    children: [
      {
        name: '小站配置',
        path: '/station'
      },
      {
        name: '周报配置',
        path: '/weekly'
      },
      {
        name: '标签配置',
        path: '/tagConfig'
      }
    ]
  },
  {
    name: '数据统计',
    icon: 'icon_daohang_28_shujutongji',
    path: 'statistics',
    children: [
      {
        name: '座席战报',
        path: '/seatReport'
      }
    ]
  },
  {
    name: '系统设置',
    icon: 'icon_daohang_28_xitongshezhi',
    path: 'systemsettings',
    children: [
      { name: '分类管理', path: '/categoryManage' },
      { name: '标签管理', path: '/tagManage' }
    ]
  }
];
