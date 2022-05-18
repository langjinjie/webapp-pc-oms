/**
 * @name company
 * @author Lester
 * @date 2021-12-23 10:54
 */
import http, { HttpFunction } from 'src/utils/http';

/**
 * 查询公司列表
 * @param param
 */
export const queryCompanyList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/list', param);
};

/**
 * 查询公司步骤状态
 * @param param
 */
export const queryCompanyStep: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/open/querystep', param);
};

/**
 * 更新公司步骤状态
 * @param param
 */
export const updateCompanyStep: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/open/openstep', param);
};

/**
 * 分步骤更新公司信息
 * @param param
 */
export const saveCompanyInfo: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/open/savecorpinfo', param);
};

/**
 * 查询企业信息接口
 * @param param
 */
export const queryCompanyInfo: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/open/queryCorpStep', param);
};

/**
 * 查询授权url
 * @param param
 */
export const queryAuthUrl: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/open/queryAuthCode', param);
};

/**
 * 查询账号列表
 * @param param
 */
export const queryAccountList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/user/account/list', param);
};

/**
 * 设置管理员
 * @param param
 */
export const setAdminUser: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/user/set/admin', param);
};

/**
 * 查询企业功能
 * @param param
 */
export const queryCompanyFeature: HttpFunction = (param: Object) => {
  /* return Promise.resolve([
    {
      sysType: 1,
      menuId: 1,
      menuName: '后管端',
      children: [
        {
          menuName: '机构管理',
          menuId: '01',
          fullMenuId: '01',
          isLeaf: false,
          children: [
            { menuName: '账号管理', menuId: '0101', fullMenuId: '01-0101', isLeaf: true },
            { menuName: '企业接入', menuId: '0102', fullMenuId: '01-0102', isLeaf: true },
            { menuName: '角色管理', menuId: '0103', fullMenuId: '01-0103', isLeaf: true },
            { menuName: '敏感词管理', menuId: '0104', fullMenuId: '01-0104', isLeaf: true },
            { menuName: '数据免统计', menuId: '0105', fullMenuId: '01-0105', isLeaf: true },
            { menuName: '客户免统计', menuId: '0106', fullMenuId: '01-0106', isLeaf: true }
          ]
        },
        {
          menuName: '营销素材',
          menuId: '02',
          fullMenuId: '02',
          isLeaf: false,
          children: [
            { menuName: '文章库', menuId: '0201', fullMenuId: '02-0201', isLeaf: true },
            { menuName: '海报库', menuId: '0202', fullMenuId: '02-0202', isLeaf: true },
            { menuName: '活动库', menuId: '0203', fullMenuId: '02-0203', isLeaf: true },
            { menuName: '产品库', menuId: '0204', fullMenuId: '02-0204', isLeaf: true },
            { menuName: '首页配置', menuId: '0205', fullMenuId: '02-0205', isLeaf: true },
            { menuName: '公告配置', menuId: '0206', fullMenuId: '02-0206', isLeaf: true }
          ]
        },
        {
          menuName: '运营配置',
          menuId: '03',
          fullMenuId: '03',
          isLeaf: false,
          children: [
            { menuName: '小站配置', menuId: '0301', fullMenuId: '03-0301', isLeaf: true },
            { menuName: '周报配置', menuId: '0302', fullMenuId: '03-0302', isLeaf: true },
            { menuName: '标签配置', menuId: '0303', fullMenuId: '03-0303', isLeaf: true }
          ]
        },
        {
          menuName: '数据统计',
          menuId: '04',
          fullMenuId: '04',
          isLeaf: false,
          children: [{ menuName: '坐席战报', menuId: '0401', fullMenuId: '04-0401', isLeaf: true }]
        },
        {
          menuName: '系统设置',
          menuId: '05',
          fullMenuId: '05',
          isLeaf: false,
          children: [
            { menuName: '分类管理', menuId: '0501', fullMenuId: '05-0501', isLeaf: true },
            { menuName: '标签管理', menuId: '0502', fullMenuId: '05-0502', isLeaf: true }
          ]
        },
        {
          menuName: '销售宝典',
          menuId: '06',
          fullMenuId: '06',
          isLeaf: false,
          children: [
            { menuName: '话术管理', menuId: '0601', fullMenuId: '06-0601', isLeaf: true },
            { menuName: '目录管理', menuId: '0602', fullMenuId: '06-0602', isLeaf: true }
          ]
        },
        {
          menuName: '积分管理',
          menuId: '07',
          fullMenuId: '07',
          isLeaf: false,
          children: [
            { menuName: '积分发放', menuId: '0701', fullMenuId: '07-0701', isLeaf: true },
            { menuName: '积分扣减', menuId: '0702', fullMenuId: '07-0702', isLeaf: true },
            { menuName: '加减积分', menuId: '0703', fullMenuId: '07-0703', isLeaf: true },
            {
              menuName: '抽奖管理',
              menuId: '0704',
              fullMenuId: '07-0704',
              isLeaf: false,
              children: [
                { menuName: '抽奖设置', menuId: '070401', fullMenuId: '07-0704-070401', isLeaf: true },
                { menuName: '大奖发放', menuId: '070402', fullMenuId: '07-0704-070402', isLeaf: true }
              ]
            }
          ]
        }
      ]
    },
    {
      sysType: 2,
      menuId: 2,
      menuName: 'B端',
      children: [
        {
          menuName: '机构管理',
          menuId: '01',
          fullMenuId: '01',
          isLeaf: false,
          children: [
            { menuName: '账号管理', menuId: '0101', fullMenuId: '01-0101', isLeaf: true },
            { menuName: '企业接入', menuId: '0102', fullMenuId: '01-0102', isLeaf: true },
            { menuName: '角色管理', menuId: '0103', fullMenuId: '01-0103', isLeaf: true },
            { menuName: '敏感词管理', menuId: '0104', fullMenuId: '01-0104', isLeaf: true },
            { menuName: '数据免统计', menuId: '0105', fullMenuId: '01-0105', isLeaf: true },
            { menuName: '客户免统计', menuId: '0106', fullMenuId: '01-0106', isLeaf: true }
          ]
        },
        {
          menuName: '营销素材',
          menuId: '02',
          fullMenuId: '02',
          isLeaf: false,
          children: [
            { menuName: '文章库', menuId: '0201', fullMenuId: '02-0201', isLeaf: true },
            { menuName: '海报库', menuId: '0202', fullMenuId: '02-0202', isLeaf: true },
            { menuName: '活动库', menuId: '0203', fullMenuId: '02-0203', isLeaf: true },
            { menuName: '产品库', menuId: '0204', fullMenuId: '02-0204', isLeaf: true },
            { menuName: '首页配置', menuId: '0205', fullMenuId: '02-0205', isLeaf: true },
            { menuName: '公告配置', menuId: '0206', fullMenuId: '02-0206', isLeaf: true }
          ]
        },
        {
          menuName: '运营配置',
          menuId: '03',
          fullMenuId: '03',
          isLeaf: false,
          children: [
            { menuName: '小站配置', menuId: '0301', fullMenuId: '03-0301', isLeaf: true },
            { menuName: '周报配置', menuId: '0302', fullMenuId: '03-0302', isLeaf: true },
            { menuName: '标签配置', menuId: '0303', fullMenuId: '03-0303', isLeaf: true }
          ]
        },
        {
          menuName: '数据统计',
          menuId: '04',
          fullMenuId: '04',
          isLeaf: false,
          children: [{ menuName: '坐席战报', menuId: '0401', fullMenuId: '04-0401', isLeaf: true }]
        },
        {
          menuName: '系统设置',
          menuId: '05',
          fullMenuId: '05',
          isLeaf: false,
          children: [
            { menuName: '分类管理', menuId: '0501', fullMenuId: '05-0501', isLeaf: true },
            { menuName: '标签管理', menuId: '0502', fullMenuId: '05-0502', isLeaf: true }
          ]
        },
        {
          menuName: '销售宝典',
          menuId: '06',
          fullMenuId: '06',
          isLeaf: false,
          children: [
            { menuName: '话术管理', menuId: '0601', fullMenuId: '06-0601', isLeaf: true },
            { menuName: '目录管理', menuId: '0602', fullMenuId: '06-0602', isLeaf: true }
          ]
        },
        {
          menuName: '积分管理',
          menuId: '07',
          fullMenuId: '07',
          isLeaf: false,
          children: [
            { menuName: '积分发放', menuId: '0701', fullMenuId: '07-0701', isLeaf: true },
            { menuName: '积分扣减', menuId: '0702', fullMenuId: '07-0702', isLeaf: true },
            { menuName: '加减积分', menuId: '0703', fullMenuId: '07-0703', isLeaf: true },
            {
              menuName: '抽奖管理',
              menuId: '0704',
              fullMenuId: '07-0704',
              isLeaf: false,
              children: [
                { menuName: '抽奖设置', menuId: '070401', fullMenuId: '07-0704-070401', isLeaf: true },
                { menuName: '大奖发放', menuId: '070402', fullMenuId: '07-0704-070402', isLeaf: true }
              ]
            }
          ]
        }
      ]
    }
  ]); */
  return http.post('/tenacity-admin/api/privilege/corp/menu/list', param);
};
