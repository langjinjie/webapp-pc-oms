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

// 表单相关
type FormItemType = 'input' | 'select' | 'datePicker' | 'rangePicker';

export interface DataItem {
  id: string;
  name: string;
}

export interface ItemDataProps {
  type: FormItemType;
  placeholder?: string;
  dataSource?: DataItem[];
}

export interface ItemProps extends ItemDataProps {
  name: string;
  label: string;
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
  visible: boolean;
  title: string;
  catalog: ICatalogItem;
  parentId: string;
  getParentChildrenList: () => void;
}

// 二确param
export interface IFirmModalParam {
  visible: boolean;
  title: string;
  content: string;
  onOk?: () => void;
  onCancel?: () => void;
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

/**
 * 员工组织架构
 *  */

// 组织架构
export interface IOrganizationItem {
  id?: string;
  name?: string;
  key?: string;
  title?: string;
  isParent?: boolean;
  isLeaf?: boolean;
  index?: number;
  total?: number;
  leaderId?: string;
  isRoot?: boolean;
  children?: IOrganizationItem[];
}
// 组织架构员工列表
export interface IDepStaffList {
  staffId: string;
  userId: string;
  staffName: string;
  resource?: string;
  avatar: string;
  isLeader: number;
  jobNumber?: string;
  deptId: number;
  deptName?: string;
  position?: string;
  businessModel?: string;
  businessArea?: string;
  officePlace?: string;
  accountStartTime?: string;
  accountEndTime?: string;
  isDeleted: number;
}
// 批量导入员工历史记录
export interface IStaffImpList {
  batchId: string;
  title: string;
  batchCode: string;
  dateCreated: string;
  createBy: string;
  status: number;
  successCount: number;
  totalCount: number;
}
