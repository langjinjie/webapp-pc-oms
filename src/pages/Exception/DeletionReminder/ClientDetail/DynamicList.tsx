/**
 * @name DynamicList
 * @author Lester
 * @date 2021-07-07 09:54
 */
import React, { useEffect, useState } from 'react';
// import moment from 'moment';
import classNames from 'classnames';
import { TagEmpty, ScrollList } from 'src/components';
import { requestGetClientDynamic } from 'src/apis/exception';
import style from './style.module.less';

interface Dynamic {
  itemId: string;
  itemName: string;
  createTime: string;
  type: number;
  clientName: string;
}

interface DynamicListProps {
  externalUserid: string;
  followStaffId: string;
}

interface PageParam {
  pageNum: number;
  pageSize: number;
  externalUserid?: string;
}

const DynamicList: React.FC<DynamicListProps> = ({ externalUserid, followStaffId }) => {
  const [dynamicList, setDynamicList] = useState<Dynamic[]>([]);
  const [pageParam, setPageParam] = useState<PageParam>({ pageNum: 1, pageSize: 20 });
  const [loaded, setLoaded] = useState<boolean>(false);

  const typeNames: string[] = [
    '浏览了你推荐的产品',
    '浏览了你推荐的文章',
    '浏览了你推荐的活动',
    '成为你的客户',
    '删除了好友关系',
    '分享了你推荐的文章'
  ];

  const getDynamicList = async (param?: any) => {
    const params: any = {
      ...pageParam,
      ...param,
      externalUserid,
      followStaffId
    };
    console.log('params', params);
    const res: any = await requestGetClientDynamic(params);
    if (res) {
      const { list } = res;
      const resList = list || [];
      setLoaded(resList.length === 0);
      if (params.pageNum === 1) {
        setDynamicList(resList);
      } else {
        setDynamicList([...dynamicList, ...resList]);
      }
      setPageParam(params);
    }
  };

  useEffect(() => {
    getDynamicList();
  }, []);

  return (
    <div className={style.dynamicWrap}>
      {dynamicList.length === 0 && <TagEmpty className={style.emptyWrap} type="movement" />}
      {dynamicList.length > 0 && (
        <ScrollList
          loaded={loaded}
          onLoad={() => getDynamicList({ pageNum: pageParam.pageNum + 1 })}
          onRefresh={() => getDynamicList({ pageNum: 1 })}
          hideFooterTips
        >
          <ul className={style.dynamicList}>
            {dynamicList.map((item: Dynamic, index) => (
              <li key={item.itemId + index} className={style.dynamicItem}>
                <span className={style.dynamicDate}>
                  {(item.createTime || '').split(' ')[0]}
                  {/* {moment(item.createTime).format('YYYY-MM-DD')} */}
                  <br />
                  {(item.createTime || '').split(' ')[1]}
                  {/* {moment(item.createTime).format('HH:mm:ss')} */}
                </span>
                <div className={style.dynamicCircle}>
                  <span className={style.circleInner} />
                </div>
                <div
                  className={classNames(style.dynamicInfo, {
                    [style.line]: index < dynamicList.length - 1
                  })}
                >
                  <div className={style.dynamicTitle}>
                    {item.clientName}
                    {typeNames[item.type - 1]}
                  </div>
                  {[1, 2, 3, 6].includes(item.type) && (
                    <div className={style.dynamicDesc}>
                      {item.type === 1 && (
                        <span className={classNames(style.dynamicLogo, style.dynamicProduct)}>产品</span>
                      )}
                      {[2, 6].includes(item.type) && (
                        <span className={classNames(style.dynamicLogo, style.dynamicArticle)}>文章</span>
                      )}
                      {item.type === 3 && (
                        <span className={classNames(style.dynamicLogo, style.dynamicArticle)}>活动</span>
                      )}
                      <span className={style.dynamicDescText}>{item.itemName}</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </ScrollList>
      )}
    </div>
  );
};

export default DynamicList;
