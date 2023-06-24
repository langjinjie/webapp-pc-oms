/**
 * 人群包管理
 */
import http, { HttpFunction } from 'src/utils/http';

/**
 * @description 1、查询分群列表接口
 * @param param
 */
export const requestGetPackageList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/list', param);
};

/**
 * @description 2、暂停/开启人群包
 * @param param

 */
export const requestManagePackageRun: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/run/man', param);
};

/**
 * @description 3、人群包计算接口
 * @param param
 */
export const requestGetPackageCompute: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/compute', param);
};

/**
 * @description 4、批量删除人群包
 * @param param
 */
export const requestGetDelPackage: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/del', param);
};

/**
 * @description 5、导出人群包
 * @param param
 */
export const requestExportPackage: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/export', param);
};

/**
 * @description 6、查看人群包下载列表
 * @param param
 */
export const requestGetPackageDownloadList: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/download/list', param);
};

/**
 * @description 7、获取人群包下载文件
 * @param param
 * @returns fileUrl
 */
export const requestDownloadPackageFile: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/download/file', param, {
    responseType: 'blob'
  });
};

/**
 * @description 8、分群详情接口
 * @param param
 */
export const requestGetPackageDetail: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/detail', param);
};

/**
 * @description 10、查看人群包规则
 * @param param
 */
export const requestGetPackageRule: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/rule', param);
};

/**
 * @description 11、创建分群
 * @param param
 */
export const requestCreatePackageRule: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/create', param);
};

// 1.14、查询人员属性配置（数量级几百）（新增）
export const getAttrConfigOptions: HttpFunction = (param) => {
  return http.post('/tenacity-admin/api/tag/package/attr/config', param);
};

//
