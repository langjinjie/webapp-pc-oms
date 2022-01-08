/**
 * 积分商城接口
 *  */
import http from 'src/utils/http';
type HttpFC<T = { [key: string]: unknown }> = (param: T) => Promise<any>;

// 查询积分分发列表接口
export const requestGetPonitsSendList: HttpFC = (param) => {
  return http.post('http://rap2api.taobao.org/app/mock/296962/tenacity-admin/api/points/rest/points/send/list', param);
  return http.post('/tenacity-admin/api/points/rest/points/send/list', param);
};
// 一键发放积分接口(积分发放列表)
export const requestSendAllPonits: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/all', param);
};
// 发放积分接口
export const requestSendPonits: HttpFC = (param) => {
  return http.post('/tenacity-points/api/points/rest/points/send/batch', param);
};
// 查看积分奖励明细接口
export const requestGetSendPonitsDetail: HttpFC = (param) => {
  return http.post(
    'http://rap2api.taobao.org/app/mock/296962/tenacity-points/api/points/rest/points/send/detail',
    param
  );
  return http.post('/tenacity-points/api/points/rest/points/send/detail', param);
};
// 一键积分发放接口（积分奖励明细列表）
export const requestSendAllPonitsDetail: HttpFC = (param) => {
  return http.post('/tenacity-points/api/points/rest/points/detail/send/all', param);
};