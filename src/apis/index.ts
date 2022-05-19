/**
 * @name index
 * @author Lester
 * @date 2021-05-20 10:13
 */

import http, { HttpFunction, Void2Promise } from 'src/utils/http';

/**
 * 登录
 * @param param
 */
export const login: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/user/login', param);
};

/**
 * 退出登录
 */
export const logout: Void2Promise = () => {
  return http.post('/tenacity-admin/api/user/logout');
};

/**
 * 查询用户信息
 */
export const queryUserInfo: Void2Promise = () => {
  return http.post('/tenacity-admin/api/user/info');
};

/**
 * 查询机构列表
 */
export const queryInstList: Void2Promise = () => {
  return http.post('/tenacity-admin/api/corp/list');
};

/**
 * 选择机构
 * @param param
 */
export const chooseInst: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/user/selectcorp', param);
};

/**
 * 查询功能模块列表
 */
export const queryFuncList: Void2Promise = () => {
  return http.post('/tenacity-admin/api/bizconfig/func/config/list');
};

/**
 * 查询菜单列表
 */
export const queryMenuList: Void2Promise = () => {
  /* return Promise.resolve([
    {
      menuId: '123',
      menuName: '机构管理',
      menuIcon: 'icon_daohang_28_jigouguanli',
      menuType: 1,
      path: 'companyManage',
      children: [
        {
          menuId: '123bbb',
          menuName: '企业管理',
          menuType: 1,
          path: '/company'
        },
        {
          menuId: '123ccc',
          menuName: '敏感词管理',
          menuType: 1,
          path: '/sensitiveManage'
        },
        {
          menuId: '123ddd',
          menuName: '组织架构管理',
          menuType: 1,
          path: '/organization'
        },
        {
          menuId: '123eee',
          menuName: '数据免统计名单',
          menuType: 1,
          path: '/statistics-free'
        },
        {
          menuId: '123fff',
          menuName: '客户免统计名单',
          menuType: 1,
          path: '/customer-statistics-free'
        },
        {
          menuId: '123ggg',
          menuName: '系统菜单管理',
          menuType: 1,
          path: '/menu'
        }
      ]
    },
    {
      menuId: '456',
      menuName: '营销素材',
      menuIcon: 'icon_daohang_28_yingxiaopingtai',
      menuType: 1,
      path: 'marketing',
      children: [
        {
          menuId: '456aaa',
          menuName: '文章库',
          menuType: 1,
          path: '/marketingArticle'
        },
        {
          menuId: '456bbb',
          menuName: '海报库',
          menuType: 1,
          path: '/marketingPoster'
        },
        {
          menuId: '456ccc',
          menuName: '活动库',
          menuType: 1,
          path: '/marketingActivity'
        },
        {
          menuId: '456ddd',
          menuName: '产品库',
          menuType: 1,
          path: '/marketingProduct'
        },
        {
          menuId: '456eee',
          menuName: '首页配置',
          menuType: 1,
          path: '/marketingIndex'
        },
        {
          menuId: '456fff',
          menuName: '公告配置',
          menuType: 1,
          path: '/notice'
        }
      ]
    },
    {
      menuId: '789',
      menuName: '运营配置',
      menuIcon: 'a-icon_daohang_28_yunyingpeizhi1',
      menuType: 1,
      path: 'operation',
      children: [
        {
          menuId: '456aaa',
          menuName: '小站配置',
          menuType: 1,
          path: '/station'
        },
        {
          menuId: '456bbb',
          menuName: '周报配置',
          menuType: 1,
          path: '/weekly'
        },
        {
          menuId: '456ccc',
          menuName: '标签配置',
          menuType: 1,
          path: '/tagConfig'
        }
      ]
    },
    {
      menuId: 'abc',
      menuName: '数据统计',
      menuIcon: 'icon_daohang_28_shujutongji',
      menuType: 1,
      path: 'statistics',
      children: [
        {
          menuId: '456ccc',
          menuName: '座席战报',
          menuType: 1,
          path: '/seatReport'
        }
      ]
    },
    {
      menuId: 'def',
      menuName: '系统设置',
      menuIcon: 'icon_daohang_28_xitongshezhi',
      menuType: 1,
      path: 'systemSettings',
      children: [
        {
          menuId: '456ccc',
          menuName: '分类管理',
          menuType: 1,
          path: '/categoryManage'
        },
        {
          menuId: '456aaa',
          menuName: '标签管理',
          menuType: 1,
          path: '/tagManage'
        }
      ]
    },
    {
      menuId: 'ghi',
      menuName: '销售宝典',
      menuIcon: 'xiaoshoubaodian',
      menuType: 1,
      path: 'salesCollection',
      children: [
        {
          menuId: '456ccc',
          menuName: '话术管理',
          menuType: 1,
          path: '/speechManage'
        },
        {
          menuId: '456aaa',
          menuName: '目录管理',
          menuType: 1,
          path: '/contentsManage'
        }
      ]
    },
    {
      menuId: 'jkl',
      menuName: '积分管理',
      menuIcon: 'jifenguanli',
      menuType: 1,
      path: 'pointsMall',
      children: [
        {
          menuId: '456ccc',
          menuName: '积分发放',
          menuType: 1,
          path: '/pointsProvide'
        },
        {
          menuId: '456aaa',
          menuName: '积分扣减',
          menuType: 1,
          path: '/pointsDeduction'
        },
        {
          menuId: '456bbb',
          menuName: '加减积分',
          menuType: 1,
          path: '/addSubPoints'
        },
        {
          menuId: '456ccc',
          menuName: '抽奖管理',
          menuType: 1,
          path: '/lotteryManage'
        },
        {
          menuId: '456eee',
          menuName: '专属奖励管理',
          menuType: 1,
          path: '/exclusive'
        }
      ]
    },
    {
      menuId: 'mno',
      menuName: '好友迁移',
      menuIcon: 'a-bianzu101',
      menuType: 1,
      path: 'migration',
      children: [
        {
          menuId: '456ccc',
          menuName: '企微好友',
          menuType: 1,
          path: '/enterprise'
        }
      ]
    },
    {
      menuId: 'pqr',
      menuName: '角色管理',
      menuIcon: 'icon_daohang_28_jigouguanli',
      menuType: 1,
      path: 'roleMange',
      children: [
        {
          menuId: '456ccc',
          menuName: '后管角色管理',
          menuType: 1,
          path: '/roleMangeOms'
        },
        {
          menuId: '456aaa',
          menuName: 'B端角色管理',
          menuType: 1,
          path: '/roleMangeB'
        },
        {
          menuId: '456bbb',
          menuName: 'A端角色管理',
          menuType: 1,
          path: '/roleMangeA'
        }
      ]
    }
  ]); */
  return http.post('/tenacity-admin/api/privilege/menu/list', { sysType: 1 });
};
