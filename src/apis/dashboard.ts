import http from 'src/utils/http';
type HttpFC<T = { [key: string]: unknown }> = (param?: T, config?: any) => Promise<any>;
type HttpVoid = () => Promise<any>;

/**
 * @description 获取看板整体数据
 * @param param param
 * @returns Promise<any>
 */
export const getDashboardData: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/data/bi/generalView', param, config);
};

/**
 * @description 获取看单项数据列表
 * @param param param
 * @returns Promise<any>
 */
export const getDashboardItemData: HttpFC = (param, config) => {
  return http.post('/tenacity-admin/api/data/bi/whole/list', param, config);
};
/**
 * @description 获取看单项数据列表
 * @param param param
 * @returns Promise<any>
 */
export const getDashboardTeamDetail: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/whole/teamdetail', param);
};
/**
 * @description 获取看单项数据列表
 * @param param param
 * @returns Promise<any>
 */
export const getModelList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/whole/staffbusinessModel', param);
};

export const getListTotal: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/whole/total', param);
};

// 报表下载列表
export const dataDownloadList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/download/filelist', param);
};
// 1.3、异步生成数据接口
export const asyncCreateDownloadFile: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/download/asyndownload', param);
};
// 下载数据文件接口
export const exportFileWithTable: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/download/downloadfile', param, {
    responseType: 'blob',
    timeout: 120000
  });
};
// 1.6、【新增】指定团队近30日曲线数据接口
export const getTeamLineChartData: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/whole/team30detail', param);
};
// 1.7、【新增】指定团队近30日曲线数据接口
export const getTeamLineChartData1: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/tag/clienttagrate', param);
};
// 1.8、【新增】客户标签覆盖率接口
export const getTagCoverageRate: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/tag/clienttagrate', param);
};
// 1.9、【新增】在线培训视频完成率数据接口
export const getVideoFinrateData: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bi/train/videofinrate', param);
};

/**
 * @description 获取下载报名分类
 * @param param
 */
export const requestGetTempleList: HttpVoid = () => {
  return http.post('/tenacity-admin/api/data/download/templelist');
};

/* ------------------------------ 大屏驾驶舱 ------------------------------ */
/**
 * @description 总体数据接口
 */
export const requestGetBicontrolAdminView: HttpVoid = () => {
  return http.post('/tenacity-admin/api/data/bicontrol/adminView');
};

/**
 * @description 团队排名接口
 */
export const requestGetBicontrolTeamlist: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bicontrol/teamlist', param);
};

/**
 * @description 客户经理排名接口
 */
export const requestGetBicontrolStafflist: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bicontrol/stafflist', param);
};

/**
 * @description 查看文章分类排名接口
 */
export const requestGetBicontrolNewstypelist: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bicontrol/newstypelist', param);
};

/**
 * @description 查看产品排名接口
 */
export const requestGetBicontrolProductlist: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bicontrol/productlist', param);
};

/**
 * @description 销售概率险种排名接口
 */
export const requestGetBicontrolTagslist: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bicontrol/tagslist', param);
};

/**
 * @description 中心大区列表接口
 * @param param
 */
export const requestGetDepttypeList: HttpFC = (param) => {
  return http.post('/tenacity-admin/api/data/bicontrol/depttype', param);
};
