import http from 'src/utils/http';
type HttpFC<T = { [key: string]: any }> = (param: T) => Promise<any>;
type HttpVoid = () => Promise<any>;

// 获取产品分类列表
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
