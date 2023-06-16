import http from 'src/utils/http';

type HttpFunction<T = any> = (param: T) => Promise<any>;

/**
 * 查询客户列表
 * @param param
 */
export const getClientList: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/client/list', param);
};
/**
 * 修改客户标签
 * @param param
 */
export const changeClientTag: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/client/tag/modify', param);
};
/**
 * 修改车标签
 * @param param
 */
export const changeClientTagOfCar: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/client/tag/car/modify', param);
};
/**
 * 获取Tag 属性
 * @param param
 */
export const searchTagGroupOptions: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/group/info', param);
};

/**
 * 获取Tag 属性
 * @param param
 */
export const getTagGroupList: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/forecast/list', param);
};
/**
 * 保存待推送的客户
 * @param param
 */
export const saveToBuffer: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/push/client/save', param);
};

// 查询待推送的客户列表
export const getBufferList: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/unpush/client/list', param);
};
// 已推送列表
export const getChangedList: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/pushed/client/list', param);
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
export const requestGetTagChatAnalyseList: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/chat/analyse/list', param);
};

/**
 * @description 批量更新会存解析标签接口
 * @param list {analyseId: string}[]
 */
export const requestUpdateBatchChatTag: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/chat/tag/updatebatch', param);
};

/**
 * @description 查询可更新的解析标签列表接口
 * @param analyseId string 是 会存解析ID
 * @param pageNum int 否 第几页，从1开始
 * @param pageSize int 否 页面记录数，默认为10
 */
export const requestGetChatTagList: HttpFunction<Object> = (param) => {
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
export const requestUpdateChatTag: HttpFunction<Object> = (param) => {
  return http.post('/tenacity-admin/api/tag/chat/tag/update', param);
};
