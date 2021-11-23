import React, { useState } from 'react';
import { ContentBanner, AddOrEditContent } from 'src/pages/SalesCollection/component';
import { IAddOrEditModalParam } from 'src/utils/interface';
import style from './style.module.less';

const ContentsManage: React.FC = () => {
  const contentsList = ['车险流程', '非车流程', '异议处理', '场景话术', '问答知识'];
  const [currentContents, setCurrentContents] = useState<string>('');
  const [modalParam, setModalParam] = useState<IAddOrEditModalParam>({
    visible: false,
    type: 0,
    islastlevel: false,
    title: '',
    content: ''
  });

  return (
    <>
      <div className={style.wrap}>
        {contentsList.map((item, index) => (
          <div className={style.contentBannerWrap} key={index}>
            <ContentBanner
              bannerInfo={{ name: item, catoryId: `${index}` }}
              setCurrentContents={setCurrentContents}
              currentContents={currentContents}
              setModalParam={setModalParam}
              isFirstLevelContents={true}
              isHiddenMoveUp={contentsList.length === 1 || index === 0}
              isHiddenMoveDown={contentsList.length === 1 || index === contentsList.length - 1}
            />
          </div>
        ))}
      </div>

      <AddOrEditContent modalParam={modalParam} setModalParam={setModalParam} />
    </>
  );
};
export default ContentsManage;
