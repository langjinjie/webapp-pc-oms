import http from 'src/utils/http';

type HttpFunction<T = any> = (param: T) => Promise<any>;

/**
 * 积分待扣减列表
 * @param param
 */
export const getWaitDeductPointsList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/deduct/list', param);
};
/**
 * 批量扣减积分
 * @param param
 */
export const batchDeductIntegral: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/deduct/batch', param);
};
/**
 * 积分扣减记录
 * @param param
 */
export const getRecordListOfPoints: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/deduct/record/list', param);
};
/**
 * 删除积分扣减记录
 * @param param
 */
export const delRecordHistory: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/deduct/record/delete', param);
};

/**
 * 搜索用户用于积分加减
 * @param param
 */
export const searchStaffWithPointsUpdate: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/adjust/staff/search', param);
};
/**
 * 加减用户积分
 * @param param
 */
export const updateStaffPoints: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/adjust/staff', param);
};
/**
 * 查询加减积分记录接口
 * @param param
 */
export const getUpdateStaffPointHistory: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/adjust/list', param);
};
/**
 * 查询加减积分记录接口
 * @param param
 */
export const delUpdateStaffPointHistory: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/adjust/delete', param);
};
