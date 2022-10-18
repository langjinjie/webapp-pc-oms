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
  children?: Menu[];
}

export const noVerRoutes: RouteProps[] = [
  {
    path: '/demo',
    component: lazy(() => import('src/pages/Demo/MapDemo'))
  },
  {
    path: '/',
    component: lazy(() => import('src/pages/Index/Index'))
  },
  {
    path: '/index',
    component: lazy(() => import('src/pages/Index/Index'))
  },
  {
    path: '/noPermission',
    component: lazy(() => import('src/pages/NoPermission/NoPermission'))
  },
  {
    path: '/strategyTask/edit',
    component: lazy(() => import('src/pages/Task/StrategyTask/Edit'))
  },
  {
    path: '/taskScene/detail',
    component: lazy(() => import('src/pages/Task/SceneTask/Detail/Detail'))
  },
  // 热门专题配置
  {
    path: '/marketingHot/edit',
    component: lazy(() => import('src/pages/Marketing/HotSpecial/Edit/Edit'))
  },
  {
    path: '/marketingMoment/edit',
    component: lazy(() => import('src/pages/Marketing/Moment/Edit'))
  }
];

export const routes: RouteProps[] = [
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
  {
    path: '/marketingHot',
    component: lazy(() => import('src/pages/Marketing/HotSpecial/List'))
  },
  {
    path: '/marketingMoment',
    component: lazy(() => import('src/pages/Marketing/Moment/List'))
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
  // {
  //   path: '/speechManage',
  //   component: lazy(() => import('src/pages/SalesCollection/SpeechManage/List'))
  // },
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
    component: lazy(() => import('src/pages/OrgManage/Company/Company'))
  },
  {
    path: '/company/feature',
    component: lazy(() => import('src/pages/OrgManage/CompanyFeature/CompanyFeature'))
  },
  {
    path: '/company/access',
    component: lazy(() => import('src/pages/OrgManage/Company/CompanyAccess/CompanyAccess'))
  },

  {
    path: '/menu/edit',
    component: lazy(() => import('src/pages/SystemSettings/Menu/Edit'))
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
    path: '/enterprise/staffList',
    component: lazy(() => import('src/pages/Migration/EnterpriseWeChat/List/StaffList'))
  },
  {
    path: '/personal',
    component: lazy(() => import('src/pages/Migration/PersonalWeChat/List/List'))
  },
  {
    path: '/exclusive',
    component: lazy(() => import('src/pages/PointsManage/Exclusive/List'))
  },
  // 用户组管理
  {
    path: '/userGroup',
    component: lazy(() => import('src/pages/OrgManage/UserGroup/UserGroup'))
  },
  {
    path: '/userGroup/add',
    component: lazy(() => import('src/pages/OrgManage/UserGroup/components/AddGroup/AddGroup'))
  },
  // 抽奖配置
  {
    path: '/lotteryConfig',
    component: lazy(() => import('src/pages/PointsManage/LotteryConfig/ActivityList'))
  },
  {
    path: '/lotteryConfig/prize',
    component: lazy(() => import('src/pages/PointsManage/LotteryConfig/LotteryConfig'))
  },
  {
    path: '/lotteryConfig/prizeAdd',
    component: lazy(() => import('src/pages/PointsManage/LotteryConfig/PrizeEdit'))
  },
  // 中奖管理
  {
    path: '/winManage',
    component: lazy(() => import('src/pages/PointsManage/WinManage/WinManage'))
  },
  // 数据看板
  {
    path: '/dashboard',
    component: lazy(() => import('src/pages/Dashboard/index'))
  },

  {
    path: '/dashboardList/:id/detail',
    component: lazy(() => import('src/pages/Dashboard/Detail/Detail'))
  },

  // 任务系统
  {
    path: '/strategyManage/detail',
    component: lazy(() => import('src/pages/Task/StrategyManage/Detail'))
  },
  {
    path: '/strategyManage/tmpList',
    component: lazy(() => import('src/pages/Task/StrategyManage/TmlManage/Manage'))
  },
  // 在职分配
  {
    path: '/onjob',
    component: lazy(() => import('src/pages/StaffManage/OnJob/List'))
  },
  {
    path: '/onjob/record',
    component: lazy(() => import('src/pages/StaffManage/OnJob/record'))
  },
  // 离职继承
  {
    path: '/resign',
    component: lazy(() => import('src/pages/StaffManage/Resign/List'))
  },
  {
    path: '/resign/record',
    component: lazy(() => import('src/pages/StaffManage/Resign/record'))
  },
  // 打卡与激励任务
  {
    path: '/pointsConfig/edit',
    component: lazy(() => import('src/pages/PointsManage/PointsConfig/Edit/Edit'))
  },
  {
    path: '/pointsConfig/record',
    component: lazy(() => import('src/pages/PointsManage/PointsConfig/Record/Record'))
  },
  // 删人提醒
  {
    path: '/deletionReminder/clientDetail',
    component: lazy(() => import('src/pages/Exception/DeletionReminder/ClientDetail/ClientDetail'))
  },
  {
    path: '/deletionReminder/chatLog',
    component: lazy(() => import('src/pages/Exception/DeletionReminder/ChatLog/ChatLog'))
  },
  // 登录异常
  {
    path: '/loginException',
    component: lazy(() => import('src/pages/Exception/LoginException/List'))
  },
  {
    path: '/taskRule',
    component: lazy(() => import('src/pages/Task/RuleManage/List/List'))
  },
  {
    path: '/taskNode',
    component: lazy(() => import('src/pages/Task/NodeManage/List'))
  }
];

// 缓存路由
export const cacheRoutes: CacheRouteProps[] = [
  // 系统菜单管理
  {
    path: '/menu',
    component: lazy(() => import('src/pages/SystemSettings/Menu/List'))
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
  },
  // 数据看板
  {
    path: '/dashboardList/:id',
    component: lazy(() => import('src/pages/Dashboard/List/List'))
  },

  // 任务模块列表页面，开启缓存
  {
    path: '/strategyTask',
    component: lazy(() => import('src/pages/Task/StrategyTask/List'))
  },
  {
    path: '/taskScene',
    component: lazy(() => import('src/pages/Task/SceneTask/List/List'))
  },
  // {
  //   path: '/taskRule',
  //   component: lazy(() => import('src/pages/Task/RuleManage/List/List'))
  // },
  // {
  //   path: '/taskNode',
  //   component: lazy(() => import('src/pages/Task/NodeManage/List'))
  // },
  {
    path: '/strategyManage',
    component: lazy(() => import('src/pages/Task/StrategyManage/StrategyManageList/List'))
  },
  // 销售宝典
  {
    path: '/speechManage',
    component: lazy(() => import('src/pages/SalesCollection/SpeechManage/List'))
  },
  {
    path: '/tabledownload',
    component: lazy(() => import('src/pages/Dashboard/TableDownload/TableDownLoad'))
  },
  // 打卡与激励任务
  {
    path: '/pointsConfig',
    component: lazy(() => import('src/pages/PointsManage/PointsConfig/List/PointsConfig'))
  },
  // 删人提醒
  {
    path: '/deletionReminder',
    component: lazy(() => import('src/pages/Exception/DeletionReminder/List'))
  }
];
