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

/**
 * 保存部门
 * @param param
 */
export const saveDepartment: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/stafforg/deptsave', param);
};

/**
 * 设置部门上级
 * @param param
 */
export const saveDepartmentLeader: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/stafforg/setdeptleader', param);
};

/**
 * 操作部门
 * @param param
 */
export const operateDepartment: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/stafforg/opstatus', param);
};
