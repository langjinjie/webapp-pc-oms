/**
 * @name ServiceSuggestion
 * @author Lester
 * @date 2021-07-08 10:30
 */
import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { copy } from 'tenacity-tools';
import { useHistory } from 'react-router-dom';
import { Icon, TagEmpty } from 'src/components';
// import { queryRecommendInfo } from 'src/apis/client';
// import { wxOpenEnterpriseChat } from 'src/utils/wx';
import style from './style.module.less';

interface ServiceSuggestionProps {
  externalUserid: string;
}

interface Article {
  articleId: string;
  articleName: string;
  articleImgUrl: string;
}

interface Product {
  productId: string;
  productName: string;
  productImgUrl: string;
  corpProductLink: string;
}

interface Activity {
  activityId: string;
  activityImgUrl: string;
  activityName: string;
  corpActivityLink: string;
}

interface RecommendInfo {
  clientCategory?: string;
  clientCategoryUrl?: string;
  recommendConcatTime?: string;
  multiCar?: number;
  recommendProductList?: Product[];
  recommendArticleList?: Article[];
  recommendActivityList?: Activity[];
}

const ServiceSuggestion: React.FC<ServiceSuggestionProps> = ({ externalUserid }) => {
  const [recommendInfo, setRecommendInfo] = useState<RecommendInfo>({});

  const history = useHistory();

  const getRecommendInfo = async () => {
    // const res: any = await queryRecommendInfo({ externalUserid });
    const res: any = null;
    if (res) {
      setRecommendInfo(res);
    }
  };

  const copyText = (text: string, type: number) => {
    const recommendTypes = ['产品', '文章', '活动'];
    copy(text, false);
    message.success(`复制成功，去营销平台-${recommendTypes[type]}库搜索标题哦`);
  };

  useEffect(() => {
    getRecommendInfo();
  }, []);

  return (
    <>
      {Object.keys(recommendInfo).length === 0 && (
        <div className={style.emptyWrap}>
          <TagEmpty type="service" />
          <Button className={style.addBtn} onClick={() => history.push('/clientList/editTag', { externalUserid })}>
            <Icon className={style.addIcon} name="tianjiabiaoqian" />
            添加标签
          </Button>
        </div>
      )}
      {Object.keys(recommendInfo).length > 0 && (
        <div className={style.serviceSuggestWrap}>
          <div className={style.cardIWrap}>
            <div className={style.cardContent}>
              <div className={style.cardInfo}>
                <div className={style.cardTips}>根据标签数据系统分析该客户为：</div>
                <div className={style.cardUserInfo}>
                  <div className={style.categoryName}>{recommendInfo.clientCategory || '未知'}</div>
                  {recommendInfo.multiCar === 1 && (
                    <img className={style.mulCar} src={require('src/assets/images/exception/multicar.png')} alt="" />
                  )}
                </div>
                <div className={style.intimacyTips}>
                  建议接触的时间：
                  <span className={style.intimacyValue}>{recommendInfo.recommendConcatTime}</span>
                </div>
                <Button className={style.sendBtn} /* onClick={() => wxOpenEnterpriseChat(externalUserid)} */>
                  <Icon className={style.messageIcon} name="biaotianliaotian" />
                  发送消息
                </Button>
              </div>
              <img className={style.cardImg} src={recommendInfo.clientCategoryUrl} alt="" />
            </div>
          </div>
          {recommendInfo.recommendProductList && recommendInfo.recommendProductList.length > 0 && (
            <div className={style.recommendWrap}>
              <div className={style.recommendTitle}>推荐的产品</div>
              <ul className={style.recommendList}>
                {(recommendInfo.recommendProductList || []).map((item: Product) => (
                  <li key={item.productId} className={style.recommendItem}>
                    <img className={style.recommendImg} src={item.productImgUrl} alt="" />
                    <div className={style.recommendName}>{item.productName}</div>
                    <Button className={style.copyBtn} onClick={() => copyText(item.productName, 0)}>
                      复制文案
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recommendInfo.recommendArticleList && recommendInfo.recommendArticleList.length > 0 && (
            <div className={style.recommendWrap}>
              <div className={style.recommendTitle}>推荐的文章</div>
              <ul className={style.recommendList}>
                {(recommendInfo.recommendArticleList || []).map((item: Article) => (
                  <li key={item.articleId} className={style.recommendItem}>
                    <img className={style.recommendImg} src={item.articleImgUrl} alt="" />
                    <div className={style.recommendName}>{item.articleName}</div>
                    <Button className={style.copyBtn} onClick={() => copyText(item.articleName, 1)}>
                      复制文案
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {recommendInfo.recommendActivityList && recommendInfo.recommendActivityList.length > 0 && (
            <div className={style.recommendWrap}>
              <div className={style.recommendTitle}>推荐的活动</div>
              <ul className={style.recommendList}>
                {(recommendInfo.recommendActivityList || []).map((item: Activity) => (
                  <li key={item.activityId} className={style.recommendItem}>
                    <img className={style.recommendImg} src={item.activityImgUrl} alt="" />
                    <div className={style.recommendName}>{item.activityName}</div>
                    <Button className={style.copyBtn} onClick={() => copyText(item.activityName, 2)}>
                      复制文案
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ServiceSuggestion;
