import http from 'src/utils/http';
type HttpFC<T = any> = (param: T, fn?: Function) => Promise<any>;
// type HttpVoid = () => Promise<any>;

// 1.1、查询迁移前后机构
export const queryTransferCorp: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/corp/query', param);
};

// 1.2 设置迁移目标机构
export const setTransferCorp: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/corp/set', param);
};

// 1.3、查询迁移员工范围
export const queryTransferStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/staff/scope', param);
};

// 1.4、查询客户迁移数据概要
export const queryTransferSummary: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/data/summary', param);
};
// 1.5 查询群发任务列表
export const getTransferTaskList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/list', param);
};
// 1.6 查询群发任务列表
export const operationTransferTask: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/op', param);
};
// 1.7 下载任务数据明细
export const exportTransferTask: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/export', param);
};
