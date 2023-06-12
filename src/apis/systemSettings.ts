import http from 'src/utils/http';
export type HttpFC<T = { [key: string]: any }> = (param: T) => Promise<any>;
type HttpVoid = () => Promise<any>;

// 获取产品分类列表1
export const requestGetProductTypeList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/prouct/typelist');
};

// 产品分类新增/修改保存接口
export const requestSaveProducType: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/prouct/typesave', param);
};

// 产品分类删除接口
export const requestDeleteProductType: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/prouct/typedel', param);
};

// 文章分类列表接口
export const requestGetNewTypeList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/news/typelist');
};

// 文章分类新增/修改保存接口
export const requestSaveNewType: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/news/typesave', param);
};

// 文章分类删除接口
export const requestDeleteNewType: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/news/typedel', param);
};

// 海报分类列表接口
export const requestGetPosterTypeList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/poster/typelist');
};

// 海报分类新增/修改保存接口
export const requestSavePosterType: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/poster/typesave', param);
};

// 海报分类删除接口
export const requestDeletePosterType: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/poster/typedel', param);
};

// 获取产品库、文章库、海报库、活动库、标签列表
export const requestGetAllTagList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/tag/markettaglist');
};

// 营销分类排序保存接口
export const requestSaveSortMarket: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/market/savesort', param);
};

/* -------------------------- 会话存档解析标签 -------------------------- */

/**
 * @description 查询会存解析标签列表接口
 * @param clientName string 否 客户昵称
 * @param externalUserid string 否 外部联系人id
 * @param tagGroupName string 否 标签名称
 * @param staffName string 否 客户经理姓名
 * @param createTimeBegin string 否 标签生成时间查询开始时间
 * @param createTimeEnd string 否 标签生成时间查询结束结束
 * @param pageNum int 否 第几页，从1开始
 * @param pageSize int 否 页面记录数，默认为10
 */
export const requestGetTagChatAnalyseList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/tag/chat/analyse/list', param);
};

/**
 * @description 批量更新会存解析标签接口
 * @param list {analyseId: string}[]
 */
export const requestUpdateBatchChatTag: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/tag/chat/tag/updatebatch', param);
};

/**
 * @description 查询可更新的解析标签列表接口
 * @param analyseId string 是 会存解析ID
 * @param pageNum int 否 第几页，从1开始
 * @param pageSize int 否 页面记录数，默认为10
 */
export const requestGetChatTagList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/tag/chat/tag/list', param);
};

/**
 * @description 选择更新会存解析标签接口
 * @param analyseId string 是 会存解析ID
 * @param list list array 是 列表
 *  -detailId string 是 解析标签id
 *  -tagGroupName string 是 映射的标签组名称
 *  -tagName string 是 映射的标签名称
 */
export const requestUpdateChatTag: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/tag/chat/tag/update', param);
};
