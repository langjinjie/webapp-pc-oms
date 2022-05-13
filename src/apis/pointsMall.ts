/**
 * 积分商城接口
 *  */
import http from 'src/utils/http';
type HttpFC<T = { [key: string]: unknown }> = (param?: T) => Promise<any>;
type VoidFC = () => Promise<any>;

// 查询积分分发列表接口
export const requestGetPonitsSendList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/list', param);
};
// 一键发放积分接口(积分发放列表)
export const requestSendAllPonits: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/all', param);
};
// 发放积分接口
export const requestSendPonits: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/batch', param);
};
// 查看积分奖励明细接口
export const requestGetSendPonitsDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/detail', param);
};
// 一键积分发放接口（积分奖励明细列表）
export const requestSendAllPonitsDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/detail/send/all', param);
};
// 修改积分奖励明细备注
export const requestModifyRemark: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/detail/remark/modify', param);
};
// 添加黑名单
export const requestAddBlackList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/client/black/add', param);
};
// 发放手机
export const requestProviderPhone: VoidFC = () => {
  return http.post('/tenacity-admin/api/lottery/prize/phone/send');
};
// 查询发放手机列表
export const requestGetProviderPhoneList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/lottery/prize/phone/sended/list', param);
};
// 查询抽奖可见范围操作记录
export const requestGetLotteryScopeRecord: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/lottery/scope/op/record', param);
};
// 设置抽奖可见范围接口
export const requestAddLotteryScope: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/lottery/scope/add', param);
};
// 查询部门列表接口
export const requestGetLotteryDeptList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/lottery/dept/list', param);
};

// 积分发放配置接口
export const getPointsSendConfig: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/config', param);
};
export const savePointsSendConfig: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/send/config/save', param);
};

// 专属案例列表
export const getExclusiveList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/spectasklist', param);
};

// 专属任务类型
export const getExclusiveTypeList: HttpFC = () => {
  return http.post('/tenacity-admin/api/points/specconfig');
};
// 专属任务积分发放
export const setPointsOfExclusive: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/specsend', param);
};
