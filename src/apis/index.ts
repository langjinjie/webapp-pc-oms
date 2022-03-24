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
