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
/**
 * 保存待推送的客户
 * @param param
 */
export const saveToBuffer: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/push/client/save', param);
};

// 查询待推送的客户列表
export const getBufferList: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/unpush/client/list', param);
};
// 已推送列表
export const getChangedList: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/pushed/client/list', param);
};
