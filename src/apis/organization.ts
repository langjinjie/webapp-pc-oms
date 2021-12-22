/**
 * @name organization
 * @author Lester
 * @date 2021-12-21 16:43
 */
import http, { HttpFunction } from 'src/utils/http';

/**
 * 查询部门列表
 * @param param
 */
export const queryDepartmentList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/stafforg/deptlist', param);
};

/**
 * 查询员工列表
 * @param param
 */
export const queryStaffList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/stafforg/stafflist', param);
};

/**
 * 搜索员工
 * @param param
 */
export const searchStaffAndDepart: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/stafforg/searchstaff', param);
};
