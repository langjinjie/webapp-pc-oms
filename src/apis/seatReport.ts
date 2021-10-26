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
  return Promise.resolve([
    {
      reportId: '123',
      reportName: '2021-10-22',
      updateTime: '9月27日 24:00',
      totalWorkDay: 26,
      weekDay: 2
    },
    {
      reportId: '456',
      reportName: '2021-10-25',
      updateTime: '10月27日 24:00',
      totalWorkDay: 102,
      weekDay: 25
    }
  ]);
  return http.post('/tenacity-admin/api/data/reportlist');
};

/**
 * 查询战报详情
 * @param param
 */
export const queryReportDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/data/reportdetail', param);
};
