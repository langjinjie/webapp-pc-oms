import React, { MouseEvent, useContext, useEffect, useState } from 'react';
import { Icon } from 'src/components/index';
import { ContentBanner as ChildrenContentBanner } from 'src/pages/SalesCollection/ContentsManage/component/index';
import { ICatalogItem, IEditOrAddCatalogParam, IFirmModalParam, IEditOrAddLastCatalogParam } from 'src/utils/interface';
import { getCategoryList, requestSaveSortCatalog, requestDeleteCatalog } from 'src/apis/salesCollection';
import { catalogLastLeve } from 'src/utils/commonData';
import { Context } from 'src/store';

import classNames from 'classnames';
import style from './style.module.less';
import { message } from 'antd';

interface IContentBannerProps {
  parentId: string;
  catalog: ICatalogItem;
  currentContents: string;
  isHiddenMoveUp: boolean;
  isHiddenMoveDown: boolean;
  isHiddenDelete?: boolean;
  setCurrentContents: (param: string) => void;
  setEditOrAddCatalogParam: (param: IEditOrAddCatalogParam) => void;
  setEditOrAddCatalogVisible: (param: boolean) => void;
  firmModalParam: IFirmModalParam;
  setFirmModalParam: (param: IFirmModalParam) => void;
  editOrAddLastCatalogParam: IEditOrAddLastCatalogParam;
  setEditOrAddLastCatalogParam: (param: IEditOrAddLastCatalogParam) => void;
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
  setEditOrAddCatalogVisible,
  firmModalParam,
  setFirmModalParam,
  editOrAddLastCatalogParam,
  setEditOrAddLastCatalogParam
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [childrenList, setChildrenList] = useState<ICatalogItem[]>([]);
  const [currentContent, setCurrentContent] = useState('');

  // 获取当前目录的子目录
  const getCurrentChildrenList = async () => {
    const res = await getCategoryList({ corpId, sceneId: catalog.sceneId, catalogId: catalog.catalogId });
    setChildrenList(res);
    setFirmModalParam({ title: '', content: '', visible: false }); // 防止新展开的目录列表多次请求子目录
  };
  // 点击目录
  const contentsClickHandle = async () => {
    if (catalog.lastLevel) return;
    setCurrentContents(currentContents === catalog.catalogId ? '' : catalog.catalogId);
  };
  // 编辑
  const editClickHandle = async (e: MouseEvent) => {
    e.stopPropagation();
    if (catalog.lastLevel) {
      setEditOrAddLastCatalogParam({ title: '编辑', catalog, parentId, visible: true });
    } else {
      setEditOrAddCatalogVisible(true);
      setEditOrAddCatalogParam({ title: '编辑', catalog, parentId });
    }
  };
  // 新增
  const addClickHandle = (parentCatalog: ICatalogItem, parentId: string) => {
    const catalog = { ...parentCatalog, level: parentCatalog.level + 1 };
    // 该级目录是否是最后一级目录
    if (catalog.level === catalogLastLeve[parentCatalog.sceneId - 1]) {
      catalog.lastLevel = 1;
      setEditOrAddLastCatalogParam({ title: '新增', catalog, parentId, visible: true });
    } else {
      setEditOrAddCatalogVisible(true);
      setEditOrAddCatalogParam({ title: '新增', catalog, parentId });
    }
  };
  const firmModalOnOk = async (type: number) => {
    const res = await requestSaveSortCatalog({
      corpId,
      sceneId: catalog.sceneId,
      catalogId: catalog.catalogId,
      sort: type
    });
    if (res) {
      message.success(`目录${type === -1 ? '上移' : '下移'}成功`);
      setFirmModalParam({ visible: false, title: '成功', content: '' });
    }
  };
  // 上/下移 -1上移 1下移
  const moveClickHandle = (e: React.MouseEvent, type: number, hidden: boolean) => {
    e.stopPropagation();
    if (hidden) return;
    setFirmModalParam({
      title: type === -1 ? '上移' : '下移' + '提醒',
      content: `确定${type === -1 ? '上移' : '下移'}目录“${catalog.name}”吗？`,
      visible: true,
      onOk () {
        firmModalOnOk(type);
      }
    });
  };
  // 删除
  const delClickHandle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFirmModalParam({
      title: '删除提醒',
      content: `确定删除目录“${catalog.name}”吗？`,
      visible: true,
      onOk: async () => {
        const res = await requestDeleteCatalog({ corpId, sceneId: catalog.sceneId, catalogId: catalog.catalogId });
        if (res) {
          setFirmModalParam({ title: '成功', content: '', visible: false });
          message.success('删除成功');
        }
      }
    });
  };
  useEffect(() => {
    getCurrentChildrenList();
    return () => {
      setCurrentContents('');
    };
  }, []);
  useEffect(() => {
    if (firmModalParam.title === '成功' && !firmModalParam.visible) {
      getCurrentChildrenList();
    }
  }, [firmModalParam]);

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
            <span onClick={delClickHandle}>
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
                  firmModalParam={firmModalParam}
                  setFirmModalParam={setFirmModalParam}
                  editOrAddLastCatalogParam={editOrAddLastCatalogParam}
                  setEditOrAddLastCatalogParam={setEditOrAddLastCatalogParam}
                />
              </div>
            ))}
            <span className={classNames(style.add)} onClick={() => addClickHandle(catalog, catalog.catalogId)}>
              <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
              新增
            </span>
          </>
        )}
      </div>
    </>
  );
};
export default ContentBanner;
