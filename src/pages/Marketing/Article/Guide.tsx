import React from 'react';
import styles from './style.module.less';

// 如何绑定公众号操作手册
const Guide: React.FC = () => {
  return (
    <div className={styles.wrap}>
      <div className={styles.content}>
        <h2>如何添加公众号？</h2>
        <p>1、公众号是微信公众号的名称，必须取全称。下面以“中国光大银行”作为实例。</p>
        <p>
          <img src={require('src/assets/images/marketing/publicAddress1.png')} alt="" />
        </p>
        <p>{'2、年高内部运营系统->营销素材->新增热门文章中输入公众号，多个公众号用逗号分隔。'}</p>
        <p>
          <img src={require('src/assets/images/marketing/publicAddress2.png')} alt="" />
        </p>
        <p>
          {
            '3、年高内部运营系统->营销素材->文章库中查看公众号爬取的内容，这部分内容会在小程序中，方便理财经理展业使用。如果爬取失败，请联系客服。'
          }
        </p>
      </div>
    </div>
  );
};

export default Guide;
