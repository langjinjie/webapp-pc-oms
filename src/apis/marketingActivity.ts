import http, { HttpFunction } from 'src/utils/http';

/* ----------------------------- 奖品管理 ----------------------------- */

/**
 * @description 获取奖品列表
 * @param goodsId string 商品id
 * @param goodsName string 商品名称
 * @param start date 创建开始时间
 * @param end date 创建结束时间
 * @param pageNum
 * @param pageSize
 */
export const requestActivityPrizeList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/goods/list', param);
};

/**
 * @description 新增和修改奖品
 * @param goodsName string 商品名称
 * @param googsImg string 是 商品图片
 * @param goodsId string 否 商品ID
 * @param goodsDesc strig 是 商品描述
 */
export const requestAddOrUpdateActivityGoods: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/goods/addOrUpdate', param);
};

/**
 * @description 奖品上下架
 * @param goodsId string 是 商品ID
 * @param status 0-下架 1-上架
 */
export const requestPpDownActivityPrize: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/goods/upDown', param);
};

/**
 * @description 商品详情（新增）
 * @param goodsId string 是 商品ID
 */
export const requestActivityPrizeDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/goods/detail', param);
};

/**
 * @description 商品库存导入  此接口需要先调用统一上传接口,然后上传成功后再再进
 * @param goodsId string 是 商品ID
 * @param fileUrl String 是 文件URL
 */
export const requestExportActivityGoodsStock: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/goods/stock/up', param);
};

/**
 * @description 商品库存下载
 * @param goodsId string 是 商品ID
 */
export const requestActivityGoodsStockDownLoad: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/goods/stock/download', param, {
    responseType: 'blob'
  });
};

/**
 * @description 商品库存列表
 * @param goodsId string 是 商品ID
 * @param assignStatus string 否 分发状态：0-未分发；1-已分发
 * @param couponNumber String  券码
 * @param pageNum int 否 第几页，从1开始
 * @param pageSize int 否 页面记录数，默认为10
 */
export const requestActivityGoodsStockList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/goods/stock/list', param);
};

/**
 * @description 删除商品库存列表
 * @param goodsId string 是 商品ID
 * @param couponNumber String  券码
 */
export const requestDelActivityGoodsStock: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/goods/stock/del', param);
};

/* ----------------------------- 问题活动 ----------------------------- */

/**
 * @description 新增群活动接口
 * @param activityId string 否 活动id
 * @param activityName String 是 活动名称
 * @param shareTitle String 是 分享的标题
 * @param shareUrL String 否 分享的URL
 * @param activityShareImg String  活动分享页
 * @param startTime Date 是 活动开始时间yyyy-mm-dd hh:mm:ss
 * @param endTime date 是 活动结束时间yyyy-mm-dd hh:mm:ss
 * @param activityDesc String 是 活动描述
 * @param chatIds array 否 参加的企微群限制；空则不限制
 * @param chatId string  群ID
 * @param chatName String  群名
 * @param playNum Int  限制次数,不限制则为0
 * @param themeColor Varchar 是 主题颜色#FFFFFF
 * @param buttonBgColor Varchar 是 按钮背景颜色
 * @param textColor varchar 是 字体颜色
 * @param activityPoster varchar 是 活动主页海报
 */
export const requestAddQuestionActivityBase: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/add', param);
};

/**
 * @description 群答题活动列表查询
 * @param activityId string 否 活动id
 * @param activityName String 是 活动名称
 * @param startTime Date 是 活动开始时间yyyy-mm-dd hh:mm:ss
 * @param endTime date 是 活动结束时间yyyy-mm-dd hh:mm:ss
 * @param status Int 是 活动状态:1-未上架、2-已上架、3-已下架；4、未开始；5、进行中；6、已结束
 */
export const requestActivityList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/list', param);
};

/**
 * @description 群答题活动上架和下架
 * @param activityId string 否 活动id
 * @param status int  活动状态:2-已上架、3-已下架；
 */
export const requestUpDownActivity: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/upDown', param);
};

/**
 * @description 查询题目列表
 * @param activityId string 是 评测活动id
 */
export const requestActivityTopicList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/topic/list', param);
};

/**
 * @description 查询活动详情
 * @param activityId string 是 活动id
 */
export const requestActivityDetail: HttpFunction = (param) => {
  return http.post('', param);
};

/**
 * @description 新增或修改题目
 * @param activityId string 是 活动id
 * @param topicId String  否 题目ID
 * @param topicTitle String 是 题目
 * @param isRadio Int 是 是否单选
 * @param topicType Int 是 题目类型：1、抽烟；2、体重比；3、家庭题目；4、普通单选多选；5、填空
 * @param sort Int  题目排序
 * @param score float  分数
 * @param imgUrl String  题目图片
 * @param choiceDTOS Array  选项
 * @param choiceId String 否 选项id
 * @param isRightKey int 否 是否正确答案 0、错误；1、正确；3、未知
 * @param sort int 是 选项排序
 * @param choiceOption String 是 选项
 */
export const requestAddOrUpdateActivityTopic: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/topic/addOrUpdate', param);
};

/**
 * @description 删除题目
 * @param topicId String  是 题目ID
 */
export const requestDelActivityTopic: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/topic/delete', param);
};

/**
 * @description 查询题目详情
 * @param topicId String  是 题目ID
 */
export const requestActivityTopicDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/topic/detail', param);
};

/**
 * @description 新增和修改活动奖励规则
 * @param reportId  否 规则ID
 * @param activityId string 是 活动id
 * @param score float 否 分数
 * @param goodsId string 否 商品ID
 * @param num strig 否 默认1：不需要填
 */
export const requestUpdateActivityPrize: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/prize/update', param);
};

/**
 * @description 删除活动奖励规则
 * @param reportId  是 规则ID
 * @param activityId string 是 活动id
 */
export const requestDelActivityPrize: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/prize/del', param);
};

/**
 * @description 活动奖励规则配置列表
 * @param activityId string 是 活动id
 */
export const requestActivityPrizeConfig: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/activity/group/prize/config', param);
};

/* ----------------------------- 打卡活动 ----------------------------- */

/**
 * @description 新增保存群打卡活动接口
 * @param actId String 否 活动id(新增为空，)
 * @param subject String 是 活动名称
 * @param startTime String 是 活动开始时间:2023-08-20 00:00:00
 * @param endTime String 是 活动结束时间:2023-08-25 00:00:00
 * @param desc String 是 活动规则
 * @param bgImgUrl String 是 活动主页头图图片URL
 * @param speechcraft String 是 营销话术（分享小标题）
 * @param shareImgUrl String 是 分享图片logo
 * @param noticeText String 是 分享摘要
 * @param themeBgcolour String 是 主题背景色
 * @param buttonBgcolour String 是 按钮背景色
 * @param wordBgcolour String 是 文字颜色
 * @param signLogo String 是 签到图标
 * @param signText String 是 签到文案
 * @param limitType Int 是 在群要求：0=任意外部群成员;1=指定群成员
 * @param chatGroupIds ArrayList 否 指定群id列表,在群要求为1时有值
 * @param chatId String 是 群id
 */
export const requestAddCheckInActivity: HttpFunction = (param) => {
  return http.post('/tenacity-admin/activity/groupsign/acadd', param);
};

/**
 * @description 查询群打卡活动列表接口
 * @param actCode string 否 活动编号
 * @param subject string 否 活动名称
 * @param startTime string 否 开始时间，格式：yyyyMMdd
 * @param endTime string 否 开始时间，格式：yyyyMMdd
 * @param status int 否 0=未上架、1=未开始、2=进行中、3=已结束、4=已下架
 * @param pageNum int 否 第几页，从1开始
 * @param pageSize int 否 页面记录数，默认为10
 */
export const requestCheckInActivityList: HttpFunction = (param) => {
  return http.post('/tenacity_admin/activity/groupsign/aclist', param);
};

/**
 * @description 群打卡活动上下架接口
 * @param actId string 是 活动id
 * @param opType int 是 0=下架;1=上架
 */
export const requestCheckInActivityUpOrDown: HttpFunction = (param) => {
  return http.post('/tenacity_admin/activity/groupsign/acop', param);
};

/**
 * @description 群打卡活动详情接口
 * @param actId String 是 活动id
 */
export const requestCheckInActivityDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/activity/groupsign/acdetail', param);
};

/**
 * @description 群打卡活动奖励规则列表接口
 * @param actId string 是 活动id
 */
export const requestCheckInActivityRuleList: HttpFunction = (param) => {
  return http.post('/tenacity_admin/activity/groupsign/rulelist', param);
};

/**
 * @description 群打卡活动奖励规则新增编辑保存接口
 * @param actId string 是 活动id
 * @param prId string 否 活动规则奖励id（新增）
 * @param goodsId string 是 奖品id
 * @param goodsName string 是 奖品名称
 * @param priCount int 是 奖励数量
 * @param condiDay int 是 累计天数
 */
export const requestSaveCheckInActivityRule: HttpFunction = (param) => {
  return http.post('/tenacity_admin/activity/groupsign/saverule', param);
};

/**
 * @description 群打卡活动奖励规则删除接口
 * @param param actId string 是 活动id
 * @param param prId string 是 活动规则奖励id
 */
export const requestDelCheckInActivityRule: HttpFunction = (param) => {
  return http.post('/tenacity_admin/activity/groupsign/delrule', param);
};
