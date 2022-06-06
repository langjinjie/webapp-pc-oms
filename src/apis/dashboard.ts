import http from 'src/utils/http';
type HttpFC<T = { [key: string]: unknown }> = (param?: T) => Promise<any>;

/**
 * @description 获取看板整体数据
 * @param param param
 * @returns Promise<any>
 */
export const getDashboardData: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/generalView', param);
};

/**
 * @description 获取看单项数据列表
 * @param param param
 * @returns Promise<any>
 */
export const getDashboardItemData: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/whole/list', param);
};
/**
 * @description 获取看单项数据列表
 * @param param param
 * @returns Promise<any>
 */
export const getDashboardTeamDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/whole/teamdetail', param);
};
/**
 * @description 获取看单项数据列表
 * @param param param
 * @returns Promise<any>
 */
export const getModelList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/whole/staffbusinessModel', param);
};

export const getListTotal: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/whole/total', param);
};
