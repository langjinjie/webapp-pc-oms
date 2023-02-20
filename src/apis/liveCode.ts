import http, { HttpFunction, Void2Promise } from 'src/utils/http';

/**
 * @description 1.群活码列表接口
 * @param param
 */
export const requestGetGroupLiveCodeList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/group/live/list', param);
};

/**
 * @description 2.群活码详情接口
 * @param param
 */
export const requestGetGroupLiveCodeDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/group/live/detail', param);
};

/**
 * @description 3.群活码编辑接口
 * @param param
 */
export const requestEditGroupLiveCode: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/group/live/edit', param);
};

/**
 * @description 4.群活码管理接口
 * @param param
 */
export const requestManageGroupLiveCode: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/group/live/manage', param);
};

/**
 * @description 5.群活码下载接口
 * @param param
 */
export const requestDownloadGroupLiveCode: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/group/live/download', param, {
    responseType: 'blob'
  });
};

/**
 * @description 6.同步更新企微客户群列表接口
 */
export const requestSyncGroupChat: Void2Promise = () => {
  return http.post('/tenacity-admin/api/group/chat/sync');
};

/**
 * @description 7.查询企微客户群列表接口
 * @param param
 */
export const requestGetGroupChatList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/group/chat/list', param);
};

/* ------ ------ ------   员工活码   ------ ------ ------  */

/**
 * @description 1.员工活码列表接口
 * @param param
 */
export const requestGetStaffLiveList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/staff/live/list', param);
};

/**
 * @description 2.员工活码详情接口
 * @param param
 */
export const requestGetStaffLiveDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/staff/live/detail', param);
};

/**
 * @description 3.查询员工活码绑定的员工接口
 * @param param
 */
export const requestGetLiveStaffList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/live/staff/list', param);
};

/**
 * @description 4.员工活码编辑和创建接口
 * @param param
 */
export const requestEditStaffLive: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/live/staff/edit', param);
};

/**
 * @description 5.员工活码下载接口
 * @param param
 */
export const requestDownloadStaffLiveCode: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/live/staff/download', param);
};

/**
 * @description 6.员工活码删除或失效接口
 * @param param
 */
export const requestManageStaffLiveCode: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/live/staff/manage', param);
};
