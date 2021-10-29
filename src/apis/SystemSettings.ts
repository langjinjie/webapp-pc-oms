import http from 'src/utils/http';
type HttpFC<T = { [key: string]: any }> = (param: T) => Promise<any>;
type HttpVoid = () => Promise<any>;

// 获取产品分类列表
export const requestGetProductTypeList: HttpVoid = () => {
  return Promise.resolve({
    typeList: [
      { typeId: 1, name: '车险' },
      { typeId: 2, name: '重疾险' },
      { typeId: 3, name: '医疗险' },
      { typeId: 4, name: '意外险' },
      { typeId: 5, name: '其他' }
    ]
  });
  return http.post('/tenacity_admin/api/prouct/typelist');
};

// 产品分类新增/修改保存接口
export const requestSaveProducType: HttpFC = (param) => {
  return http.post('/tenacity_admin/api/prouct/typesave', param);
};

// 产品分类删除接口
export const requestDeleteProductType: HttpFC = (param) => {
  return http.post('/tenacity_admin/api/prouct/typedel', param);
};

// 文章分类列表接口
export const requestGetNewTypeList: HttpVoid = () => {
  return Promise.resolve({
    typeList: [
      { typeId: 1, name: '选择指南' },
      { typeId: 2, name: '养车用车' },
      { typeId: 3, name: '车险百科' },
      { typeId: 4, name: '健康话题' },
      { typeId: 5, name: '风险保障' },
      { typeId: 6, name: '投资理财' },
      { typeId: 7, name: '地产' },
      { typeId: 8, name: '教育' }
    ]
  });
  return http.post('/tenacity_admin/api/news/typelist');
};

// 文章分类新增/修改保存接口
export const requestSaveNewType: HttpFC = (param) => {
  return http.post('/tenacity_admin/api/news/typesave', param);
};

// 文章分类删除接口
export const requestDeleteNewType: HttpFC = (param) => {
  return http.post('/tenacity_admin/api/news/typedel', param);
};

// 海报分类列表接口
export const requestGetPosterTypeList: HttpVoid = () => {
  return Promise.resolve({
    categoryList: [
      {
        typeId: 1,
        name: '今日朋友圈',
        children: [
          { typeId: 101, name: '正能量' },
          { typeId: 102, name: '历史今日' },
          { typeId: 103, name: '生活百科' }
        ]
      },
      {
        typeId: 2,
        name: '爱车一族',
        children: [
          { typeId: 201, name: '养车' },
          { typeId: 202, name: '用车' },
          { typeId: 203, name: '选车指南' },
          { typeId: 204, name: '车险百科' }
        ]
      },
      {
        typeId: 3,
        name: '保险理念',
        children: [
          { typeId: 301, name: '保险理念' },
          { typeId: 302, name: '健康生活' },
          { typeId: 303, name: '生变案例' }
        ]
      },
      {
        typeId: 4,
        name: '保险知识',
        children: [
          { typeId: 401, name: '养车' },
          { typeId: 402, name: '用车' },
          { typeId: 403, name: '选车指南' },
          { typeId: 404, name: '车险百科' }
        ]
      },
      {
        typeId: 5,
        name: '重要的日子',
        children: [
          { typeId: 501, name: '养车' },
          { typeId: 502, name: '用车' },
          { typeId: 503, name: '选车指南' },
          { typeId: 504, name: '车险百科' }
        ]
      },
      { typeId: 6, name: '其他' }
    ]
  });
  return http.post('/tenacity_admin/api/poster/typelist');
};

// 海报分类新增/修改保存接口
export const requestSavePosterType: HttpFC = (param) => {
  return http.post('/tenacity_admin/api/poster/typesave', param);
};

// 海报分类删除接口
export const requestDeletePosterType: HttpFC = (param) => {
  return http.post('/tenacity_admin/api/poster/typedel', param);
};
