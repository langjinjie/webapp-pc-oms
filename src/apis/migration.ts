import http from 'src/utils/http';
type HttpFC<T = any> = (param: T, fn?: Function) => Promise<any>;
type HttpVoid = () => Promise<any>;

// 1.1、查询迁移前后机构
export const queryTransferCorp: HttpVoid = () => {
  return http.post('/tenacity-admin/api/transfer/corp/query');
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
export const queryTransferSummary: HttpVoid = () => {
  return http.post('/tenacity-admin/api/transfer/data/summary');
};
// 1.5 查询群发任务列表
export const getTransferTaskList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/list', param);
};
// 1.6 操作群发任务
export const operationTransferTask: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/op', param);
};
// 1.7 下载任务数据明细
export const exportTransferTask: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/export', param, {
    responseType: 'blob',
    timeout: 120000
  });
};
// 1.8 创建群发任务
export const requestCreateTransferTask: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/create', param);
};
// 1.9 查看群发任务详情
export const requestGetTaskDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/detail', param);
};
// 1.10 查询群发任务员工明细
export const requestGetTaskStaffDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/staff/list', param);
};
// 1.11 迁移任务坐席执行详情接口
export const requestGetTaskStaffExeclist: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/task/staff/execList', param);
};

/**
 * 2.1 个微好友迁移-任务列表查询接口（管理端）
 * @param
 */
export const requestGetWechatTransferTaskList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/wechat/transfer/list', param);
};

/**
 * 2.2 个微好友迁移-任务详情接口（管理端）
 * @param
 */
export const requestGetWechatTaskDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/wechat/transfer/detail', param);
};

/**
 * 2.3 个微好友迁移-任务详情-查看明细接口（管理端）
 */
export const requestGetWechatTransferTaskDetailStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/wechat/transfer/staff/list', param);
};

/**
 * 2.4 个微好友迁移-删除/关闭任务接口（管理端）
 */
export const requestOpWechatTransferTask: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/wechat/transfer/task/op', param);
};

/**
 * 2.5 个微好友迁移-任务数据下载接口（管理端）
 */
export const requestExportTransferWechatTask: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/transfer/wechat/task/export', param, {
    responseType: 'blob',
    timeout: 12000
  });
};

/**
 * 2.6 个微好友迁移-新增任务按钮状态获取接口（管理端）
 */
export const requestGetCreateButtonStatus: HttpVoid = () => {
  return http.post('/tenacity-admin/api/wechat/transfer/get/create/button/status');
};

/**
 * 2.7 个微好友迁移-任务创建接口（管理端）
 */
export const requestCreateWechatTransferTask: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/wechat/transfer/task/create', param);
};

/**
 * 2.8 个微好友迁移-任务创建-获取执行员工接口（管理端）
 */
export const requestGetWechatTransferStaffScope: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/wechat/transfer/staff/scope', param);
};
