/**
 * @name stationConfig
 * @author Lester
 * @date 2021-06-07 11:38
 */

import http from 'src/utils/http';

type HttpFunction = (param: Object) => Promise<any>;
type VoidFC = () => Promise<any>;

/**
 * 查询小站配置列表
 * @param param
 */
export const queryStationList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/station/setting/list', param);
};

/**
 * 查询小站配置详情
 * @param param
 */
export const queryStationDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/station/setting/detail', param);
};

/**
 * 保存小站配置
 * @param param
 */
export const saveStation: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/station/setting/edit', param);
};

/**
 * 查询企业组织架构
 */
export const queryCorpOrg: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/station/corporg', param);
};

/**
 * 查询活动列表
 */
export const queryActivityList: VoidFC = () => {
  return http.post('/tenacity-admin/api/activity/select', {});
};

/**
 * 查询产品列表
 */
export const queryProductList: VoidFC = () => {
  return http.post('/tenacity-admin/api/product/select', {});
};
