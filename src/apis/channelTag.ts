import http, { HttpFunction /* , Void2Promise */ } from 'src/utils/http';
/**
 * @description 1.渠道标签列表接口
 */
export const requestGetChannelGroupList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/channel/group/list', param);
};

/**
 * @description 2.标签组详情接口
 */
export const requestGetChannelGroupDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/channel/group/detail', param);
};

/**
 * @description 3.标签组编辑接口
 */
export const requestEditChannelGroup: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/channel/group/edit', param);
};

/**
 * @description 4.查询标签组是否已使用接口
 */
export const requestEditChannelGroupIsUse: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/channel/group/use', param);
};

/**
 * @description 5.标签组管理接口
 */
export const requestManageChannelGroup: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/channel/group/manage', param);
};
