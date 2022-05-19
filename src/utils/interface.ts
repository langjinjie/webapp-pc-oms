export interface Nav {
  name: string;
  path?: string;
}

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
  entryValue: string;
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

// 话术类型参数
export interface IContentParam {
  name: string;
  contentType: number;
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
  deptId?: string;
  deptName?: string;
  deptType?: number;
  dType?: number;
  effCount?: number;
  isLeaf?: boolean;
  index?: number;
  totalCount?: number;
  leaderId?: string;
  leaderName?: string;
  total?: number;
  path?: string[];
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
  sign?: boolean;
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

/**
 * 积分商城
 */
// 积分发放列表
export interface IPointsProvideList {
  summaryId: string;
  staffId: string;
  points: number;
  staffName: string;
  staffUserId: string;
  date: string;
  blackClientNum: number;
  sendPoints: number;
  blackPoints: number;
  mustSendPoints: number;
  sendedPoints: number;
  recoveryPoints: number;
  sendStatus: number;
  sendTime: string;
  opName: string;
}
// 积分发放详情列表
export interface ISendPointsDetail {
  rewardId: string;
  blackTask: number;
  staffId: string;
  date: string;
  taskFinishTime: string;
  businessType: number;
  pointsTaskId: string;
  taskName: string;
  actionNum: number;
  realActionNum: number;
  action: number;
  rewardPoints: number;
  sendStatus: number;
  remark: string;
  flowList: IFlowList[];
}
// 积分奖励流水列表
export interface IFlowList {
  flowId: string;
  clientNickName: string;
  externalUserid: string;
  clientInBlack: number;
  content: string;
  rewardId?: string;
}

export interface IConfirmModalParam {
  visible: boolean;
  title?: string;
  tips?: string;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
}
// 积分管理->抽奖设置 部门列表
export interface ITreeDate {
  deptId: string;
  fullDeptId: string;
  deptName: string;
  fullDeptName: string;
  level: number;
  isLeaf: number;
}
// 可见范围部门
export interface IDeptRecord {
  scopeDeptIds: string;
  scopeFullDeptIds: string;
  scopeDeptNames: string;
  scopeFullDeptNames: string;
  opName: string;
  opTime: string;
}

// 角色管理-角色列表
export interface IRoleList {
  roleId: string;
  roleName: string;
  roleRange?: string;
  status: number;
  isDefault: number;
  userNum: number;
}

/**
 * 机构管理-用户组管理
 */
// 用户组管理列表
export interface IGroupItem {
  groupId: string;
  groupCode: string;
  groupName: string;
  desc: string;
  staffNum: number;
  createTime: string;
}
// 用户组标签
export interface IGroupTag {
  groupTagId: string;
  name: string;
  filterName: string;
  createTime: string;
}
// 菜单
export interface MenuItem {
  sysType?: number;
  menuId: string;
  fullMenuId: string;
  menuName: string;
  menuIcon: string;
  menuType: number;
  path: string;
  buttonType?: number;
  parentId?: string;
  level: number;
  isLeaf: number;
  enable: number;
  menuCode: string;
  children: MenuItem[];
}
