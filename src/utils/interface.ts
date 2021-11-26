export interface InstItem {
  corpId: string;
  corpName: string;
  logo: string;
}

// 机构列表
export interface ICorpList {
  corpId: string;
  corpName: string;
  logo: string;
}

// 员工列表
export interface IStaffList {
  staffId: string;
  userId: string;
  corpId: string;
  staffName: string;
  mangerName: string;
  serviceType: string;
  staffStatus: string;
  accountStatus: string;
  lastLoginTime: string;
}

// 账号激活,搜索param
export interface ICurrentSearchParam {
  staffName?: string;
  mangerName?: string;
  serviceType?: string;
  staffStatus?: string;
  accountStatus?: string;
}

// 账号激活/员工列表Modal
export interface IMoalParam {
  isModalVisible: boolean;
  modalType: string;
  modalContentTitle: string;
  modalContent: string;
}

export interface IStaffListInfo {
  usedCount: number;
  licenseCount: number;
  total: number;
  staffList: IStaffList[];
}

// 产品分类列表
export interface IProductTypeItem {
  typeId: string;
  name: string;
  categoryList?: IProductTypeItem[];
}

// 海报分类列表
export interface IPosterTypeItem {
  id: string;
  name: string;
  type: string;
  count: number;
  sortId: number;
  categoryList?: IPosterTypeItem[];
}

// 分类标签列表
export interface ITagItem {
  type: number;
  tagId: string;
  tagName: string;
}
export interface IAllTagList {
  productTagList: ITagItem[];
  newsTagList: ITagItem[];
  posterTagList: ITagItem[];
  activityTagList: ITagItem[];
}

/* 销售宝典 */
// 目录管理
export interface IAddOrEditModalParam {
  type: number; // 0 新增 1 编辑 3 操作(删除-上移-下移)
  islastlevel: boolean;
  title: string;
  content: string;
  isNeedIcon?: boolean;
}
export interface IBannerInfo {
  name: string;
  catoryId: string;
}
// 目录列表
export interface ICatalogItem {
  sceneId: number;
  catalogNum: number;
  catalogId: string;
  name: string;
  logoUrl: string;
  level: number;
  lastLevel: number;
  onlineContentNum: number;
  contentNum: number;
}

// 添加/编辑目录参数
export interface IEditOrAddCatalogParam {
  title: string;
  catalog: ICatalogItem;
  parentId: string;
}

// 添加/编辑最后一级目录参数
export interface IEditOrAddLastCatalogParam extends IEditOrAddCatalogParam {
  visible: boolean;
}

// 二确param
export interface IFirmModalParam {
  visible: boolean;
  title: string;
  content: string;
  onOk?: () => void;
}
// 最后一级目录详情
export interface ICatalogDetail {
  sceneId: string;
  catalogId: string;
  name: string;
  fullName: string;
  fullCatalogId: string;
  logoUrl?: string;
  level: number;
  lastLevel: number;
  contentType: number;
  thumbnail?: string;
  title?: string;
  summary?: string;
  contentUrl?: string;
  audioText?: string;
  audioDuration?: number;
  videoSize?: string;
  videoDuration?: number;
  audioVideoId?: string;
}

/* 敏感词管理 */
// 敏感词列表
export interface ISensitiveList {
  createBy: string;
  dateCreated: string;
  lastUpdated: string;
  name: string;
  sensitiveId: string;
  status: number;
  typeId: string;
  updateBy: string;
  word: string;
}
// 敏感词类型列表
export interface ISensitiveType {
  typeId: string;
  name: string;
}
// 敏感词列表搜索条件
export interface ISensitiveSearchParam {
  typeId: string;
  word: string;
  status: number;
  updateBeginTime: string;
  updateEndTime: string;
}
