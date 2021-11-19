import http from 'src/utils/http';

type HttpFunction<T = any> = (param: T) => Promise<any>;

/**
 * 查询客户列表
 * @param param
 */
export const getClientList: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/client/list', param);
};
/**
 * 修改客户标签
 * @param param
 */
export const changeClientTag: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/client/tag/modify', param);
};
/**
 * 修改车标签
 * @param param
 */
export const changeClientTagOfCar: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/client/tag/car/modify', param);
};
/**
 * 获取Tag 属性
 * @param param
 */
export const searchTagGroupOptions: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/group/info', param);
};

/**
 * 获取Tag 属性
 * @param param
 */
export const getTagGroupList: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/forecast/list', param);
};
