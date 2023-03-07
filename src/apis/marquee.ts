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
