import http from 'src/utils/http';
type HttpFC<T = { [key: string]: unknown }> = (param?: T, config?: any) => Promise<any>;
// type HttpVoid = () => Promise<any>;

// 1.1、获取知识库目录
export const getCategoryList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/train/wiki/category/list', param);
};
// 1.2、添加分类
export const createCategory: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/category/add', param, config);
};
// 1.3 查询知识库内容列表
export const getWikiList: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/list', param, config);
};

// 1.4、查看知识库内容详情
export const getWikiDetail: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/detail', param, config);
};
// 1.5、编辑知识库内容
export const editWiki: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/edit', param, config);
};
// 1.6、上架/批量上架知识库内容
export const onlineChange: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/online', param, config);
};
// 1.7、下架/批量下架知识库内容
export const offlineChange: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/offline', param, config);
};
// 1.7、删除/批量删除知识库内容
export const deleteChange: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/delete', param, config);
};
// 1.9、知识库内容重新发起审批
export const readuitWiki: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/readuit', param, config);
};
// 1.10、新建知识库内容
export const addWiki: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/add', param, config);
};
// 1.11、查询申请列表/审批列表
export const getApplyList: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/apply/list', param, config);
};
// 1.12、查看申请详情
export const getApplyDetail: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/apply/detail', param, config);
};
// 1.13、查看审批详情
export const getApprovalDetail: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/train/wiki/approval/detail', param, config);
};
// 1.14、审批接口
export const auditApply: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/train/wiki/apply/audit', param);
};
// 1.1A、搜索知识库目录（新增）
export const getCategoryWithKeyword: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/train/wiki/category/search', param);
};
// 1.14、审批接口
export const setScope: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/train/wiki/scope/set', param);
};
