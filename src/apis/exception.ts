import http, { HttpFunction } from 'src/utils/http';

/**
 * @@description 异常提醒登录接口
 */
export const requestGetLoginExceptionList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/org/staff/unlogin/list', param);
};

/**
 * @description 查询删客户的坐席名单接口（新增）
 * @param param
 */
export const requestGetStaffDelClientList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/org/staff/del/client/list', param);
};

/**
 * @description 查看客户详情接口（新增）
 * @param param
 */
export const requestGetClientDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/client/detail', param);
};

/**
 * @description 查看客户画像接口（新增）
 * @param param
 */
export const requestGetClientPortrait: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/client/portrait', param);
};

/**
 * @description 查看客户服务建议接口（新增）
 * @param param
 */
export const requestGetClientRecommend: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/client/recommend', param);
};

/**
 * @description 获取客户动态（新增）
 * @param param
 */
export const requestGetClientDynamic: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/data/client/dynamic', param);
};

/**
 * @description 聊天记录查询-私聊聊天记录列表
 */
export const requesrtGetSingleChatList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/chat/chat_record/single_chat_list', param);
};

/**
 * @description 下载聊天记录图片/文件
 */
export const requestDownLoadImg: HttpFunction = (param) => {
  return http.get(
    '/tenacity-admin/api/chat/chat_record/chat_file_preview?' + param,
    {},
    {
      responseType: 'blob'
    }
  );
};

/**
 * 查询标签列表
 * @param param
 */
export const queryTagList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/tag/list', param);
};
