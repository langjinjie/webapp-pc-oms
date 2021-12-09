import React, { MouseEvent, useContext, useEffect, useState } from 'react';
import { Icon } from 'src/components/index';
import { ICatalogItem, IEditOrAddCatalogParam, IFirmModalParam } from 'src/utils/interface';
import { getCategoryList, requestSaveSortCatalog, requestDeleteCatalog } from 'src/apis/salesCollection';
import { catalogLastLeve } from 'src/utils/commonData';
import { Context } from 'src/store';

import classNames from 'classnames';
import style from './style.module.less';
import { message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

interface IContentBannerProps {
  parentId: string;
  catalog: ICatalogItem;
  currentContents: string;
  isHiddenMoveUp: boolean;
  isHiddenMoveDown: boolean;
  isHiddenDelete?: boolean;
  setCurrentContents: (param: string) => void;
  setEditOrAddCatalogParam: (param: IEditOrAddCatalogParam) => void;
  setFirmModalParam: (param: IFirmModalParam) => void;
  setEditOrAddLastCatalogParam: (param: IEditOrAddCatalogParam) => void;
  setParentChildrenList: (param: ICatalogItem[]) => void;
  parentCatalog?: any;
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
  setFirmModalParam,
  setEditOrAddLastCatalogParam,
  setParentChildrenList,
  parentCatalog
}) => {
  const { currentCorpId: corpId } = useContext(Context);
  const [childrenList, setChildrenList] = useState<ICatalogItem[]>([]);
  const [currentContent, setCurrentContent] = useState('');
  // useMemo(() => {
  //   setParents((parents) => [...parents, parentCatalog]);
  // }, [parentCatalog]);
  // 获取当前目录的子目录
  const getCurrentChildrenList = async () => {
    const res = await getCategoryList({ corpId, sceneId: catalog.sceneId, catalogId: catalog.catalogId });
    setChildrenList(res);
  };

  // 获取父级的子目录
  const getParentChildrenList = async () => {
    const res = await getCategoryList({
      corpId,
      sceneId: parentId === '0' ? 0 : catalog.sceneId,
      catalogId: parentId === '0' ? undefined : parentId
    });
    setParentChildrenList(res);
  };

  // 点击目录
  const contentsClickHandle = async () => {
    if (catalog.lastLevel) return;
    setCurrentContents(currentContents === catalog.catalogId ? '' : catalog.catalogId);
    currentContents !== catalog.catalogId && getCurrentChildrenList();
  };
  // 编辑
  const editClickHandle = async (e: MouseEvent) => {
    e.stopPropagation();
    if (catalog.lastLevel) {
      setEditOrAddLastCatalogParam({ title: '编辑', catalog, parentId, visible: true, getParentChildrenList });
    } else {
      setEditOrAddCatalogParam({ visible: true, title: '编辑', catalog, parentId, getParentChildrenList });
    }
  };
  // 新增
  const addClickHandle = (parentCatalog: ICatalogItem, parentId: string) => {
    const catalog = { ...parentCatalog, level: parentCatalog.level + 1 };
    // 该级目录是否是最后一级目录
    if (catalog.level >= catalogLastLeve[parentCatalog.sceneId - 1]) {
      catalog.lastLevel = 1;
      catalog.level = catalogLastLeve[parentCatalog.sceneId - 1]; // 修正目录
      setEditOrAddLastCatalogParam({
        title: '新增',
        catalog,
        parentId,
        visible: true,
        getParentChildrenList: getCurrentChildrenList
      });
    } else {
      setEditOrAddCatalogParam({
        visible: true,
        title: '新增',
        catalog,
        parentId,
        getParentChildrenList: getCurrentChildrenList
      });
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
      await setFirmModalParam({ visible: false, title: '', content: '' });
      getParentChildrenList();
    }
  };
  // 上/下移 -1上移 1下移
  const moveClickHandle = (e: React.MouseEvent, type: number, hidden: boolean) => {
    console.log({ corpId, sceneId: catalog.sceneId, catalogId: parentId });
    e.stopPropagation();
    if (hidden) return;
    setFirmModalParam({
      title: type === -1 ? '上移' : '下移' + '提醒',
      content: `确定${type === -1 ? '上移' : '下移'}目录“${catalog.name}”吗？`,
      visible: true,
      onOk: async () => {
        await firmModalOnOk(type);
      },
      onCancel: () => {
        setFirmModalParam({ title: '', content: '', visible: false });
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
          setFirmModalParam({ title: '', content: '', visible: false });
          message.success('删除成功');
          getParentChildrenList();
        }
      },
      onCancel: () => {
        setFirmModalParam({ title: '', content: '', visible: false });
      }
    });
  };
  useEffect(() => {
    return () => {
      setCurrentContents('');
    };
  }, []);
  // 查看话术
  const viewSpeed = (catalog: any) => {
    console.log(catalog, { parentCatalog });
  };
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
        <div className={classNames(style.name, { [style.empty]: !catalog.onlineContentNum })}>{catalog.name}</div>
        <div
          className={classNames(style.info, { [style.empty]: !catalog.onlineContentNum })}
        >{`（上架${catalog.onlineContentNum}/全部${catalog.contentNum}）`}</div>
        <div className={style.edit}>
          {catalog.lastLevel === 1 && (
            <>
              <span onClick={() => viewSpeed(catalog)}>
                <EyeOutlined className={style.svgIcon} />
                查看话术
              </span>
              <span onClick={editClickHandle}>
                <Icon className={style.svgIcon} name="tianjiafenzu" />
                新增话术
              </span>
            </>
          )}

          <span onClick={editClickHandle}>
            <Icon className={style.svgIcon} name="bianji" />
            编辑
          </span>
          <span
            className={classNames({ [style.hidden]: isHiddenMoveUp })}
            onClick={(e) => moveClickHandle(e, -1, isHiddenMoveUp)}
          >
            <Icon className={style.svgIcon} name="shangyi" />
            上移
          </span>
          <span
            className={classNames({ [style.hidden]: isHiddenMoveDown })}
            onClick={(e) => moveClickHandle(e, 1, isHiddenMoveDown)}
          >
            <Icon className={style.svgIcon} name="xiayi" />
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
              <div key={item.catalogId}>
                <ContentBanner
                  parentId={catalog.catalogId}
                  parentCatalog={[...parentCatalog, item]}
                  catalog={item}
                  isHiddenMoveUp={childrenList.length === 1 || index === 0}
                  isHiddenMoveDown={childrenList.length === 1 || index === childrenList.length - 1}
                  isHiddenDelete={childrenList.length === 1}
                  currentContents={currentContent}
                  setCurrentContents={setCurrentContent}
                  setEditOrAddCatalogParam={setEditOrAddCatalogParam}
                  setFirmModalParam={setFirmModalParam}
                  setEditOrAddLastCatalogParam={setEditOrAddLastCatalogParam}
                  setParentChildrenList={setChildrenList}
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
