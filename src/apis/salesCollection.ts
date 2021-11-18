import http from 'src/utils/http';

type HttpFunction<T = Object> = (param: T, fn?: Function) => Promise<any>;
/* 话术模块 */
/**
 * 查询话术列表
 */
export const getSpeechList: HttpFunction = (params) => {
  // return http.post('/tenacity-admin/api/smart/content/list', params);
  return http.post('http://rap2api.taobao.org/app/mock/294104/tenacity-admin/api/smart/content/list', params);
};
// 查询话术详情
export const getSpeechDetail: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/smart/content/detail', params);
};

// 话术新增&编辑
export const editSpeech: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/smart/content/edit', params);
};

// 话术排序
export const sortSpeech: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/smart/content/savesort', params);
};

// 话术批量新增导入接口
export const addBatchSpeech: HttpFunction = (params, fn) => {
  return http.post('/tenacity-admin/api/smart/content/import', params, {
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
      console.log('persent', persent);
    }
  });
};

// 话术单条导出
export const exportSpeech: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/smart/content/export', params, {
    responseType: 'blob'
  });
};

// 话术全量导出
export const batchExportSpeech: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/smart/content/batchexport', params, {
    responseType: 'blob'
  });
};

// 话术(上架/下架/待上架/删除)接口
export const operateSpeechStatus: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/smart/content/batch/manage', params);
};

// 话术敏感词检车
export const checkSensitive: HttpFunction = (params) => {
  return http.post('/tenacity-admin/api/smart/sensitive/check', params);
};
