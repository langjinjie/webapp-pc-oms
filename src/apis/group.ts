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
/**
 * 客户群管理
 */
// 1.1、查询群列表接口
export const queryGroupList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/chat/group/list', param);
};
// 1.2、查询群成员列表接口
export const queryGroupMemberList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/chat/group/members', param);
};
// 1.3、查询群成员统计接口
export const getGroupStatDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/chat/group/statDetail', param);
};
// 1.4、查询群列表下载接口
export const downloadGroupList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/chat/group/list/dload', param, {
    responseType: 'blob',
    timeout: 120000
  });
};
// 1.5、查询群成员列表下载接口
export const downloadGroupMemberList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/corp/chat/group/members/dload', param, {
    responseType: 'blob',
    timeout: 120000
  });
};
