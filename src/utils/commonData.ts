interface IStatus2Name {
  [key: string]: string;
}

// 账号管理状态对照表
export const serviceType2Name: IStatus2Name = { 1: '对公', 2: '零售', 3: '对公+零售' };
export const accountStatus2Name: IStatus2Name = { 1: '在用', 2: '停用', 4: '未激活' };
export const accountStatusEdit2Name: IStatus2Name = { 1: '停用', 2: '/', 4: '激活' };
export const staffStatus2Name: IStatus2Name = { 0: '在职', 1: '离职' };
// 标签管理分类对照表
export const categoryKey2Name = {
  productTagList: '产品库',
  newsTagList: '文章库',
  posterTagList: '海报库',
  activityTagList: '活动库'
};
// 敏感词管理->敏感词状态
export const sensitiveStatusList = [
  { value: 0, label: '待上架' },
  { value: 1, label: '已上架' },
  { value: 2, label: '已下架' }
];
