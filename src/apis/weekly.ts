/**
 * @name weekly
 * @author Lester
 * @date 2021-11-06 10:55
 */
import http, { HttpFunction, Void2Promise } from 'src/utils/http';

/**
 * 查询小站配置列表
 * @param param
 */
export const queryWeeklyList: HttpFunction = (param: Object) => {
  return Promise.resolve({
    list: [
      {
        id: '123',
        title: '周报配置1',
        publishTime: '2021-11-06 10:00',
        status: 0
      },
      {
        id: '456',
        title: '周报配置2',
        publishTime: '2021-11-06 10:00',
        status: 1
      }
    ],
    total: 26
  });
  return http.post('/tenacity-admin/api/weekly/list', param);
};

/**
 * 查询小站配置详情
 * @param param
 */
export const queryWeeklyDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/weekly/detail', param);
};

/**
 * 保存小站配置
 * @param param
 */
export const saveWeekly: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/weekly/edit', param);
};

/**
 * 发布配置
 * @param param
 */
export const publishConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/weekly/edit', param);
};

/**
 * 删除配置
 * @param param
 */
export const deleteConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/weekly/edit', param);
};

/**
 * 查询分类配置颜色列表
 */
export const queryColors: Void2Promise = () => {
  return Promise.resolve([
    {
      colorName: '红色',
      colorCode: '#F29087,#E0574F'
    },
    {
      colorName: '蓝色',
      colorCode: '#B1DBF5,#6884BD'
    }
  ]);
  return http.post('/tenacity-admin/api/weekly/edit');
};
