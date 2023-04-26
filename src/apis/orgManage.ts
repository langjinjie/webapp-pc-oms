import http from 'src/utils/http';
type HttpFC<T = any> = (param: T, fn?: Function) => Promise<any>;
type HttpVoid = () => Promise<any>;
/* 机构管理 */
// 获取机构列表
export const requestGetCorpList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/corp/list');
};

// 获取机构员工列表1
export const requestGetStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/staff/list', param);
};

// 员工激活/停用
export const requestSetStaffOpstatus: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/staff/opstatus', param);
};

// 手动同步通讯录
export const requestSyncSpcontentdel: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/collect/spcontentdel', param);
};

// 导出表格
export const requestLeadingOutExcel: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/staff/download', param, {
    responseType: 'blob'
  });
};

/* 敏感词管理 */
// 获取敏感词列表
export const requestGetSensitiveList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/list', param);
};
// 获取敏感词类型接口
export const requestGetSensitiveTypeList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/type/list', param);
};
// 敏感词类型新增接口
export const requestAddSensitiveType: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/type/add', param);
};
// 敏感词新增/编辑接口
export const requestEditSensitiveWord: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/edit', param);
};
// 敏感词(上架/下架/删除接口)
export const requestManageSensitiveWord: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/batch/manage', param);
};
// 敏感词批量新增接口
export const requestAddSensitiveList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/batch/add', param);
};
// 敏感词全量导出接口、下载敏感词模板
export const requestDownLoadSensitiveList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/sensitive/export', param, {
    responseType: 'blob'
  });
};

/**
 * 组织架构->员工列表接口
 */
// 获取组织架构员工列表
export const requestGetDepStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/stafflist', param);
};
// 批量导入历史记录别表接口
export const requestGetHistoryLoad: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/implist', param);
};
// 员工批量导入接口
export const requestImportStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/impstaff', param);
};
// 导入异常表格下载
export const requestDownLoadFailLoad: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/impdownload', param, {
    responseType: 'blob'
  });
};
// 批量导出员工信息接口
export const requestDownStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/saffExp', param, {
    responseType: 'blob'
  });
};
// 获取组织架构
export const requestGetDeptList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/deptlist', param);
};
// 批量设置保存接口
export const requestMultiSave: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/batchsetsave', param);
};
// 员工(批量)删除
export const requestDelStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/staffdel', param);
};

/**
 * 部门员工搜索接口
 */
export const searchStaffList: HttpFC<{
  keyWords: string;
  searchType?: 1 | 2; // 1-部门 2-员工
  isDeleted?: 0 | 1; // 0-在职 1-离职
  isFull?: boolean; // 信息是否完善
}> = (param) => {
  return http.post('/tenacity-admin/api/stafforg/searchstaff', param);
};
/**
 * 坐席详情模块
 ********************************************/
// 获取坐席详情
export const getStaffDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/staffinfo', param);
};
// 保存坐席信息
export const saveStaffDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/usersave', param);
};

/**
 * 数据免统计名单
 *********************************************/
// 免统计名单列表
export const getFreeStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/user/freeStats/list', param);
};

// 批量删除免统计员工
export const delFreeStaffs: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/user/freeStats/del', param);
};
// 查询坐席员工接口
export const searchStaffByName: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/freeStats/findByName', param);
};

// 新增免统计员工
export const addFreeStaffs: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/user/freeStats/add', param);
};

/**
 * 客户免统计模块
 * *************************************************/
// 客户免统计列表
export const getCustomerFreeList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/free/clientFreeStats/list', param);
};
// 客户免统计删除
export const delFreeCustomer: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/free/clientFreeStats/del', param);
};
// 查询外部联系人
export const getCustomerByExternalUserId: HttpFC<{ externalUserId: string }> = (param) => {
  return http.post('/tenacity-admin/api/free/clientFreeStats/findByExternalUserid', param);
};
// 新增免统计
export const addFreeCustomer: HttpFC<{ externalUserId: string; addReason: string }> = (param) => {
  return http.post('/tenacity-admin/api/free/clientFreeStats/add', param);
};

// 批量新增免统计
export const batchAddFreeCustomer: HttpFC = (param, fn) => {
  return http.post('/tenacity-admin/api/free/clientFreeStats/upload', param, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 200000,
    transformRequest: [
      function (data: any) {
        return data;
      }
    ],
    onUploadProgress: (progressEvent: any) => {
      const persent = ((progressEvent.loaded / progressEvent.total) * 100) | 0; // 上传进度百分比
      fn?.(persent);
    }
  });
};

/**
 * 导出运营专属报表
 * @param param
 */
export const exportSpecialList: HttpFC = (param: object) => {
  return http.post('/tenacity-admin/api/stafforg/saffspecialexport', param, {
    responseType: 'blob'
  });
};

/**
 * 导出客户免统计名单
 *
 */
export const exportFreeList: HttpFC = (param: object) => {
  return http.post('/tenacity-admin/api/free/clientFreeStats/downClientStat', param, {
    responseType: 'blob'
  });
};

/**
 * 查询用户组列表
 */
export const requestGetGroupList: (param: { [key: string]: any }) => Promise<any> = (param) => {
  return http.post('/tenacity-admin/api/privilege/group/list', param);
};
/**
 * 查询用户组标签
 */
export const requestGetGroupTagList: HttpFC = (param: { [key: string]: any }) => {
  return http.post('/tenacity-admin/api/privilege/group/tag/list', param);
};
/**
 * 查询人员标签列表
 */
export const requestGetStaffTagList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/staff/tag/list', param);
};
/**
 * 新增用户组标签
 */
export const requestAddGroupTag: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/group/tag/add', param);
};
/**
 * 新增用户组-筛选
 */
export const requestGetFilterGroup: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/group/filter', param);
};
/**
 * 新增/编辑用户组
 */
export const requestAddGroup: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/group/addoredit', param);
};
/**
 * 新增用户组-查看人员
 */
export const requestGetGroupStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/group/filter/staff', param);
};
/**
 * 查看用户组
 */
export const requestGetGroupDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/group/detail', param);
};
/**
 * 查看用户组的成员列表(查看人员)
 */
export const requestGetViewGroupStaffList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/group/staff', param);
};
/**
 * 系统菜单列表
 */
export const getMenuList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/sys/menu/list', param);
};
// 新增或者编辑菜单
export const addOrEditMenu: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/sys/menu/addoredit', param);
};
// 关闭/启用系统菜单接口
export const operateMenu: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/sys/menu/status/man', param);
};
// 删除系统菜单接口
export const deleteMenu: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/sys/menu/del', param);
};
// 搜索系统菜单接口
export const searchMenu: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/privilege/sys/menu/search', param);
};
/**
 * @description 批量修改信息校验
 */
export const requestStaffBatchSetSaveValidate: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/stafforg/staffBatchSetSaveValidate', param);
};
// 查询聊天记录列表接口
export const getChatList: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/proposal/getHistory', params);
};
// 查询详细沟通记录
export const getChatDetail: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/proposal/get', params);
};
// 查询详细沟通记录接口
export const getChatSearchList: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/proposal/getDynamicList', params);
};

//
