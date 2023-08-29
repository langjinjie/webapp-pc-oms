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

// 1.1、群活码列表接口（新增）
export const getChatGroupLiveCodeList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/org/chatgroup/live/list', param);
};
// 1.2、群活码详情接口（新增）
export const getLiveCodeDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/org/chatgroup/live/detail', param);
};
// 1.2A、群活码使用员工列表接口（新增）
export const getLiveCodeOfStaffList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/org/chatgroup/live/staff/list', param);
};
// 1.3、新建/编辑群活码接口（新增）
export const addChatGroupCode: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/org/chatgroup/live/addoredit', param);
};
// 1.4、删除群活码接口（新增）
export const delChatGroupCode: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/org/chatgroup/live/del', param);
};
// 1.5、复制群活码短链接口（新增）
export const shareCodeShortUrl: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/org/chatgroup/live/shorturl', param);
};

// 1.6、查询客户群列表接口（新增）
export const getChatGroupList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/org/chatgroup/chat/list', param);
};
