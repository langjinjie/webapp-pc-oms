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
  return http.post('/message_business/index/user_login', param);
};

/**
 * 退出登录
 */
export const logout: Void2Promise = () => {
  return http.get('/message_business/index/logout');
};

/**
 * 查询用户信息
 */
export const queryUserInfo: () => Promise<any> = () => {
  return http.get('/message_business/api/system_auth/privileges');
};
