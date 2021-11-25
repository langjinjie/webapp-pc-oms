import React, { useContext, useEffect, useState } from 'react';
import { ContentBanner, AddOrEditContent } from 'src/pages/SalesCollection/component';
import { IAddOrEditModalParam, ICatalogItem } from 'src/utils/interface';
import { getCategoryList } from 'src/apis/salesCollection';
import { Context } from 'src/store';
import style from './style.module.less';

const ContentsManage: React.FC = () => {
  const { currentCorpId: corpId } = useContext(Context);
  const [contentsList, setContentList] = useState<ICatalogItem[]>([]);
  const [currentContents, setCurrentContents] = useState<string>('');
  const [modalParam, setModalParam] = useState<IAddOrEditModalParam>({
    visible: false,
    type: 0,
    islastlevel: false,
    title: '',
    content: ''
  });
  // 获取一级目录列表
  const getCatalogList = async () => {
    const res = await getCategoryList({ corpId });
    console.log(res);
    res && setContentList(res);
  };

  useEffect(() => {
    getCatalogList();
  }, []);
  return (
    <>
      <div className={style.wrap}>
        {contentsList.map((item, index) => (
          <div className={style.contentBannerWrap} key={item.catalogId}>
            <ContentBanner
              bannerInfo={item}
              setCurrentContents={setCurrentContents}
              currentContents={currentContents}
              setModalParam={setModalParam}
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
