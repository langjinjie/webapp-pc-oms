import React, { useContext, useEffect, useState } from 'react';
import {
  ContentBanner,
  EditOrAddCatalog,
  AddOrEditLastCatalog,
  ConfirmModal
} from 'src/pages/SalesCollection/ContentsManage/component';
import { ICatalogItem, IFirmModalParam, IEditOrAddCatalogParam } from 'src/utils/interface';
import { getCategoryList } from 'src/apis/salesCollection';
import { Context } from 'src/store';
import style from './style.module.less';

const ContentsManage: React.FC = () => {
  const { currentCorpId: corpId } = useContext(Context);
  const [contentsList, setContentList] = useState<ICatalogItem[]>([]);
  const [currentContents, setCurrentContents] = useState<string>(''); // 当前展开的目录
  const [editOrAddCatalogParam, setEditOrAddCatalogParam] = useState<IEditOrAddCatalogParam>();
  const [editOrAddLastCatalogParam, setEditOrAddLastCatalogParam] = useState<IEditOrAddCatalogParam>();
  const [firmModalParam, setFirmModalParam] = useState<IFirmModalParam>({ visible: false, title: '', content: '' });
  // 获取一级目录列表
  const getCatalogList = async () => {
    const res = await getCategoryList({ corpId });
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
              parentId="0"
              catalog={item}
              setCurrentContents={setCurrentContents}
              currentContents={currentContents}
              isHiddenMoveUp={contentsList.length === 1 || index === 0}
              isHiddenMoveDown={contentsList.length === 1 || index === contentsList.length - 1}
              setEditOrAddCatalogParam={setEditOrAddCatalogParam}
              setFirmModalParam={setFirmModalParam}
              setEditOrAddLastCatalogParam={setEditOrAddLastCatalogParam}
              setParentChildrenList={setContentList}
            />
          </div>
        ))}
      </div>
      <EditOrAddCatalog
        editOrAddCatalogParam={editOrAddCatalogParam as IEditOrAddCatalogParam}
        setEditOrAddCatalogParam={setEditOrAddCatalogParam}
        setFirmModalParam={setFirmModalParam}
      />
      <AddOrEditLastCatalog
        editOrAddLastCatalogParam={editOrAddLastCatalogParam as IEditOrAddCatalogParam}
        setEditOrAddLastCatalogParam={setEditOrAddLastCatalogParam}
        setFirmModalParam={setFirmModalParam}
      />
      <ConfirmModal firmModalParam={firmModalParam} />
    </>
  );
};
export default ContentsManage;
