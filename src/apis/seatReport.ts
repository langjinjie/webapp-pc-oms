/**
 * @name seatReport
 * @author Lester
 * @date 2021-10-25 17:58
 */
import http, { HttpFunction, Void2Promise } from 'src/utils/http';

/**
 * 查询战报列表
 */
export const queryReportList: Void2Promise = () => {
  return http.post('/tenacity-admin/api/data/reportlist');
};

/**
 * 查询战报详情
 * @param param
 */
export const queryReportDetail: HttpFunction = (param: Object) => {
  /* return Promise.resolve({
    reportBaseInfo: {
      totalWorkDay: 154,
      updateTime: '04月06日 10:30',
      weekDay: 1
    },
    bodyList: [
      {
        moduleName: '1.试点整体表现',
        moduleType: 1,
        areaId: '123',
        modulLogoUrl: require('src/assets/images/statistics/message.png'),
        modulBackColor: '#DDEBF7',
        modulLineColor: '#305496',
        modulTextColor: '#252F61'
      },
      {
        moduleType: 3,
        areaId: '456',
        moduleName: '整体'
      },
      {
        moduleName: '2.团队表现',
        moduleType: 1,
        areaId: '789',
        modulLogoUrl: require('src/assets/images/statistics/message.png'),
        modulBackColor: '#DDEBF7',
        modulLineColor: '#305496',
        modulTextColor: '#252F61'
      },
      {
        moduleType: 3,
        areaId: '11123',
        moduleName: '整体'
      },
      {
        moduleType: 2,
        areaId: '84464',
        modulLineColor: '#EBEBEB'
      },
      {
        moduleType: 3,
        areaId: '31231254',
        moduleName: '人均'
      },
      {
        moduleType: 2,
        areaId: '12312aes',
        modulLineColor: '#EBEBEB'
      },
      {
        moduleType: 4,
        areaId: '12312asda'
      },
      {
        moduleName: '3.客户经理表现',
        moduleType: 1,
        areaId: '31212asd',
        modulLogoUrl: require('src/assets/images/statistics/message.png'),
        modulBackColor: '#DDEBF7',
        modulLineColor: '#305496',
        modulTextColor: '#252F61'
      },
      {
        moduleName: '郭丝区域  张军团队',
        moduleType: 5,
        areaId: '312asddsa55',
        modulLogoUrl: require('src/assets/images/statistics/area_bg.png')
      },
      {
        moduleName: '深圳区域  诸葛团队',
        moduleType: 5,
        areaId: '7895666',
        modulLogoUrl: require('src/assets/images/statistics/area_bg.png')
      },
      {
        moduleName: '深圳区域  嘻哈团队',
        moduleType: 5,
        areaId: '213124125',
        modulLogoUrl: require('src/assets/images/statistics/area_bg.png')
      }
    ]
  }); */
  return http.post('/tenacity-admin/api/data/reportframe', param);
};

/**
 * 查询战报样式数据
 */
export const queryReportStyle: HttpFunction = (param: Object) => {
  /* return Promise.resolve({
    reportStyle: {
      headBannUrl: require('src/assets/images/statistics/report_header.jpg'),
      headBannColor: '#262966',
      titleUrl: require('src/assets/images/statistics/report_title.png'),
      useDesc:
        '说明：使用实力分为加好友量+朋友圈发送情况+累计好友通过率+累计车牌备注率+调用营销平台次数+调用销售宝典次数的综合情况，<span style="color: #FF0000">营销平台和销售宝典会放大倍数哦！</span>',
      footBannUrl: require('src/assets/images/statistics/report_header.jpg')
    },
    footDesc: {
      footTitle: '指标说明',
      leftParam: [
        {
          name: '当日使用分',
          value:
            '当日加好友： 累计加好友，隋代哦大师的你爸是哈大家哈手机电话啊是大哈师大是哈师大还是哈师大哈师大啊杀杀杀 哈师大哈桑等哈十九点hash'
        },
        {
          name: '排行榜',
          value: '显示次数哈哈哈'
        }
      ],
      rightParam: [
        {
          name: '朋友圈',
          value: '朋友圈啊哈哈哈打造'
        },
        {
          name: '朋友圈发送',
          value: '我真的佛了'
        }
      ]
    }
  }); */
  return http.post('/tenacity-admin/api/data/reportstyle', param);
};

/**
 * 查询区域数据
 * @param param
 */
export const queryReportAreaData: HttpFunction = (param: Object) => {
  // @ts-ignore
  /* if (param.areaId === '456') {
    return Promise.resolve({
      bodyList: [
        [
          '当日加好友',
          '累计加好友',
          '',
          '当日人均朋友圈',
          '备注车牌率',
          '',
          '营销平台',
          '销售宝典',
          '排行榜',
          '客户信息',
          '我的收藏发送数',
          '识别工具'
        ],
        ['23', '2345', '', '3.6', '76.9%', '', '66', '5', '10', '20', '30', '15']
      ]
    });
  } else {
    return Promise.resolve({
      bodyList: [
        [
          '实力排名',
          '现场经理',
          '当日使用分',
          '综合使用分',
          '当日加好友',
          '累计加好友',
          '',
          '日人均朋友圈',
          '点赞数',
          '评论数',
          '备注车牌率',
          '',
          '日营销平台',
          '日销售宝典',
          '客户聊天数',
          '排行榜',
          '客户信息',
          '我的收藏',
          '我的收藏发送次数',
          '识别工具',
          '团队人力'
        ],
        [
          '1',
          '邓腾飞',
          '218.9',
          '145.5',
          '34',
          '814',
          '',
          '2.3',
          '2.5',
          '5',
          '63.1%',
          '',
          '58',
          '15',
          '34',
          '7',
          '8',
          '9',
          '4',
          '2',
          '13'
        ],
        [
          '2',
          '张军',
          '218.9',
          '145.5',
          '34',
          '814',
          '',
          '2.3',
          '2.5',
          '5',
          '63.1%',
          '',
          '58',
          '15',
          '34',
          '7',
          '8',
          '9',
          '4',
          '2',
          '13'
        ]
      ]
    });
  } */
  return http.post('/tenacity-admin/api/data/reportdata', param);
};
