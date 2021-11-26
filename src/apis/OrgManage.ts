import http from 'src/utils/http';
type HttpFC = (param: { [key: string]: any }) => Promise<any>;
type HttpVoid = () => Promise<any>;
/* 机构管理 */
// 获取机构列表
export const requestGetCorpList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/corp/list');
};

// 获取机构员工列表
export const requestGetStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/staff/list', param);
};

// 员工激活/停用
export const requestSetStaffOpstatus: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/staff/opstatus', param);
};

// 手动同步通讯录
export const requestSyncSpcontentdel: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/collect/spcontentdel', param);
};

// 导出表格
export const requestLeadingOutExcel: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/staff/download', param, {
    responseType: 'blob'
  });
};

/* 敏感词管理 */
// 获取敏感词列表
export const requestGetSensitiveList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/list', param);
};
// 获取敏感词类型接口
export const requestGetSensitiveTypeList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/type/list', param);
};
// 敏感词类型新增接口
export const requestAddSensitiveType: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/type/add', param);
};
// 敏感词新增/编辑接口
export const requestEditSensitiveWord: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/edit', param);
};
// 敏感词(上架/下架/删除接口)
export const requestManageSensitiveWord: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/batch/manage', param);
};
// 敏感词批量新增接口
export const requestAddSensitiveList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/batch/add', param);
};
// 敏感词全量导出接口、下载敏感词模板
export const requestDownLoadSensitiveList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/export', param, {
    responseType: 'blob'
  });
};
