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

// 目录类型对照
export const catalogType2Name = [
  { value: 1, label: '纯文字' },
  { value: 2, label: '图片' },
  { value: 3, label: '名片' },
  { value: 4, label: '小站' },
  { value: 5, label: '图文链接' },
  { value: 6, label: '音频' },
  { value: 7, label: '视频' },
  // { value: 8, label: '第三方链接' },
  { value: 9, label: '小程序' },
  { value: 10, label: 'PDF' }
];

// 销售宝典目录字数限制 一维数组代表目录类型,二维数组代表目录级数
export const catalogLmitLengtg = [
  [
    [4, 4],
    [4, 4],
    [1, 20]
  ],
  [
    [4, 4],
    [1, 5],
    [4, 4],
    [1, 20]
  ],
  [
    [4, 4],
    [1, 5],
    [1, 20]
  ],
  [
    [4, 4],
    [1, 5],
    [1, 5],
    [1, 5],
    [1, 20]
  ],
  [
    [4, 4],
    [1, 5],
    [1, 5],
    [1, 5],
    [1, 20]
  ]
];

// 销售宝典目录字数限制 一维数组代表目录类型,二维数组代表目录级数
export const catalogLmitLengtgTip = [
  [['4个字'], ['4个字'], ['最多50个字']],
  [['4个字'], ['最多5个字'], ['4个字'], ['最多50个字']],
  [['4个字'], ['最多5个字'], ['最多20个字']],
  [['4个字'], ['最多5个字'], ['最多5个字'], ['最多5个字'], ['最多50个字']],
  [['4个字'], ['最多5个字'], ['最多5个字'], ['最多5个字'], ['最多50个字']]
];

export const catalogLastLeve = [2, 3, 2, 4, 4];

// 角色管理: 增加角色类型的角色类型和路由对照表
export const roleTypeRouteList = ['/roleMangeOms/add', '/roleMangeB/add', '/roleMangeA/add'];
