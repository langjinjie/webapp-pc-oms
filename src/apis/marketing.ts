import http from 'src/utils/http';

type HttpFunction<T = any> = (param: T) => Promise<any>;

/**
 * 获取用户信息 微信授权登录
 * @param param
 */
export const getUserInfo: HttpFunction<Object> = (param) => {
  return http.get('/auth-service/api/wechat/authorize', param);
};

/**
 * 获取config权限注入参数
 * @param param
 */
export const getConfigParam: HttpFunction<Object> = (param: Object) => {
  return http.get('/auth-service/api/wechat/config', param);
};

/**
 * 根据手机号获取识别码
 * @param param
 */
export const getPhoneIdentifier: HttpFunction<Object> = (param: Object) => {
  return http.get('/auth-service/api/wechat/get_mobile_hashcode', param);
};

/**
 * 获取文章列表
 * @params getNewsListParamsProps
 */
interface getNewsListParamsProps {
  minTime?: string;
  maxTime?: string;
  title?: string;
  pageNum: number | '';
  pageSize: number | '';
}
export const getNewsList: HttpFunction<getNewsListParamsProps> = (params) => {
  return http.post('/tenacity-admin/api/news/list', params);
};

/**
 * 删除文章
 */
export const operateArticleStatus: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/news/opstatus', params);
};

/**
 * 文章上下架操作
 */
export const updateNewsState: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/news/syncBank', params);
};

type HttpFunction2<T = any> = (param: T, config: any) => Promise<any>;

/**
 * 爬取文章
 */
export const peerNews: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/news/peer/save', params);
};

/**
 * 保存文章（无需爬取）
 */
export const saveNews: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/news/save', params);
};

/**
 * 查询文章详情用于数据回显
 * @params {newsId}
 */
export const getNewsDetail: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/news/detail', params);
};

/**
 * 上传图片
 * @params {file}
 */
export const uploadImage: HttpFunction = (params: any) => {
  return http.post('/tenacity-admin/api/file/upload', params, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 100000
  });
};
export const uploadImage2: HttpFunction2 = (params: any, config: any) => {
  return http.post('/tenacity-admin/api/file/upload', params, {
    headers: { 'Content-Type': 'multipart/form-data' },
    ...config
  });
};
/**
 * 上传文件
 *
 */
export const uploadFile: HttpFunction2 = (param: Object, fn: Function) => {
  return http.post('/tenacity-news/api/file/uploadv2', param, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 200000,

    onUploadProgress: (progressEvent: any) => {
      const persent = ((progressEvent.loaded / progressEvent.total) * 100) | 0; // 上传进度百分比
      fn(persent);
      console.log('persent', persent);
    }
  });
};
/**
 * 添加公众号
 */
export const addOfficialAccounts: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/news/information/create', params);
};

/**
 * 删除公众号
 */
export const operateInformation: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/news/information/opstatus', params);
};

/**
 * 查询公众号列表
 */
export const getOfficialAccountsList: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/news/information/list', params);
};

/**
 * 查询文章分类\标签
 */
export const getTagsOrCategorys: HttpFunction = (params: { type: 'category' | 'tag' }) => {
  return http.post('/tenacity-admin/api/news/config/list', params);
};

export interface TagsOrCategoryProps {
  id: string;
  name: string;
  type: string;
}

/**
 * @description 查询企业列表
 */
export const getCorpList: HttpFunction = () => {
  return Promise.resolve({});
};

/**
 * @Descripttion: 查询产品列表
 * @param {Object} param
 * @return {*}
 */
export const getProductList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/product/list', param);
};

/**
 * @desc 查询上架的商品
 *
 */
export const getProductOnlineList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/product/select', param);
};

/**
 * @Descripttion:查询产品配置列表
 * 配置类型：1-产品分类;2-家庭保障范围;3-保障对象;4-保障场景
 * @param {Object} param
 * @return {*}
 */
export const productConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/product/config', param);
};

/**
 * @Descripttion: 查询产品详情
 * @param {Object} param
 * @return {*}
 */
export const productDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/product/detail', param);
};

/**
 * @Descripttion:新增/编辑产品
 * @param {Object} param
 * @return {*}
 */
export const productEdit: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/product/edit', param);
};

/**
 * @Descripttion: 产品管理接口(上架/下架/删除)
 * @param {Object} param
 * @return {*}
 */
export const productManage: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/product/manage', param);
};

/**
 * @Descripttion: 查询产品精选列表
 * @param {Object} param
 * @return {*}
 */
export const productChoiceList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/product/choicelist', param);
};

/**
 * @Descripttion: 新增/编辑产品精选
 * @param {Object} param
 * @return {*}
 */
export const productChoiceEdit: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/product/choiceedit', param);
};
/**
 * @Descripttion:查询活动列表
 * @param {Object} param
 * @return {*}
 */
export const activityList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/activity/list', param);
};

/**
 * @Descripttion: 查询活动详情
 * @param {Object} param
 * @return {*}
 */
export const activityDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/activity/detail', param);
};

/**
 * @Descripttion: 新增/编辑活动
 * @param {Object} param
 * @return {*}
 */
export const activityEdit: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/activity/edit', param);
};

/**
 * @Descripttion: 活动管理接口(上架/下架/删除)
 * @param {Object} param
 * @return {*}
 */
export const activityManage: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/activity/manage', param);
};

/**
 * 获取海报列表
 *
 */
export const getPosterList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/poster/list', param);
};
/**
 * 海报（批量）上架/下架接口
 *
 */
export const toggleOnlineState: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/poster/offonline', param);
};
/**
 * 海报操作(置顶/删除)接口
 *
 */
export const posterOperation: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/poster/operation', param);
};
/**
 * 海报操作(置顶/删除)接口
 *
 */
export const getPosterDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/poster/get', param);
};
/**
 * 海报分类列表查询接口，树形结构，一次性查出
 *
 */
export const getPosterCategoryList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/poster/categorys', param);
};

/**
 * 海报签列表查询接口
 */
export const getPosterTagList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/poster/tags', param);
};

export const savePoster: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/poster/save', param);
};

/**
 * 查询文章列表
 * @param param
 */
export const queryArticleList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/news/list', param);
};

/**
 * 查询产品列表
 * @param param
 */
export const queryProductList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/home/recommend/product/list', param);
};

/**
 * 查询活动列表
 * @param param
 */
export const queryActivityList: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/home/recommend/activity/list', param);
};

/**
 * 查询首页配置
 */
export const queryIndexConfig: VoidFunction = () => {
  return http.post('/tenacity-admin/api/home/recommend/list');
};

/**
 * 保存首页配置
 * @param param
 */
export const saveIndexConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/home/recommend/save', param);
};

// 活动置顶操作
export const sortTopAtActivity: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/top', param);
};
// 活动取消置顶操作
export const sortCancelTopAtActivity: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/top/cancel', param);
};

// 产品设置置顶
export const sortTopAtProduct: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/product/top', param);
};
// 产品取消设置置顶
export const sortCancelTopAtProduct: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/product/top/cancel', param);
};

// 活动批量上下架
export const batchOperateActivity: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/batch/manage', param);
};
// 产品批量上下架
export const batchOperateProduct: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/product/batch/manage', param);
};

// 查询推荐内容（文章，活动，产品），
export const searchRecommendGoodsList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/market/query', param);
};
