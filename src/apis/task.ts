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
  return http.post('/tenacity-admin/api/strategy/tpl/list', param);
  // return http.post('http://127.0.0.1:4523/m1/1226778-0-default/tenacity-oms/api/strategy/tpl/list', param);
};
/**
 * 1.2、查询策略任务模板详情接口（Admin端和策略服务）
 * @param param
 */
export const getTaskStrategyTplDetail: HttpFC<{ tplId: string }> = (param) => {
  return http.post('http://127.0.0.1:4523/m1/1226778-0-default/tenacity-oms/api/strategy/tpl/detail', param);
  // return http.post('/tenacity-admin/api/strategy/tpl/detail', param);
};
/**
 * 1.3、上架策略任务模板到机构接口
 * @param param
 */
export const onLineTaskTplWithCorps: HttpFC<{ tplId: string; onlineCorps: { onlineCorpId: string }[] }> = (param) => {
  return http.post('/tenacity-admin/api/strategy/online', param);
};
/**
 * 1.4、下架策略任务模板到机构接口
 * @param param
 */
export const offLineTaskTpl: HttpFC<{ tplId: string }> = (param) => {
  return http.post('/tenacity-admin/api/strategy/offline', param);
};
/**
 * 1.5、配置策略任务模板展示信息接口
 * @param param
 */
export const editTplDisplay: HttpFC<{ tplId: string }> = (param) => {
  return http.post('/tenacity-admin/api/strategy/display/edit', param);
};
/**
 * 1.6、获取节点类别接口
 * @param param
 */
export const getNodeTypeList: HttpFC = () => {
  return http.post('/tenacity-admin/api/strategy/node/type/list');
};
/**
 * 1.9、获取触达方式
 * @param param
 */
export const getTouchWayList: HttpFC = () => {
  return http.post('/tenacity-admin/api/strategy/touchway/list');
};

/**
 * 场景模块
 *
 */
/**
 * 1.15、查询场景列表接口
 * @param param
 */
export const getSceneList: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/scene/list', params);
};
/**
 * 1.16、查询场景详情接口
 * @param param
 */
export const getSceneDetail: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/scene/detail', params);
};
/**
 * 1.17、查询动作规则详情接口
 * @param param
 */
export const getActionRuleDetail: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/actionrule/detail', params);
};
/**
 * 1.19、查询节点规则列表接口（Admin端和策略服务）
 * @param param
 */
export const getNodeRuleList: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/noderuleV2/list', params);
};

// 1.21、新建/编辑节点规则接口
export const createNodeRule: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/noderule/addoredit', params);
};
// 1.22、查询动作规则列表接口
export const getActionRuleList: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/actionrule/list', params);
};
// 1.23、查询节点列表接口（Admin端和策略服务）
export const getNodeList: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/node/list', params);
};
// 1.24、删除节点接口（Admin端和策略服务）
export const deleteNode: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/node/del', params);
};
// 1.25、新增节点接口（Admin端和策略服务）
export const addNode: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/node/add', params);
};

// 1.26、获取日期类节点的到期日列表接口
export const getNodeNameWithDate: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/strategy/node/expiredate/list', params);
};
// 1.27、获取标签类节点的标签组列表接口
export const queryTagList: HttpFC = () => {
  return http.post('/tenacity-admin/api/strategy/node/taggroup/list');
};

// 1.29、获取指标类节点的指标列表接口
export const queryTargetList: HttpFC = () => {
  return http.post('/tenacity-admin/api/strategy/node/data/list');
};
/**
 * 1. 28获取标签库接口
 *
 */
export const searchTagList: HttpFC = (params) => {
  return http.post('/tenacity-admin/api/tag/group/info2', params);
};
