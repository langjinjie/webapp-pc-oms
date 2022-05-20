/**
 * @name seatReport
 * @author Lester
 * @date 2021-10-25 17:58
 */
import http, { HttpFunction, Void2Promise } from 'src/utils/http';

/**
 * 查询战报列表
 */
export const queryReportList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/data/reportlist', param);
};

/**
 * 查询战报详情
 * @param param
 */
export const queryReportDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/data/reportframe', param);
};

/**
 * 查询战报样式数据
 */
export const queryReportStyle: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/data/reportstyle', param);
};

/**
 * 查询区域数据
 * @param param
 */
export const queryReportAreaData: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/data/reportdata', param);
};

/**
 * 查询战报模板列表
 */
export const queryBoardList: Void2Promise = () => {
  return http.post('/tenacity-admin/api/data/boardlist');
};
