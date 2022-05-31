/**
 * 积分商城接口
 *  */
import http, { HttpFunction } from 'src/utils/http';
type HttpFC<T = { [key: string]: unknown }> = (param?: T) => Promise<any>;
type VoidFC = () => Promise<any>;

// 查询积分分发列表接口
export const requestGetPonitsSendList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/list', param);
};
// 一键发放积分接口(积分发放列表)
export const requestSendAllPonits: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/all', param);
};
// 发放积分接口
export const requestSendPonits: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/batch', param);
};
// 查看积分奖励明细接口
export const requestGetSendPonitsDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/detail', param);
};
// 一键积分发放接口（积分奖励明细列表）
export const requestSendAllPonitsDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/detail/send/all', param);
};
// 修改积分奖励明细备注
export const requestModifyRemark: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/detail/remark/modify', param);
};
// 添加黑名单
export const requestAddBlackList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/client/black/add', param);
};
// 发放手机
export const requestProviderPhone: VoidFC = () => {
  return http.post('/tenacity-admin/api/lottery/prize/phone/send');
};
// 查询发放手机列表
export const requestGetProviderPhoneList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/lottery/prize/phone/sended/list', param);
};
// 查询抽奖可见范围操作记录
export const requestGetLotteryScopeRecord: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/lottery/scope/op/record', param);
};
// 设置抽奖可见范围接口
export const requestAddLotteryScope: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/lottery/scope/add', param);
};
// 查询部门列表接口
export const requestGetLotteryDeptList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/lottery/dept/list', param);
};

// 积分发放配置接口
export const getPointsSendConfig: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/points/send/config', param);
};
export const savePointsSendConfig: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/rest/send/config/save', param);
};

// 专属案例列表
export const getExclusiveList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/spectasklist', param);
};

// 专属任务类型
export const getExclusiveTypeList: HttpFC = () => {
  return http.post('/tenacity-admin/api/points/specconfig');
};
// 专属任务积分发放
export const setPointsOfExclusive: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/points/specsend', param);
};

/**
 * 查询抽奖活动列表
 * @param param
 */
export const queryLotteryActivity: HttpFunction = (param: object) => {
  return Promise.resolve({
    total: 21,
    list: [
      {
        activityId: '123',
        activityName: '贵州人保先锋团队第四轮抽奖',
        startTime: '2022.04.20 18:00',
        endTime: '2022.04.21 19:00',
        dateCreated: '2022.04.19 15:03',
        createBy: 'lester',
        status: 0
      },
      {
        activityId: '456',
        activityName: '贵州人保先锋团队第三轮抽奖',
        startTime: '2022.04.20 18:00',
        endTime: '2022.04.21 19:00',
        dateCreated: '2022.04.19 15:03',
        createBy: 'lester',
        status: 1
      },
      {
        activityId: '789',
        activityName: '贵州人保先锋团队第二轮抽奖',
        startTime: '2022.04.20 18:00',
        endTime: '2022.04.21 19:00',
        dateCreated: '2022.04.19 15:03',
        createBy: 'lester',
        status: 2
      },
      {
        activityId: '321',
        activityName: '贵州人保先锋团队第一轮抽奖',
        startTime: '2022.04.20 18:00',
        endTime: '2022.04.21 19:00',
        dateCreated: '2022.04.19 15:03',
        createBy: 'lester',
        status: 3,
        sendStatus: 0
      },
      {
        activityId: 'abc',
        activityName: '贵州人保先锋团队第1轮抽奖',
        startTime: '2022.04.20 18:00',
        endTime: '2022.04.21 19:00',
        dateCreated: '2022.04.19 15:03',
        createBy: 'lester',
        status: 3,
        sendStatus: 1,
        sendTime: '2022.04.19 15:03',
        opName: 'lester'
      },
      {
        activityId: '654',
        activityName: '我佛了',
        startTime: '2022.04.20 18:00',
        endTime: '2022.04.21 19:00',
        dateCreated: '2022.04.19 15:03',
        createBy: 'lester',
        status: 4,
        sendStatus: 1,
        sendTime: '2022.04.19 15:03',
        opName: 'lester'
      }
    ]
  });
  return http.post('/tenacity-admin/api/lottery/activity/list', param);
};

/**
 * 查询活动详情
 * @param param
 */
export const queryActivityDetail: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/activity/detail', param);
};

/**
 * 上架抽奖活动
 * @param param
 */
export const operateActivity: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/activity/manage', param);
};

/**
 * 编辑抽奖活动
 * @param param
 */
export const editActivity: HttpFunction = (param: Object) => {
  return Promise.resolve({});
  return http.post('/tenacity-admin/api/lottery/activity/edit', param);
};

/**
 * 发放大奖
 * @param param
 */
export const giveOutPrize: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/rest/prize/phone/send', param);
};

/**
 * 查询活动配置
 * @param param
 */
export const queryActivityConfig: HttpFunction = (param: Object) => {
  return Promise.resolve({
    status: 1,
    costPoints: 100,
    dayLimit: 2,
    weekLimit: 10,
    monthLimit: 20,
    list: [
      {
        goodsId: '123sad',
        name: '肾14审核相关信息无误后，会在3-5个工作日内发放奖品。若有问题请点击纠',
        imgUrl: require('src/assets/images/artImg.png'),
        goodsType: 1,
        totalStock: 5,
        consumeStock: 2,
        winWeight: 10,
        exchangeDesc:
          '恭喜中奖，请核查下方收货信息，年高工作人员审核相关信息无误后，会在3-5个工作日内发放奖品。若有问题请点击纠错并提交信息。'
      },
      {
        goodsId: '123',
        name: '九阳空气炸锅',
        imgUrl: require('src/assets/images/artImg.png'),
        goodsType: 4,
        totalStock: 5,
        consumeStock: 2,
        winWeight: 10,
        exchangeDesc:
          '1、使用企业微信添加年高工作人员（李女士，手机号17612242635）。\n' +
          '2、复制兑换码发送给工作人员核实中奖信息。\n' +
          '3、工作人员确认信息后发放现金红包。'
      },
      {
        goodsId: '456',
        name: '兑换券',
        imgUrl: require('src/assets/images/artImg.png'),
        goodsType: 2,
        totalStock: 5,
        consumeStock: 2,
        winWeight: 10,
        exchangeDesc: '试试水吧'
      },
      {
        goodsId: '789',
        name: '空气',
        imgUrl: require('src/assets/images/artImg.png'),
        goodsType: 3,
        totalStock: 100,
        consumeStock: 2,
        winWeight: 10,
        exchangeDesc: '试试水吧'
      }
    ]
  });
  return http.post('/tenacity-admin/api/lottery/goods/list', param);
};

/**
 * 配置活动
 * @param param
 */
export const editActivityConfig: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/activity/config', param);
};

/**
 * 查询奖品详情
 * @param param
 */
export const queryPrizeDetail: HttpFunction = (param: Object) => {
  return Promise.resolve({
    goodsId: '789',
    name: '空气',
    imgUrl: require('src/assets/images/artImg.png'),
    goodsType: 3,
    totalStock: 100,
    consumeStock: 2,
    winWeight: 10,
    exchangeDesc: '试试水吧'
  });
  return http.post('/tenacity-admin/api/lottery/goods/detail', param);
};

/**
 * 编辑奖品
 * @param param
 */
export const editPrize: HttpFunction = (param: Object) => {
  return http.post('/tenacity-admin/api/lottery/goods/edit', param);
};
