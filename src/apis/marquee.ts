import http from 'src/utils/http';
type HttpFC<T = any> = (param?: T, fn?: Function) => Promise<any>;

export const getBannerList: HttpFC<{ tplId: string }> = (param) => {
  return http.post('/tenacity-admin/api/smart/banner/list', param);
};
export const editBanner: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/smart/banner/save', param);
};
// 上架 / 下架banner（新增）

export const changeStatus: HttpFC<{
  bannerId: string;
  opType: number; // 操作类型: 1-已下架,2-已上架
}> = (param) => {
  return http.post('/tenacity-admin/api/smart/banner/opStatus', param);
};
// 上架 / 下架banner（新增）

export const setTop: HttpFC<{
  bannerId: string;
}> = (param) => {
  return http.post('/tenacity-admin/api/smart/banner/opTop', param);
};

/**
 * 群发消息模块 mass
 */
// 1.1、群发列表接口（新增）
export const getMassList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/task/batch/list', param);
};
// 1.2、群发详情-群发内容接口（新增）
export const getMassDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/task/batch/detail/content', param);
};
// 1.3、群发详情-群发成员接口（新增）
export const getMassWithMember: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/task/batch/detail/member', param);
};
// 1.4、批量停用群发接口（新增）
export const stopMass: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/task/batch/stop', param);
};
