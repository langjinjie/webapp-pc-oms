import http, { HttpFunction } from 'src/utils/http';

/**
 * @description 1.客户列表接口
 * @param param
 */
export const requestGetClientList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/org/assign/client/list', param);
};

/**
 * @description 2.获取标签库接口
 * @param param
 */
export const requestGetTagList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/list', param);
};
