import http from 'src/utils/http';
type HttpFC = (param: { [key: string]: any }) => Promise<any>;
type HttpVoid = () => Promise<any>;

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
