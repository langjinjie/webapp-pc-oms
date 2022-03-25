/**
 * @name notice
 * @author Lester
 * @date 2021-11-24 15:39
 */
import http, { HttpFunction } from 'src/utils/http';

/**
 * 保存上新通知配置
 * @param param
 */
export const saveNotice: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/notice/create', param);
};

/**
 * 查询通知信息
 * @param param
 */
export const queryNotice: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/notice/detail', param);
};

/**
 * 查询周报配置列表
 * @param param
 */
export const queryNoticeList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/notice/list', param);
};

/**
 * 删除公告
 * @param param
 */
export const delNotice: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/notice/del', param);
};
