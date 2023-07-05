import http, { HttpFunction } from 'src/utils/http';

// 1.1【新增】群欢迎语列表接口
export const queryGroupGreetingList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/cligroup/groupwelcome/list', param);
};
export const getGroupGreetingDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/cligroup/groupwelcome/detail', param);
};

// 1.2 群欢迎语新增接口
export const addGroupGreeting: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/cligroup/groupwelcome/add', param);
};

// 1.3【新增】群欢迎语修改接口
export const editGroupGreeting: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/cligroup/groupwelcome/modify', param);
};
// 1.4【新增】群欢迎语删除接口
export const delGroupGreeting: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/cligroup/groupwelcome/del', param);
};
