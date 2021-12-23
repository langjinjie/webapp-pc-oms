/**
 * @name company
 * @author Lester
 * @date 2021-12-23 10:54
 */
import http, { Void2Promise } from 'src/utils/http';

/**
 * 查询公司列表
 */
export const queryCompanyList: Void2Promise = () => {
  return http.post('/tenacity-admin/api/corp/list');
};
