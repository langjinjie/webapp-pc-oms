import http from 'src/utils/http';
type HttpFC<T = any> = (param?: T, fn?: Function) => Promise<any>;

// 1.10、获取审批链模板下载地址
export const getAuditFlowModalUrl: HttpFC = () => {
  return http.post('/tenacity-admin/api/org/approval/chain/tpl', {});
};
// 1.11、导入审批链数据
export const uploadAuditFlows: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/org/approval/chain/import', param, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 200000
  });
};
// 1.13、查看审批链列表接口
export const getAuditFlowUploadLog: HttpFC = () => {
  return http.post('/tenacity-admin/api/org/approval/chain/import/list', {});
};
// 1.13、查看审批链列表接口
export const getAuditFlowList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/org/approval/chain/list', param);
};
// 1.14、批量删除审批链接口
export const batchDeleteAuditFlow: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/org/approval/chain/del', param);
};
// 1.15、查询发起人的审批链
export const getAuditFlowWithMe: HttpFC = () => {
  return http.post('/tenacity-admin/api/org/approval/chain/my', {});
};
// 1.16、查询申请列表
export const getAuditApplyList: HttpFC<{
  applyList: { userid: string }[];
  applyType: number;
  curHandlerList: { userId: string }[];
  approvalNo: string;
  applyBeginTime: string;
  applyEndTime: string;
  pageNum: number;
  pageSize: number;
}> = (param) => {
  return http.post('/tenacity-admin/api/org/approval/apply/list', param);
};
// 1.17、查询审批列表
export const getAuditList: HttpFC<{
  applyList: { userid: string }[];
  applyType: number;
  curHandlerList: { userId: string }[];
  approvalNo: string;
  status: number;
  pageNum: number;
  pageSize: number;
}> = (param) => {
  return http.post('/tenacity-admin/api/org/approval/audit/list', param);
};
// 1.18、查看审批详情
export const getAuditDetailByApplyId: HttpFC<{ applyId: string }> = (param) => {
  return http.post('/tenacity-admin/api/org/approval/audit/detail', param);
};
// 1.19、查看审批的申请数据详情
export const getAuditApplyDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/org/approval/audit/apply/detail', param);
};
// 1.20、撤回申请（新增）
export const cancelApplyAudit: HttpFC<{ applyId: string }> = (param) => {
  return http.post('/tenacity-admin/api/org/approval/audit/apply/cancel', param);
};
// 1.21、审批接口
export const auditOperate: HttpFC<{ applyId: string; status: number; auditRemark: string }> = (param) => {
  return http.post('/tenacity-admin/api/org/approval/audit/apply/audit', param);
};
// 1.8、查询系统转接失败清单接口
export const getFailedList: HttpFC<{
  objectiveGuid: string;
  customerGuid: string;
  handoverClerkno: string;
  takeoverClerkno: string;
  pageNum: number;
  pageSize: number;
}> = (param) => {
  return http.post('/tenacity-admin/api/org/ccic/assign/fail/list', param);
};
// 1.9、导出系统转接失败清单接口
export const exportFailedList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/org/ccic/assign/fail/export', param, {
    responseType: 'blob'
  });
};
