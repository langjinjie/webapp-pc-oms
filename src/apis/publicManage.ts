import http, { HttpFunction } from 'src/utils/http';

/* ------------------------ 销售线索&预约活动 ------------------------ */

/**
 * @description 销售线索列表接口
 * @param channel 渠道来源
 * @param leadId 线索ID
 * @param status 线索状态 1-待分配；2-已分配；3-自动分配；4-撤回；5-再分配
 * @param phone 手机号码
 * @param carNumber 车牌号
 * @param nickName 客户昵称
 * @param fromStaffName 分享人
 * @param fromDeptId 分享人部门ID
 * @param followName 跟进人
 * @param followDept 跟进人部门ID
 * @param createTimeBegin 创建开始时间
 * @param createTimeEnd 创建结束时间
 * @param pageNum
 * @param pageSize
 */
export const requestActivityLeadList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/lead/list', param);
};

/**
 * @description 管理线索接口（分配/撤回/再分配）
 * @param opType int 是 操作类型，1-分配；2-撤回；3-再分配
 * @param list array 是 线索列表 -leadId string 是 线索ID
 * @param staffId string 否 跟进人id，当opType=1和3时必填
 * @param remark string 否 分配/再分配时填写的备注原因
 */
export const requestManActivityLead: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/lead/man', param);
};

/**
 * @description 线索活动列表接口
 * @param leadActivityId string 否 活动ID
 * @param leadActivityName string 否 活动名称
 * @param createBy string 否 创建人
 * @param createTimeBegin string 否 创建时间查询开始时间，yyyy-MM-dd HH:mm:ss
 * @param createTimeEnd string 否 创建时间查询结束时间，yyyy-MM-dd HH:mm:ss
 * @param status int 否 状态，1-未上架；2-已上架；3-已下架
 * @param pageNum int 否 第几页，从1开始
 * @param pageSize int 否 页面记录数，默认为10
 */
export const requestActivityLeadActivityList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/leadActivity/list', param);
};

/**
 * @description 线索活动详情接口
 * @param leadActivityId string 是 活动ID
 */
export const requestActivityLeadActivityDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/leadActivity/detail', param);
};

/**
 * @description 创建/编辑线索活动接口
 * @param param
 */
export const requestCreateActivityLeadActivity: HttpFunction<{ [key: string]: any }> = (param) => {
  return http.post('/tenacity-admin/api/activity/leadActivity/save', param);
};

/**
 * @description 线索活动上下架接口
 * @param param
 */
export const requestManActivityLeadActivity: HttpFunction<{
  leadActivityId: string; // 活动Id
  type: number; // 类型: 1-上架;2-下架
}> = (param) => {
  return http.post('/tenacity-admin/api/activity/leadActivity/man', param);
};

/**
 * @description 线索活动删除接口
 * @param param
 */
export const requestDelActivityLeadActivity: HttpFunction<{
  leadActivityId: string; // 活动Id
}> = (param) => {
  return http.post('/tenacity-admin/api/activity/leadActivity/del', param);
};

/**
 * @description 线索活动置顶接口
 * @param param
 */
export const requestTopActivityLeadActivity: HttpFunction<{
  leadActivityId: string; // 活动Id
}> = (param) => {
  return http.post('/tenacity-admin/api/activity/leadActivity/top', param);
};

export const requestActivityLeadActivityShortUrl: HttpFunction<{
  leadActivityId: string; // 活动Id
}> = (param) => {
  return http.post('/tenacity-admin/api/activity/leadActivity/shorturl', param);
};

/**
 * @description 获取活码列表接口
 * @param liveCodeType int 否 活码类型，1-员工活码，2-群活码
 * @param pageNum int 否 第几页，从1开始
 * @param pageSize int 否 页面记录数，默认为10
 */
export const requestGetActivityLeadActivityLiveCodeList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/leadActivity/liveCode/list', param);
};
