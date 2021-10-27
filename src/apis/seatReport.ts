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
  return Promise.resolve([
    {
      reportId: '123',
      reportName: '2021-10-22',
      updateTime: '9月27日 24:00',
      totalWorkDay: 26,
      weekDay: 2
    },
    {
      reportId: '456',
      reportName: '2021-10-25',
      updateTime: '10月27日 24:00',
      totalWorkDay: 102,
      weekDay: 25
    }
  ]);
  return http.post('/tenacity-admin/api/data/reportlist');
};

/**
 * 查询战报详情
 * @param param
 */
export const queryReportDetail: HttpFunction = (param: Object) => {
  return Promise.resolve({
    areaGroupList: [
      {
        areaName: '整体',
        dayAddFriendCount: 56,
        totalAddFriendCount: 2000,
        addFriendRate: '62.2',
        avgCircleCount: 10.2,
        markCarNumRate: '86.9',
        market: 58,
        smart: 100
      },
      {
        areaName: '高鹏',
        dayAddFriendCount: 12,
        totalAddFriendCount: 1200,
        addFriendRate: '52.2',
        avgCircleCount: 6.2,
        markCarNumRate: '76.9',
        market: 68,
        smart: 120
      },
      {
        areaName: '纪雨佳',
        dayAddFriendCount: 12,
        totalAddFriendCount: 1200,
        addFriendRate: '0.0',
        avgCircleCount: 1.2,
        markCarNumRate: '76.9',
        market: 68,
        smart: 120
      }
    ],
    ageGroupList: [
      {
        leveName: '合计',
        perCount: 48,
        mark: 235
      },
      {
        leveName: '80后',
        perCount: 12,
        mark: 227
      },
      {
        leveName: '90后',
        perCount: 32,
        mark: 173
      },
      {
        leveName: '00后',
        perCount: 5,
        mark: 304
      }
    ],
    leveGroupList: [
      {
        leveName: '见习',
        perCount: 48,
        mark: 235
      },
      {
        leveName: '初级',
        perCount: 12,
        mark: 227
      },
      {
        leveName: '中级',
        perCount: 32,
        mark: 273
      },
      {
        leveName: '高级',
        perCount: 5,
        mark: 304
      }
    ],
    corpGroupList: [
      {
        leveName: '半年内',
        perCount: 48,
        mark: 235
      },
      {
        leveName: '0.5-1年',
        perCount: 12,
        mark: 227
      },
      {
        leveName: '1-2年',
        perCount: 32,
        mark: 173
      },
      {
        leveName: '2年以上',
        perCount: 5,
        mark: 304
      }
    ],
    teamOrderList: [
      {
        order: 1,
        teamName: '杨过',
        dayUsedMark: 218,
        multiUseMark: 4200,
        dayAddFriendCount: 10,
        totalAddFriendCount: 820,
        addFriendRate: '65.2',
        avgCircleCount: 2.6,
        markCarNumRate: '63.1',
        dayMarket: 29,
        daySmart: 58,
        perCount: 15,
        trialStarDate: '8月23日'
      },
      {
        order: 2,
        teamName: '陆无双',
        dayUsedMark: 218.2,
        multiUseMark: 6200,
        dayAddFriendCount: 0,
        totalAddFriendCount: 820,
        addFriendRate: '62.2',
        avgCircleCount: 2.6,
        markCarNumRate: '84.2',
        dayMarket: 29,
        daySmart: 58,
        perCount: 15,
        trialStarDate: '8月23日'
      },
      {
        order: 3,
        teamName: '郭芙',
        dayUsedMark: 16,
        multiUseMark: 620,
        dayAddFriendCount: 1,
        totalAddFriendCount: 820,
        addFriendRate: '22.2',
        avgCircleCount: 0,
        markCarNumRate: '64.2',
        dayMarket: 0,
        daySmart: 0,
        perCount: 15,
        trialStarDate: '8月23日'
      }
    ],
    teamDetailList: [
      {
        teamName: '黄蓉',
        teamShowName: '桃花岛区域  黄蓉团队',
        staffOrderList: [
          {
            order: 1,
            teamName: '杨过',
            dayUsedMark: 218,
            multiUseMark: 4200,
            dayAddFriendCount: 10,
            totalAddFriendCount: 850,
            addFriendRate: '65.2',
            avgCircleCount: 2.6,
            markCarNumRate: '63.1',
            dayMarket: 29,
            daySmart: 58
          },
          {
            order: 2,
            teamName: '陆无双',
            dayUsedMark: 218.2,
            multiUseMark: 6200,
            dayAddFriendCount: 0,
            totalAddFriendCount: 820,
            addFriendRate: '62.2',
            avgCircleCount: 2.6,
            markCarNumRate: '84.2',
            dayMarket: 29,
            daySmart: 58
          },
          {
            order: 3,
            teamName: '郭芙',
            dayUsedMark: 16,
            multiUseMark: 620,
            dayAddFriendCount: 1,
            totalAddFriendCount: 820,
            addFriendRate: '22.2',
            avgCircleCount: 0,
            markCarNumRate: '64.2',
            dayMarket: 0,
            daySmart: 0
          },
          {
            order: 4,
            teamName: '郭靖',
            dayUsedMark: 20,
            multiUseMark: 620,
            dayAddFriendCount: 10,
            totalAddFriendCount: 810,
            addFriendRate: '42.2',
            avgCircleCount: 0,
            markCarNumRate: '84.2',
            dayMarket: 0,
            daySmart: 0
          },
          {
            order: 5,
            teamName: '程英',
            dayUsedMark: 20,
            multiUseMark: 620,
            dayAddFriendCount: 10,
            totalAddFriendCount: 800,
            addFriendRate: '42.2',
            avgCircleCount: 0,
            markCarNumRate: '84.2',
            dayMarket: 0,
            daySmart: 0
          }
        ]
      },
      {
        teamName: '杨过',
        teamShowName: '终南山区域  杨过团队',
        staffOrderList: [
          {
            order: 1,
            teamName: '杨过',
            dayUsedMark: 218,
            multiUseMark: 4200,
            dayAddFriendCount: 10,
            totalAddFriendCount: 820,
            addFriendRate: '65.2',
            avgCircleCount: 2.6,
            markCarNumRate: '63.1',
            dayMarket: 29,
            daySmart: 58
          },
          {
            order: 2,
            teamName: '陆无双',
            dayUsedMark: 218.2,
            multiUseMark: 6200,
            dayAddFriendCount: 0,
            totalAddFriendCount: 820,
            addFriendRate: '62.2',
            avgCircleCount: 2.6,
            markCarNumRate: '84.2',
            dayMarket: 29,
            daySmart: 58
          },
          {
            order: 3,
            teamName: '郭芙',
            dayUsedMark: 16,
            multiUseMark: 620,
            dayAddFriendCount: 1,
            totalAddFriendCount: 820,
            addFriendRate: '22.2',
            avgCircleCount: 0,
            markCarNumRate: '64.2',
            dayMarket: 0,
            daySmart: 0
          },
          {
            order: 4,
            teamName: '郭靖',
            dayUsedMark: 20,
            multiUseMark: 620,
            dayAddFriendCount: 10,
            totalAddFriendCount: 810,
            addFriendRate: '42.2',
            avgCircleCount: 0,
            markCarNumRate: '84.2',
            dayMarket: 0,
            daySmart: 0
          },
          {
            order: 5,
            teamName: '程英',
            dayUsedMark: 20,
            multiUseMark: 620,
            dayAddFriendCount: 10,
            totalAddFriendCount: 810,
            addFriendRate: '42.2',
            avgCircleCount: 0,
            markCarNumRate: '84.2',
            dayMarket: 0,
            daySmart: 0
          }
        ]
      },
      {
        teamName: '郭靖',
        teamShowName: '漠北区域  郭靖团队',
        staffOrderList: [
          {
            order: 1,
            teamName: '杨过',
            dayUsedMark: 218,
            multiUseMark: 4200,
            dayAddFriendCount: 10,
            totalAddFriendCount: 820,
            addFriendRate: '65.2',
            avgCircleCount: 2.6,
            markCarNumRate: '63.1',
            dayMarket: 29,
            daySmart: 58
          },
          {
            order: 2,
            teamName: '陆无双',
            dayUsedMark: 218.2,
            multiUseMark: 6200,
            dayAddFriendCount: 0,
            totalAddFriendCount: 820,
            addFriendRate: '62.2',
            avgCircleCount: 2.6,
            markCarNumRate: '84.2',
            dayMarket: 29,
            daySmart: 58
          },
          {
            order: 3,
            teamName: '郭芙',
            dayUsedMark: 16,
            multiUseMark: 620,
            dayAddFriendCount: 1,
            totalAddFriendCount: 820,
            addFriendRate: '22.2',
            avgCircleCount: 0,
            markCarNumRate: '64.2',
            dayMarket: 0,
            daySmart: 0
          },
          {
            order: 4,
            teamName: '郭靖',
            dayUsedMark: 20,
            multiUseMark: 620,
            dayAddFriendCount: 10,
            totalAddFriendCount: 810,
            addFriendRate: '42.2',
            avgCircleCount: 0,
            markCarNumRate: '84.2',
            dayMarket: 0,
            daySmart: 0
          },
          {
            order: 5,
            teamName: '程英',
            dayUsedMark: 20,
            multiUseMark: 620,
            dayAddFriendCount: 10,
            totalAddFriendCount: 810,
            addFriendRate: '42.2',
            avgCircleCount: 0,
            markCarNumRate: '84.2',
            dayMarket: 0,
            daySmart: 0
          }
        ]
      }
    ]
  });
  return http.post('/tenacity-admin/api/data/reportdetail', param);
};
