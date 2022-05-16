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
  return Promise.resolve([
    {
      adminId: '213sadas',
      userName: 'lester',
      name: '龙春表',
      isAdmin: 1
    },
    {
      adminId: '12314546',
      userName: 'lester1',
      name: '龙春表1',
      isAdmin: 0
    },
    {
      adminId: '213asdasd',
      userName: 'lester2',
      name: '龙春表2',
      isAdmin: 0
    },
    {
      adminId: '123asdsad4sad',
      userName: 'lester3',
      name: '龙春表3',
      isAdmin: 0
    },
    {
      adminId: '213asdas757',
      userName: 'lester4',
      name: '龙春表4',
      isAdmin: 0
    },
    {
      adminId: '123asdasd',
      userName: 'lester5',
      name: '龙春表5',
      isAdmin: 0
    },
    {
      adminId: '123asdasda123g',
      userName: 'lester6',
      name: '龙春表6',
      isAdmin: 0
    },
    {
      adminId: '5554123561254',
      userName: 'lester7',
      name: '龙春表7',
      isAdmin: 0
    },
    {
      adminId: '123123asdsadasd',
      userName: 'lester8',
      name: '龙春表8',
      isAdmin: 0
    }
  ]);
  return http.post('/tenacity-admin/api/user/account/list', param);
};

/**
 * 设置管理员
 * @param param
 */
export const setAdminUser: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/user/set/admin', param);
};
