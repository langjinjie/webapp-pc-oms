import http from 'src/utils/http';
type HttpFc = (param: { [key: string]: any }) => Promise<any>;
type HttpVoid = () => Promise<any>;
/**
 * 查询角色列表
 */
export const requesetGetRoleList: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/list', param);
};
/**
 * 查看角色
 */
export const requestGetRoleDetail: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/detail', param);
};
/**
 * 新增/编辑角色
 */
export const requestAddOrEditRole: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/addoredit', param);
};
/**
 * 查看角色的成员列表
 */
export const requestGetRoleAccountList: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/user/list', param);
};
/**
 * 添加/管理角色的成员
 */
export const requestAddOrEditRoleAccount: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/user/manage', param);
};
/**
 * 删除角色
 */
export const requestDelRole: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/del', param);
};
/**
 * 查看角色的成员列表
 */
export const requestGetCurRoleUserList: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/user/list', param);
};
/**
 * 开启/关闭角色
 */
export const requestChangeRoleStatus: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/status/manage', param);
};
/**
 * 默认角色新增菜单权限
 */
export const requestAddDefaultMenuList: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/privilege/role/default/add', param);
};

/**
 * @description 在职转接客户列表接口
 */
export const requestGetTransferClientList: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/org/assign/transfer/list', param);
};

/**
 * @description 查询分配原因配置值接口
 */
export const requestGetAssignReasonList: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/org/assign/reason/list', param);
};

/**
 * @description 在职转接分配客户接口
 */
export const requestAssignClientTransfer: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/org/assign/client/transfer', param);
};

/**
 * @description 离职继承客户列表接口
 */
export const requestGetDimissionTransferList: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/org/dimission/transfer/list', param);
};

/**
 * @description 离职继承分配客户接口
 */
export const requestDimissionClientTransfer: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/org/dimission/client/transfer', param);
};

/**
 * @description 同步待分配的离职成员列表接口
 */
export const requestSyncTransferClientList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/org/dimission/sync');
};

/**
 * @description 客户分配记录接口
 */
export const requestGetTransferClientRecord: HttpFc = (param) => {
  return http.post('/tenacity-admin/api/org/assign/client/flow', param);
};
