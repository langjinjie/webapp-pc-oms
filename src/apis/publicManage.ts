import http from 'src/utils/http';
type HttpFC<T = { [key: string]: unknown }> = (param?: T) => Promise<any>;
// type VoidFC = () => Promise<any>;

/* ------------------------ 销售线索&预约活动 ------------------------ */

/**
 * @description 获取活码列表接口
 * @param liveCodeType int 否 活码类型，1-员工活码，2-群活码
 * @param pageNum int 否 第几页，从1开始
 * @param pageSize int 否 页面记录数，默认为10
 */
export const requestGetActivityLeadActivityLiveCodeList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/activity/leadActivity/liveCode/list', param);
};
