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
  return http.post('/tenacity-admin/api/privilege/corp/menu/list', param);
};

/**
 * 一键复制企业功能权限
 * @param param
 */
export const copyCompanyFeature: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/privilege/corp/menu/copy', param);
};
export const uploadCompanyMenu: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/privilege/role/menu/import', param);
};
