/**
 * @name notice
 * @author Lester
 * @date 2021-11-24 15:39
 */
import http, { HttpFunction, Void2Promise } from 'src/utils/http';

/**
 * 保存上新通知配置
 * @param param
 */
export const saveNotice: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/notice/create', param);
};

/**
 * 查询通知信息
 */
export const queryNotice: Void2Promise = () => {
  return http.post('/tenacity-admin/api/notice/detail');
};

/**
 * 查询周报配置列表
 * @param param
 */
export const queryNoticeList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/paperreport/paperlist', param);
};

/**
 * 删除配置
 * @param param
 */
export const delNotice: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin//api/paperreport/paperdel', param);
};
