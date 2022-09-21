import http from 'src/utils/http';

type HttpFunction = (param: Object) => Promise<any>;

/**
 * @@description 异常提醒登录接口
 */
export const requestGetLoginExceptionList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/org/staff/unlogin/list', param);
};
