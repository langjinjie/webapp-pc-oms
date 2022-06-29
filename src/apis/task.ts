import http from 'src/utils/http';
type HttpFC<T = any> = (param?: T, fn?: Function) => Promise<any>;

/**
 * 1.1 获取策略模板列表
 * @param param
 */
export const getTaskStrategyTplList: HttpFC<
  Partial<{
    tplCode: string;
    tplName: string;
    pageNum: number;
    pageSize: number;
  }>
> = (param) => {
  return http.get('/tenacity-admin/api/strategy/tpl/list', param);
};
/**
 * 1.2、查询策略任务模板详情接口（Admin端和策略服务）
 * @param param
 */
export const getTaskStrategyTplDetail: HttpFC<{ tplId: string }> = (param) => {
  return http.get('/tenacity-admin/api/strategy/tpl/detail', param);
};
/**
 * 1.3、上架策略任务模板到机构接口
 * @param param
 */
export const onLineTaskTplWithCorps: HttpFC<{ tplId: string; onlineCorps: { onlineCorpId: string }[] }> = (param) => {
  return http.get('/tenacity-admin/api/strategy/online', param);
};
/**
 * 1.4、下架策略任务模板到机构接口
 * @param param
 */
export const offLineTaskTpl: HttpFC<{ tplId: string }> = (param) => {
  return http.get('/tenacity-admin/api/strategy/offline', param);
};
/**
 * 1.5、配置策略任务模板展示信息接口
 * @param param
 */
export const editTplDisplay: HttpFC<{ tplId: string }> = (param) => {
  return http.get('/tenacity-admin/api/strategy/display/edit', param);
};
/**
 * 1.6、获取节点类别接口
 * @param param
 */
export const getNodeTypeList: HttpFC = () => {
  return http.get('/tenacity-admin/api/strategy/node/type/list');
};

/**
 * 场景模块
 *
 */
/**
 * 1.15、查询场景列表接口
 * @param param
 */
export const getSceneList: HttpFC = () => {
  return http.get('/tenacity-admin/api/strategy/scene/list');
};
/**
 * 1.16、查询场景详情接口
 * @param param
 */
export const getSceneDetail: HttpFC = () => {
  return http.get('/tenacity-admin/api/strategy/scene/detail');
};
