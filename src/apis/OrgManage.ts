import http from 'src/utils/http';
type HttpFC = (param: { [key: string]: any }) => Promise<any>;
type HttpVoid = () => Promise<any>;

// 获取机构列表
export const requestGetCorpList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/corp/list', {});
};

// 获取机构员工列表
export const requestGetStaffList: HttpFC = (param) => {
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({
  //       list: [
  //         {
  //           userId: '1',
  //           staffName: '项泽',
  //           staffId: '1',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '李思丹妮',
  //           serviceType: '续保',
  //           lastLoginTime: '— —',
  //           staffStatus: '在职',
  //           accountStatus: '未激活'
  //         },
  //         {
  //           userId: '2',
  //           staffName: '檀欣壮',
  //           staffId: '2',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '李思丹妮',
  //           serviceType: '赢回',
  //           lastLoginTime: '— —',
  //           staffStatus: '在职',
  //           accountStatus: '未激活'
  //         },
  //         {
  //           userId: '3',
  //           staffName: '仝勤育',
  //           staffId: '3',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '从伟',
  //           serviceType: '新客',
  //           lastLoginTime: '— —',
  //           staffStatus: '在职',
  //           accountStatus: '未激活'
  //         },
  //         {
  //           userId: '4',
  //           staffName: '扬明',
  //           staffId: '4',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '雷发',
  //           serviceType: '续保',
  //           lastLoginTime: '2021-04-30 11:23 ',
  //           staffStatus: '离职',
  //           accountStatus: '停用'
  //         },
  //         {
  //           userId: '5',
  //           staffName: '强馨秋',
  //           staffId: '5',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '阳利',
  //           serviceType: '续保',
  //           lastLoginTime: '2021-04-30 11:23 ',
  //           staffStatus: '离职',
  //           accountStatus: '停用'
  //         },
  //         {
  //           userId: '6',
  //           staffName: '牟琼',
  //           staffId: '6',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '西杰河',
  //           serviceType: '续保',
  //           lastLoginTime: '2021-04-30 11:23 ',
  //           staffStatus: '在职',
  //           accountStatus: '在用'
  //         },
  //         {
  //           userId: '7',
  //           staffName: '西希',
  //           staffId: '7',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '钱涛洁',
  //           serviceType: '续保',
  //           lastLoginTime: '2021-04-30 11:23 ',
  //           staffStatus: '在职',
  //           accountStatus: '在用'
  //         },
  //         {
  //           userId: '8',
  //           staffName: '金栋善',
  //           staffId: '8',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '苟婉',
  //           serviceType: '续保',
  //           lastLoginTime: '2021-04-30 11:23 ',
  //           staffStatus: '在职',
  //           accountStatus: '停用'
  //         },
  //         {
  //           userId: '9',
  //           staffName: '池眉瑗',
  //           staffId: '9',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '山荷',
  //           serviceType: '续保',
  //           lastLoginTime: '2021-04-30 11:23 ',
  //           staffStatus: '在职',
  //           accountStatus: '停用'
  //         },
  //         {
  //           userId: '10',
  //           staffName: '仇国',
  //           staffId: '10',
  //           coprId: 'wwcb58cb32fb9b697a',
  //           mangerName: '丰秋',
  //           serviceType: '续保',
  //           lastLoginTime: '2021-04-30 11:23 ',
  //           staffStatus: '在职',
  //           accountStatus: '停用'
  //         }
  //       ]
  //     });
  //   }, 1000);
  // });
  return http.post('/tenacity-admin/api/staff/list', param);
};

// 员工激活/停用
export const requestSetStaffOpstatus: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/staff/opstatus', param);
};
