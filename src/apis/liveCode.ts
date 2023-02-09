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
  return http.post('/tenacity-admin/api/group/live/download', param);
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
