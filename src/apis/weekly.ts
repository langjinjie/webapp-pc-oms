/**
 * @name weekly
 * @author Lester
 * @date 2021-11-06 10:55
 */
import http, { HttpFunction, Void2Promise } from 'src/utils/http';

/**
 * 查询周报配置列表
 * @param param
 */
export const queryWeeklyList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/paperreport/paperlist', param);
};

/**
 * 查询周报配置详情
 * @param param
 */
export const queryWeeklyDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/paperreport/paperdetail', param);
};

/**
 * 发布配置
 * @param param
 */
export const publishConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/paperreport/papersend', param);
};

/**
 * 删除配置
 * @param param
 */
export const deleteConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin//api/paperreport/paperdel', param);
};

/**
 * 查询分类配置颜色列表
 */
export const queryColors: Void2Promise = () => {
  return http.post('/tenacity-admin/api/admin/colorlist');
};

/**
 * 保存周报配置
 * @param param
 */
export const saveConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/paperreport/save', param);
};

/**
 * 查询运营人员列表
 */
export const queryUserList: Void2Promise = () => {
  return http.post('/tenacity-admin/api/admin/userlist');
};
