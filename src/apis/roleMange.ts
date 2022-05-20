import http from 'src/utils/http';
type HttpFc = (param: { [key: string]: any }) => Promise<any>;
/**
 * 查询角色列表
 */
export const requesetGetRoleList: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/list', param);
};
/**
 * 查看角色
 */
export const requestGetRoleDetail: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/detail', param);
};
/**
 * 新增/编辑角色
 */
export const requestAddOrEditRole: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/addoredit', param);
};
/**
 * 查看角色的成员列表
 */
export const requestGetRoleAccountList: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/user/list', param);
};
/**
 * 添加/管理角色的成员
 */
export const requestAddOrEditRoleAccount: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/user/manage', param);
};
/**
 * 删除角色
 */
export const requestDelRole: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/del', param);
};
