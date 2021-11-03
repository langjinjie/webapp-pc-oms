/**
 * @name seatReport
 * @author Lester
 * @date 2021-10-25 17:58
 */
import http, { HttpFunction, Void2Promise } from 'src/utils/http';

/**
 * 查询战报列表
 */
export const queryReportList: Void2Promise = () => {
  return http.post('/tenacity-admin/api/data/reportlist');
};

/**
 * 查询战报详情
 * @param param
 */
export const queryReportDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/data/reportdetail', param);
};
