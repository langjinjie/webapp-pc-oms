export interface InstItem {
  corpId: string;
  corpName: string;
  logo: string;
}

// 机构列表
export interface ICorpList {
  coprId: string;
  corpName: string;
  logo: string;
}

// 员工列表
export interface IStaffList {
  staffId: string;
  userId: string;
  coprId: string;
  staffName: string;
  mangerName: string;
  serviceType: string;
  staffStatus: string;
  accountStatus: string;
  lastLoginTime: string;
}
