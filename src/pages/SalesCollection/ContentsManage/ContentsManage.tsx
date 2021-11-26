import React, { useContext, useEffect, useState } from 'react';
import {
  ContentBanner,
  EditOrAddCatalog,
  AddOrEditLastCatalog,
  ConfirmModal
} from 'src/pages/SalesCollection/ContentsManage/component';
import { ICatalogItem, IFirmModalParam, IEditOrAddCatalogParam, IEditOrAddLastCatalogParam } from 'src/utils/interface';
import { getCategoryList } from 'src/apis/salesCollection';
import { Context } from 'src/store';
import style from './style.module.less';

const ContentsManage: React.FC = () => {
  const { currentCorpId: corpId } = useContext(Context);
  const [contentsList, setContentList] = useState<ICatalogItem[]>([]);
  const [currentContents, setCurrentContents] = useState<string>(''); // 当前展开的目录
  const [editOrAddCatalogVisible, setEditOrAddCatalogVisible] = useState(false);
  const [editOrAddCatalogParam, setEditOrAddCatalogParam] = useState<IEditOrAddCatalogParam>();
  const [editOrAddLastCatalogParam, setEditOrAddLastCatalogParam] = useState<IEditOrAddLastCatalogParam>();
  const [firmModalParam, setFirmModalParam] = useState<IFirmModalParam>({ visible: false, title: '', content: '' });
  // 获取一级目录列表
  const getCatalogList = async () => {
    const res = await getCategoryList({ corpId });
    res && setContentList(res);
  };

  useEffect(() => {
    getCatalogList();
  }, []);

  useEffect(() => {
    if (firmModalParam.title === '成功' && !firmModalParam.visible) {
      getCatalogList();
    }
  }, [firmModalParam]);
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
              setEditOrAddCatalogVisible={setEditOrAddCatalogVisible}
              setFirmModalParam={setFirmModalParam}
              firmModalParam={firmModalParam}
              editOrAddLastCatalogParam={editOrAddLastCatalogParam as IEditOrAddLastCatalogParam}
              setEditOrAddLastCatalogParam={setEditOrAddLastCatalogParam}
            />
          </div>
        ))}
      </div>
      <EditOrAddCatalog
        editOrAddCatalogVisible={editOrAddCatalogVisible}
        setEditOrAddCatalogVisible={setEditOrAddCatalogVisible}
        editOrAddCatalogParam={editOrAddCatalogParam as IEditOrAddCatalogParam}
        setFirmModalParam={setFirmModalParam}
      />
      <AddOrEditLastCatalog
        editOrAddLastCatalogParam={editOrAddLastCatalogParam as IEditOrAddLastCatalogParam}
        setEditOrAddLastCatalogParam={setEditOrAddLastCatalogParam}
      />
      <ConfirmModal firmModalParam={firmModalParam} setFirmModalParam={setFirmModalParam} />
    </>
  );
};
export default ContentsManage;
