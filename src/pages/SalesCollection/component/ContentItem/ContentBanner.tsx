import React, { MouseEvent, useEffect, useState } from 'react';
import { Icon } from 'src/components/index';
import { ContentBanner as ChildrenContentBanner } from 'src/pages/SalesCollection/component/index';
import { IAddOrEditModalParam, ICatalogItem } from 'src/utils/interface';
import classNames from 'classnames';
import style from './style.module.less';

interface IContentBannerProps {
  bannerInfo: ICatalogItem;
  currentContents: string;
  isHiddenMoveUp: boolean;
  isHiddenMoveDown: boolean;
  isHiddenDelete?: boolean;
  setCurrentContents: (param: string) => void;
  setModalParam: (param: IAddOrEditModalParam) => void;
}

const ContentBanner: React.FC<IContentBannerProps> = ({
  bannerInfo,
  isHiddenMoveUp,
  isHiddenMoveDown,
  isHiddenDelete = false,
  setCurrentContents,
  currentContents,
  setModalParam
}) => {
  const [childrenList, setChildrenList] = useState<ICatalogItem[]>([]);
  const [currentContent, setCurrentContent] = useState('');

  // 点击目录
  const contentsClickHandle = () => {
    if (bannerInfo.lastLevel) return;
    setCurrentContents(currentContents === bannerInfo.catalogId ? '' : bannerInfo.catalogId);
  };
  // 编辑
  const editClickHandle = (e: MouseEvent) => {
    console.log('点击编辑');
    setModalParam({ visible: true, type: 1, islastlevel: !!bannerInfo.lastLevel, title: '编辑目录', content: '' });
    e.stopPropagation();
  };
  // 上/下移 -1上移 1下移
  const moveClickHandle = (e: React.MouseEvent, type: number, contentName: string) => {
    console.log(type === -1 ? '上移' : '下移');
    setModalParam({
      visible: true,
      type: 3,
      islastlevel: false,
      title: '移动提醒',
      content: type === -1 ? `确定上移目录"${contentName}"吗` : `确定下移目录"${contentName}"吗`
    });
    e.stopPropagation();
  };
  // 删除
  const delClickHandle = (e: React.MouseEvent, contentName: string) => {
    console.log('删除');
    setModalParam({
      visible: true,
      type: 3,
      islastlevel: false,
      title: '删除提醒',
      content: `确定删除目录"${contentName}"吗`
    });
    e.stopPropagation();
  };
  // 新增
  const addClickHandle = (islastlevel: boolean) => {
    console.log('新增');
    setModalParam({ visible: true, type: 0, islastlevel, title: '新增目录', content: '' });
  };
  useEffect(() => {
    setChildrenList(new Array(5).fill(bannerInfo.name));
    return () => {
      setCurrentContents('');
    };
  }, []);

  return (
    <>
      <div
        className={classNames(
          style.bannerWrap,
          { [style.isChildrenContents]: !!bannerInfo.level },
          { [style.isLastContents]: !!bannerInfo.level }
        )}
        onClick={contentsClickHandle}
      >
        {!!bannerInfo.lastLevel || (
          <div
            className={classNames(style.icon, {
              [style.active]: currentContents === bannerInfo.catalogId
            })}
          />
        )}
        <div className={style.name}>{bannerInfo.name}</div>
        <div className={style.info}>{`（上架${bannerInfo.onlineContentNum}/全部${bannerInfo.contentNum}）`}</div>
        <div className={style.edit}>
          <span onClick={editClickHandle}>
            <Icon className={style.svgIcon} name="bianji" />
            编辑
          </span>
          {isHiddenMoveUp || (
            <span onClick={(e) => moveClickHandle(e, -1, bannerInfo.name)}>
              <Icon className={style.svgIcon} name="shangsheng" />
              上移
            </span>
          )}
          {isHiddenMoveDown || (
            <span onClick={(e) => moveClickHandle(e, 1, bannerInfo.name)}>
              <Icon className={style.svgIcon} name="xiajiang" />
              下移
            </span>
          )}
          {!!bannerInfo.lastLevel || isHiddenDelete || (
            <span onClick={(e) => delClickHandle(e, bannerInfo.name)}>
              <Icon className={style.svgIcon} name="shanchu" />
              删除
            </span>
          )}
        </div>
      </div>
      <div className={style.children}>
        {currentContents === bannerInfo.catalogId && (
          <>
            {childrenList.map((item, index) => (
              <div key={index}>
                <ChildrenContentBanner
                  bannerInfo={item}
                  isHiddenMoveUp={childrenList.length === 1 || index === 0}
                  isHiddenMoveDown={childrenList.length === 1 || index === childrenList.length - 1}
                  isHiddenDelete={childrenList.length === 1}
                  currentContents={currentContent}
                  setCurrentContents={setCurrentContent}
                  setModalParam={setModalParam}
                />
                {index === childrenList.length - 1 && (
                  <span
                    className={classNames(style.add, { [style.isLastContents]: !!item.lastLevel })}
                    onClick={() => addClickHandle(false)}
                  >
                    <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
                    新增
                  </span>
                )}
              </div>
            ))}
            {/* <span className={classNames(style.add, { [style.isLastContents]: false })} onClick={addClickHandle}>
              <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
              新增
            </span> */}
          </>
        )}
      </div>
    </>
  );
};
export default ContentBanner;
