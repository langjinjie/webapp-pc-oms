import http from 'src/utils/http';
type HttpFC = (param: { [key: string]: any }) => Promise<any>;
type HttpVoid = () => Promise<any>;
/* 机构管理 */
// 获取机构列表
export const requestGetCorpList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/corp/list');
};

// 获取机构员工列表1
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

/**
 * 坐席详情模块
 ********************************************/
// 获取坐席详情
export const getStaffDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/staffinfo', param);
};
// 保存坐席信息
export const saveStaffDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/usersave', param);
};

/**
 * 数据免统计名单
 *********************************************/
// 免统计名单列表
export const getFreeStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/user/freeStats/list', param);
};

// 批量删除免统计员工
export const delFreeStaffs: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/user/freeStats/del', param);
};
// 查询坐席员工接口
export const searchStaffByName: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/freeStats/findByName', param);
};

// 新增免统计员工
export const addFreeStaffs: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/user/freeStats/add', param);
};
