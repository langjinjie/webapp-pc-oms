import React from 'react';
import { ContentBanner } from 'src/pages/SalesCollection/component';
import style from './style.module.less';

const ContentsManage: React.FC = () => {
  const contentsList = new Array(5).fill(1);
  return (
    <div className={style.wrap}>
      {contentsList.map((_, index) => (
        <div className={style.contentBannerWrap} key={index}>
          <ContentBanner isFirstContents={true} />
        </div>
      ))}
    </div>
  );
};
export default ContentsManage;
