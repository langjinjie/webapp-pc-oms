/**
 * 积分商城接口
 *  */
import http, { HttpFunction } from 'src/utils/http';
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

/**
 * 查询抽奖活动列表
 * @param param
 */
export const queryLotteryActivity: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/lottery/activity/list', param);
};

/**
 * 查询活动详情
 * @param param
 */
export const queryActivityDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/activity/detail', param);
};

/**
 * 上架抽奖活动
 * @param param
 */
export const operateActivity: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/activity/manage', param);
};

/**
 * 编辑抽奖活动
 * @param param
 */
export const editActivity: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/activity/edit', param);
};

/**
 * 发放大奖
 * @param param
 */
export const giveOutPrize: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/prize/phone/send', param);
};

/**
 * 查询活动配置
 * @param param
 */
export const queryActivityConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/goods/list', param);
};

/**
 * 配置活动
 * @param param
 */
export const editActivityConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/activity/config', param);
};

/**
 * 查询奖品详情
 * @param param
 */
export const queryPrizeDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/goods/detail', param);
};

/**
 * 编辑奖品
 * @param param
 */
export const editPrize: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/goods/edit', param);
};

/**
 * 中奖管理列表接口
 * @param param
 */
export const requestGetLotteryManageList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/lottery/manage/list', param);
};

/**
 * 中奖管理导出接口
 * @param param
 */
export const requestExportLotteryManage: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/lottery/manage/export', param, {
    responseType: 'blob'
  });
};

/**
 * 发放奖品接口
 * @param param
 */
export const requestSendLotteryManage: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/lottery/manage/send', param);
};
/**
 * 发放奖品接口
 * @param param
 */
export const getGoodsExchangeDesc: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/lottery/goods/defaultExchangeDesc', param);
};

/* ----------------------------------- 打卡和奖励任务 ----------------------------------- */

/**
 * @description 查询打卡和奖励任务列表
 * @param param
 */
export const requestGetPointsConfigList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/points/config/list', param);
};

/**
 * @description 任务配置上下架
 * @param param
 */
export const requestPointsConfigState: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/points/config/state', param);
};

/**
 * @description 任务配置新增修改接口(T+1)生效
 * @param param
 */
export const requestPointsConfigAddEdit: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/points/config/addEdit', param);
};

/**
 * @description 任务配置编辑修改接口(T+0)生效
 * @param param
 */
export const requestPointsConfigEdit: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/points/config/edit', param);
};

/**
 * @description 获取编辑配置任务详情
 * @param param
 */
export const requestGetPointsConfigDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/points/config/detail', param);
};

/**
 * @description 获取新增待生效配置任务详情
 * @param param
 */
export const requestGetPointsConfigLogDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/points/config/log/detail', param);
};

/**
 * @description 配置任务日志查询
 * @param param
 */
export const requestGetPointsConfigLogList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/points/config/log/list', param);
};
