/**
 * @name routes
 * @author Lester
 * @date 2021-05-07 09:35
 */

import { lazy } from 'react';
import { CacheRouteProps } from 'react-router-cache-route';
import { RouteProps } from 'react-router-dom';

export interface Menu {
  name: string;
  icon?: string;
  path: string;
  onlyMain?: boolean;
  children?: Menu[];
}

interface expandRoute {
  onlyMain?: boolean;
}

export const routes: (RouteProps & expandRoute)[] = [
  {
    path: '/index',
    component: lazy(() => import('src/pages/Index/Index'))
  },
  {
    path: '/noPermission',
    component: lazy(() => import('src/pages/NoPermission/NoPermission'))
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
    component: lazy(() => import('src/pages/Marketing/Notice/NoticeList'))
  },
  {
    path: '/notice/edit',
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
  // 敏感词管理
  {
    path: '/sensitiveManage',
    component: lazy(() => import('src/pages/OrgManage/SensitiveManage/SensitiveList/SensitiveList'))
  },
  // 添加敏感词
  {
    path: '/sensitiveManage/editWords',
    component: lazy(() => import('src/pages/OrgManage/SensitiveManage/EditWords/EditWords'))
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
  // 标签配置
  {
    path: '/tagConfig',
    component: lazy(() => import('src/pages/Operation/TagConfig/List'))
  },
  {
    path: '/tagConfig/history',
    component: lazy(() => import('src/pages/Operation/TagConfig/HistoryList'))
  },
  // 新增小站配置
  {
    path: '/station/add',
    component: lazy(() => import('src/pages/Operation/AddStationConfig/AddStationConfig'))
  },
  // 系统设置
  {
    path: '/categoryManage',
    component: lazy(() => import('src/pages/SystemSettings/CategoryManage/CategoryManage'))
  },
  {
    path: '/tagManage',
    component: lazy(() => import('src/pages/SystemSettings/TagManage/TagManage'))
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
  },
  // 销售宝典
  {
    path: '/speechManage',
    component: lazy(() => import('src/pages/SalesCollection/SpeechManage/List'))
  },
  {
    path: '/speechManage/edit',
    component: lazy(() => import('src/pages/SalesCollection/SpeechManage/Edit'))
  },
  /**
   * 机构管理->账号管理
   */
  {
    path: '/organization/laod',
    component: lazy(() => import('src/pages/OrgManage/Organization/StaffList/MultiLaod/MultiLaod'))
  },
  {
    path: '/test/video',
    component: lazy(() => import('src/pages/Test/Video/Video'))
  },
  {
    path: '/company',
    component: lazy(() => import('src/pages/OrgManage/Company/Company')),
    onlyMain: true
  },
  {
    path: '/company/feature',
    component: lazy(() => import('src/pages/OrgManage/CompanyFeature/CompanyFeature')),
    onlyMain: true
  },
  {
    path: '/company/access',
    component: lazy(() => import('src/pages/OrgManage/Company/CompanyAccess/CompanyAccess')),
    onlyMain: true
  },

  {
    path: '/menu/edit',
    component: lazy(() => import('src/pages/OrgManage/Menu/Edit'))
  },
  // 坐席详情
  {
    path: '/organization/staff-detail',
    component: lazy(() => import('src/pages/OrgManage/Organization/StaffDetail/StaffDetail'))
  },
  /**
   * 积分商城
   */
  {
    path: '/pointsProvide',
    component: lazy(() => import('src/pages/PointsManage/PointsProvide/PointsProvide'))
  },
  {
    path: '/pointsDeduction',
    component: lazy(() => import('src/pages/PointsManage/PointsDeduction/List'))
  },
  // 积分扣除记录
  {
    path: '/pointsDeduction/record',
    component: lazy(() => import('src/pages/PointsManage/PointsDeduction/Record/Record'))
  },
  {
    path: '/addSubPoints',
    component: lazy(() => import('src/pages/PointsManage/AddSubPoints/List'))
  },
  {
    path: '/addSubPoints/record',
    component: lazy(() => import('src/pages/PointsManage/AddSubPoints/Record/Record'))
  },
  // 抽奖管理
  {
    path: '/lotteryManage',
    component: lazy(() => import('src/pages/PointsManage/LotteryManage/LotteryManage'))
  },
  // 角色管理
  {
    path: '/roleMangeOms',
    component: lazy(() => import('src/pages/RoleManage/RoleOms/List/List'))
  },
  {
    path: '/roleMangeOms/add',
    component: lazy(() => import('src/pages/RoleManage/RoleOms/Add/Add'))
  },
  {
    path: '/roleMangeB',
    component: lazy(() => import('src/pages/RoleManage/RoleB/List/List'))
  },
  {
    path: '/roleMangeB/add',
    component: lazy(() => import('src/pages/RoleManage/RoleB/Add/Add'))
  },
  {
    path: '/roleMangeA',
    component: lazy(() => import('src/pages/RoleManage/RoleA/List/List'))
  },
  {
    path: '/roleMangeA/add',
    component: lazy(() => import('src/pages/RoleManage/RoleA/Add/Add'))
  },
  // 好友迁移
  {
    path: '/enterprise',
    component: lazy(() => import('src/pages/Migration/EnterpriseWeChat/List/List'))
  },
  {
    path: '/personal',
    component: lazy(() => import('src/pages/Migration/PersonalWeChat/AddTask/AddTask'))
  },
  {
    path: '/exclusive',
    component: lazy(() => import('src/pages/PointsManage/Exclusive/List'))
  }
];

// 缓存路由
export const cacheRoutes: (CacheRouteProps & expandRoute)[] = [
  // 系统菜单管理
  {
    path: '/menu',
    component: lazy(() => import('src/pages/OrgManage/Menu/List'))
  },
  {
    path: '/organization',
    component: lazy(() => import('src/pages/OrgManage/Organization/Organization'))
  },
  {
    path: '/contentsManage',
    component: lazy(() => import('src/pages/SalesCollection/ContentsManage/ContentsManage'))
  },

  // 免统计
  {
    path: '/statistics-free',
    component: lazy(() => import('src/pages/OrgManage/StatisticsFree/List'))
  },
  {
    path: '/customer-statistics-free',
    component: lazy(() => import('src/pages/OrgManage/CustomerStatisticsFree'))
  },

  // 好友迁移
  {
    path: '/enterprise/addTask',
    component: lazy(() => import('src/pages/Migration/EnterpriseWeChat/AddTask/AddTask'))
  },
  {
    path: '/personal/addTask',
    component: lazy(() => import('src/pages/Migration/PersonalWeChat/AddTask/AddTask'))
  }
];

export const menus: Menu[] = [
  {
    name: '机构管理',
    icon: 'icon_daohang_28_jigouguanli',
    path: 'seatManage',
    children: [
      {
        name: '账号管理',
        // path: '/orgManage'
        path: '/orgManage/detail'
      },
      {
        name: '企业接入',
        path: '/company',
        onlyMain: true
      },
      {
        name: '敏感词管理',
        path: '/sensitiveManage'
      },
      {
        name: '组织架构管理',
        path: '/organization'
      },
      {
        name: '数据免统计名单',
        path: '/statistics-free'
      },
      {
        name: '客户免统计名单',
        path: '/customer-statistics-free'
      },
      {
        name: '系统菜单管理',
        path: '/menu'
      }
    ]
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
        name: '公告配置',
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
  },
  {
    name: '销售宝典',
    icon: 'xiaoshoubaodian',
    path: 'salesCollection',
    children: [
      { name: '话术管理', path: '/speechManage' },
      { name: '目录管理', path: '/contentsManage' }
    ]
  },
  {
    name: '积分管理',
    icon: 'jifenguanli',
    path: 'pointsMall',
    children: [
      { name: '积分发放', path: '/pointsProvide' },
      { name: '积分扣减', path: '/pointsDeduction' },
      { name: '加减积分', path: '/addSubPoints' },
      { name: '抽奖管理', path: '/lotteryManage' },
      { name: '专属奖励管理', path: '/exclusive' }
    ]
  },
  {
    name: '好友迁移',
    icon: 'a-bianzu101',
    path: 'migration',
    children: [
      { name: '企微好友', path: '/enterprise' }
      // { name: '个微好友', path: '/personal' }
    ]
  },
  // {
  //   name: '好友迁移',
  //   icon: 'a-bianzu101',
  //   path: 'migration',
  //   children: [
  //     { name: '企微好友', path: '/enterprise' },
  //     { name: '个位好友', path: '/personal' }
  //   ]
  // },

  {
    name: '角色管理',
    icon: 'icon_daohang_28_jigouguanli',
    path: 'roleMange',
    children: [
      { name: '后管角色管理', path: '/roleMangeOms' },
      { name: 'B端角色管理', path: '/roleMangeB' },
      { name: 'A端角色管理', path: '/roleMangeA' }
    ]
  }
];

if (process.env.NODE_ENV === 'development') {
  menus.push({
    name: '调试',
    icon: 'icon_daohang_28_xitongshezhi',
    path: 'test',
    children: [
      {
        name: '视频',
        path: '/test/video'
      },
      {
        name: '企业接入',
        path: '/company',
        onlyMain: true
      }
    ]
  });
}
