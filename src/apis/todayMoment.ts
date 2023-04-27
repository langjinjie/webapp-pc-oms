/* ------------------------------ 今日朋友圈 ------------------------------ */
import http from 'src/utils/http';

type HttpFunction<T = any> = (param: T) => Promise<any>;
/**
 * @description 1.今日朋友圈列表
 * @param params state number 否 状态：0=未上架; 1=已上架;2=已下架
 * @param pageNum pageNum int 否 分页数
 * @param pageSize pageSize int 否 分页大小
 */
export const requestGetTodayMomentList: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/today/moment/list', params);
};

/**
 * @description 2.今日朋友圈新增和编辑
 * @param params 参数详见今日朋友圈增加页面
 */
export const requestEditTodayMoment: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/today/moment/edit', params);
};

/**
 * @description 3.今日朋友圈详情
 * @param params momentId string 是 朋友圈ID
 */
export const requestGetTodayMomentDetail: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/today/moment/detail', params);
};

/**
 * @description 4.今日朋友圈上架
 * @param param
 */
export const requestUpTodayMoment: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/today/moment/up', param);
};

/**
 * @description 5.今日朋友圈下架
 * @param param
 */
export const requestDownTodayMoment: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/today/moment/down', param);
};

/**
 * @description 6.今日朋友圈可见范围修改
 * @param param
 */
export const requestSetScopeTodayMoment: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/today/moment/setscope', param);
};
