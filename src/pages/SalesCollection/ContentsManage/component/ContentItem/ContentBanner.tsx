import React, { MouseEvent, useContext, useEffect, useState } from 'react';
import { Icon } from 'src/components/index';
import { ContentBanner as ChildrenContentBanner } from 'src/pages/SalesCollection/ContentsManage/component/index';
import { /* IAddOrEditModalParam, */ ICatalogItem, IEditOrAddCatalogParam } from 'src/utils/interface';
import { getCategoryList } from 'src/apis/salesCollection';
import classNames from 'classnames';
import { Context } from 'src/store';
import style from './style.module.less';

interface IContentBannerProps {
  parentId: string;
  catalog: ICatalogItem;
  currentContents: string;
  isHiddenMoveUp: boolean;
  isHiddenMoveDown: boolean;
  isHiddenDelete?: boolean;
  setCurrentContents: (param: string) => void;
  // setModalParam: (param: IAddOrEditModalParam) => void;
  // setVisible:(param:boolean) => void;
  setEditOrAddCatalogParam: (param: IEditOrAddCatalogParam) => void;
  setEditOrAddCatalogVisible: (param: boolean) => void;
}

const ContentBanner: React.FC<IContentBannerProps> = ({
  parentId,
  catalog,
  isHiddenMoveUp,
  isHiddenMoveDown,
  isHiddenDelete = false,
  setCurrentContents,
  currentContents,
  setEditOrAddCatalogParam,
  setEditOrAddCatalogVisible
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [childrenList, setChildrenList] = useState<ICatalogItem[]>([]);
  const [currentContent, setCurrentContent] = useState('');

  // 获取当前目录的子目录
  const getCurrentChildrenList = async () => {
    const res = await getCategoryList({ corpId, sceneId: catalog.sceneId, catalogId: catalog.catalogId });
    setChildrenList(res);
  };
  // 点击目录
  const contentsClickHandle = async () => {
    if (catalog.lastLevel) return;
    setCurrentContents(currentContents === catalog.catalogId ? '' : catalog.catalogId);
  };
  // 编辑
  const editClickHandle = async (e: MouseEvent) => {
    e.stopPropagation();
    setEditOrAddCatalogVisible(true);
    setEditOrAddCatalogParam({ title: '编辑', catalog: catalog, parentId });
  };
  // 上/下移 -1上移 1下移
  const moveClickHandle = (e: React.MouseEvent, type: number, hidden: boolean) => {
    console.log('移动', hidden);
    e.stopPropagation();
    if (hidden) return;
    setEditOrAddCatalogVisible(true);
    setEditOrAddCatalogParam({ title: type === -1 ? '上移' : '下移', catalog: catalog, parentId });
  };
  // 删除
  const delClickHandle = (e: React.MouseEvent, contentName: string) => {
    e.stopPropagation();
    console.log(contentName);
  };
  // 新增
  const addClickHandle = (bannerInfo: ICatalogItem) => {
    console.log('新增');
    console.log(bannerInfo);
  };
  useEffect(() => {
    getCurrentChildrenList();
    return () => {
      setCurrentContents('');
    };
  }, []);

  return (
    <>
      <div
        className={classNames(
          style.bannerWrap,
          { [style.isChildrenContents]: !!catalog.level },
          { [style.isLastContents]: !!catalog.lastLevel }
        )}
        onClick={contentsClickHandle}
      >
        {!!catalog.lastLevel || (
          <div
            className={classNames(style.icon, {
              [style.active]: currentContents === catalog.catalogId
            })}
          />
        )}
        <div className={style.name}>{catalog.name}</div>
        <div className={style.info}>{`（上架${catalog.onlineContentNum}/全部${catalog.contentNum}）`}</div>
        <div className={style.edit}>
          <span onClick={editClickHandle}>
            <Icon className={style.svgIcon} name="bianji" />
            编辑
          </span>
          <span
            className={classNames({ [style.hidden]: isHiddenMoveUp })}
            onClick={(e) => moveClickHandle(e, -1, isHiddenMoveUp)}
          >
            <Icon className={style.svgIcon} name="shangsheng" />
            上移
          </span>
          <span
            className={classNames({ [style.hidden]: isHiddenMoveDown })}
            onClick={(e) => moveClickHandle(e, 1, isHiddenMoveDown)}
          >
            <Icon className={style.svgIcon} name="xiajiang" />
            下移
          </span>
          {!catalog.level || isHiddenDelete || (
            <span onClick={(e) => delClickHandle(e, catalog.name)}>
              <Icon className={style.svgIcon} name="shanchu" />
              删除
            </span>
          )}
        </div>
      </div>
      <div className={style.children}>
        {currentContents === catalog.catalogId && (
          <>
            {childrenList.map((item, index) => (
              <div key={index}>
                <ChildrenContentBanner
                  parentId={catalog.catalogId}
                  catalog={item}
                  isHiddenMoveUp={childrenList.length === 1 || index === 0}
                  isHiddenMoveDown={childrenList.length === 1 || index === childrenList.length - 1}
                  isHiddenDelete={childrenList.length === 1}
                  currentContents={currentContent}
                  setCurrentContents={setCurrentContent}
                  setEditOrAddCatalogParam={setEditOrAddCatalogParam}
                  setEditOrAddCatalogVisible={setEditOrAddCatalogVisible}
                />
                {index === childrenList.length - 1 && (
                  <span
                    className={classNames(style.add, { [style.isLastContents]: !!item.lastLevel })}
                    onClick={() => addClickHandle(item)}
                  >
                    <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
                    新增
                  </span>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};
export default ContentBanner;
