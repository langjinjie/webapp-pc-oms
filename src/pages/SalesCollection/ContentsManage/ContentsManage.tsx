import React, { useContext, useEffect, useState } from 'react';
import {
  ContentBanner,
  EditOrAddCatalog,
  AddOrEditLastCatalog,
  ConfirmModal,
  SyncSpeech
} from 'src/pages/SalesCollection/ContentsManage/component';
import { ICatalogItem, IFirmModalParam, IEditOrAddCatalogParam } from 'src/utils/interface';
import { getCategoryList } from 'src/apis/salesCollection';
import { Context } from 'src/store';
import { URLSearchParams, useDocumentTitle } from 'src/utils/base';
import { useDidRecover } from 'react-router-cache-route';
import { AuthBtn, Icon } from 'src/components';
import style from './style.module.less';
import classNames from 'classnames';

const ContentsManage: React.FC = () => {
  useDocumentTitle('销售宝典-目录管理');
  const { currentCorpId: corpId } = useContext(Context);
  const [contentsList, setContentList] = useState<ICatalogItem[]>([]);
  const [currentContents, setCurrentContents] = useState<string>(''); // 当前展开的目录
  const [editOrAddCatalogParam, setEditOrAddCatalogParam] = useState<IEditOrAddCatalogParam>();
  const [editOrAddLastCatalogParam, setEditOrAddLastCatalogParam] = useState<IEditOrAddCatalogParam>();
  const [firmModalParam, setFirmModalParam] = useState<IFirmModalParam>({ visible: false, title: '', content: '' });
  // 同步话术
  // const [syncSpeechVisible, setSyncSpeechVisible] = useState(false);

  // 获取一级目录列表
  const getCatalogList = async () => {
    const res = await getCategoryList({ corpId });
    res && setContentList(res);
  };

  // 新增一级目录
  const addClickHandle = () => {
    // 该级目录是否是最后一级目录
    console.log('新增一级目录');
  };

  useEffect(() => {
    getCatalogList();
  }, []);

  useDidRecover(() => {
    const { isCatch } = URLSearchParams(location.search);
    // 判断页面是否需要更新
    if (!isCatch) {
      getCatalogList();
    }
  });
  return (
    <>
      <div className={style.wrap}>
        {contentsList.map((item, index) => (
          <div className={style.contentBannerWrap} key={item.catalogId}>
            <ContentBanner
              parentId="0"
              catalog={item}
              parentCatalog={[item]}
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
        <AuthBtn path="/add">
          <span className={classNames(style.add)} onClick={() => addClickHandle()}>
            <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
            新增
          </span>
        </AuthBtn>
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
      <SyncSpeech syncSpeechParam={{ visible: true, islastLevel: false }} />
    </>
  );
};
export default ContentsManage;
