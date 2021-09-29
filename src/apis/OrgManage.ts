import http, { HttpFunction } from 'src/utils/http';

// 获取机构列表
export const requestGetCorpList: HttpFunction = (param: { [key: string]: any }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          { coprId: 'wwcb58cb32fb9b697a', corpName: '中国大地保险公司' },
          { coprId: 'wwcb58cb32fb9b697b', corpName: '中国大地保险公司杭州第二分公司第三小分部' },
          { coprId: 'wwcb58cb32fb9b697c', corpName: '中国人寿保险上海第二分公司' }
        ]
      });
    }, 1000);
  });
  return http.post('/tenacity-admin/api/corp/list', param);
};
