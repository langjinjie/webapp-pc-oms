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

export const getNewsList: HttpFunction = (params) => {
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

/**
 * @desc 查询推荐内容（文章，活动，产品）
 * @param {{
 * recommendType:
 * }} param
 */
export const searchRecommendGoodsList: HttpFunction<{
  title: string;
  specType: number; // 0 = 普通; 1=个性化
  recommendType: number; // 推荐类型：0=文章; 1=活动;2=产品3=海报 4=视频
  type: number | undefined; // type= 0; 查询自己创建的文章， type = 1 查询自己创建的和拉取公有的
}> = (param) => {
  return http.post('/tenacity-admin/api/market/query', param);
};
// 查询用户分组，
export const getUserGroup: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/privilege/scope/group/info', param);
};
// 生成临时用户组，
export const createSingleGroup: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/privilege/group/info', param);
};
// 设置文章用户权限，
export const setUserRightWithArticle: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/news/batch/setscope', param);
};

// 设置海报用户权限
export const setUserRightWithPoster: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/poster/batch/setscope', param);
};

// 设置活动用户权限
export const setUserRightWithActivity: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/batch/setscope', param);
};
// 设置产品用户权限
export const setUserRightWithProduct: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/product/batch/setscope', param);
};

/**
 * 查询素材可见范围
 * @param param
 */
export const queryMarketArea: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/item/scope/data', param);
};

// 热门专题
// 1.热门专题列表接口
export const getHotList: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/topic/list', param);
};
// 2. 热门专题详情接口
export const getHotContentDetail: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/topic/detail', param);
};
// 3.热门专题内容配置接口
export const setHotContent: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/topic/content/set', param);
};
// 4.  新增/编辑热门专题接口
export const setHotConfig: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/topic/addoredit', param);
};

// 5. 热门专题上下架接口
export const changeHotStatus: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/topic/status/man', param);
};

// 6. 热门专题置顶
export const sortTopHot: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/topic/sort/top', param);
};

// 朋友圈模块接口
// 1.11、朋友圈内容库列表接口
export const getMomentList: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/moment/feed/list', param);
};

// 1.13、新增/编辑朋友圈内容接口
export const updateMoment: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/moment/feed/addoredit', param);
};

// 1.12、朋友圈内容详情接口
export const getMomentDetail: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/moment/feed/detail', param);
};
// 1.12、朋友圈内容详情接口
export const batchDeleteMoment: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/market/moment/feed/del', param);
};
/**
 * @description 朋友圈内容上架到分机构接口
 * @param feedids array 是 feedId
 * @param corpIds array 否 机构ID
 */
export const requestMarketMomentFeedUp: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/market/moment/feed/up', param);
};

/**
 * @description 朋友圈内容下架接口
 * @param feedids feedids array 是 feedId
 */
export const requestMarketMomentFeedDown: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/market/moment/feed/down', param);
};

// 1.12、链接转化
export const connectionTransform: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/shorturl/create', param);
};
// 1.1、查询视频列表
export const getVideoList: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/list', param);
};
// 1.2、查询视频详情
export const getVideoDetail: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/detail', param);
};
// 1.3、新增/编辑视频
export const editVideo: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/edit', param);
};
// 1.4、视频管理接口(上架/下架/删除)
export const operateVideoItem: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/manage', param);
};
// 1.5、视频置顶/取消置顶接口
export const topVideoItem: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/top', param);
};
// 1.6、视频保存可见范围接口
export const setVideoScope: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/batch/setscope', param);
};
// 1.7、查询视频分类列表
export const getVideoTypeList: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/typeList', param);
};
// 1.8、新增视频分类
export const addVideoType: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/typeadd', param);
};
// 1.9、保存视频分类排序接口
export const sortVideoType: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/typesavesort', param);
};
// 1.10、删除视频分类
export const delVideoType: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/typedel', param);
};
// 1.11、视频上传接口
export const uploadVideo: HttpFunction = (param: object) => {
  return http.post('/tenacity-admin/api/video/upload', param);
};

// ---------------------------------------------------------------- 文章库渠道列表
/**
 * @description 1.1、文章链接下载接口
 * @param param
 * @returns
 */
export const requestDownLoadNews: HttpFunction<{
  title?: string; // 否 文章标题
  categoryId?: string; // 否 分类
  recommendType?: number; // 否 推荐内容：0-文章/1-活动/2-产品/3-无
  fromSource?: string; // 否 渠道来源
  minTime?: string; // 否 创建开始时间
  maxTime?: string; // 否 创建结束时间
  syncBank?: number; // 否 状态
  channelId?: string; // 否 渠道id，空表示公有云文章
}> = (param) => {
  return http.post('/tenacity-admin/api/news/download', param, {
    responseType: 'blob'
  });
};

/**
 * @description 1.2、机构渠道列表接口
 * @param params
 * @returns
 */
export const requestChannelList: HttpFunction<{
  channelName?: string; // 否 渠道名称
  channelCode?: string; // 否 渠道代码
  pageNum?: number; // 否 第几页，默认第一页
  pageSize?: number; // 否 分页大小，默认10条
}> = (params) => {
  return http.post('/tenacity-admin/api/channel/list', params);
};

/**
 * @description 1.3、机构渠道编辑接口
 * @param params
 * @returns
 */
export const requestEditChannel: HttpFunction<{
  channelId?: string; // 否 渠道id，编辑时必填
  channelName: string; // 是 渠道名称
  channelCode?: string; // 否 渠道代码，不传则后端自动生成
  articleCnt: number; // 是 文章总访问次数
}> = (params) => {
  return http.post('/tenacity-admin/api/channel/edit', params);
};

/**
 * @description 1.4、机构渠道添加通知人接口
 * @param params
 * @returns
 */
export const requestChannelAddNotify: HttpFunction<{
  channelId: string; // 是 渠道id
  notifyList: string[]; // 是 通知人企微账号列表
}> = (params) => {
  return http.post('/tenacity-admin/api/channel/addnotify', params);
};

/**
 * @description 1.5、机构渠道查询通知人接口
 * @param params
 * @returns
 */
export const requestChannelNotify: HttpFunction<{
  channelId: string; // 是 渠道id
}> = (params) => {
  return http.post('/tenacity-admin/api/channel/notifylist', params);
};
