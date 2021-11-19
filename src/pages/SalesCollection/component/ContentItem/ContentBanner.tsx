import React, { MouseEvent, useEffect, useState } from 'react';
import { Icon } from 'src/components/index';
import { ContentBanner as ChildrenContentBanner } from 'src/pages/SalesCollection/component/index';
import { IAddOrEditModalParam, IBannerInfo } from 'src/utils/interface';
import classNames from 'classnames';
import style from './style.module.less';

interface IContentBannerProps {
  bannerInfo: IBannerInfo;
  currentContents: string;
  isFirstLevelContents?: boolean;
  isLastLevelContents?: boolean;
  isHiddenMoveUp: boolean;
  isHiddenMoveDown: boolean;
  isHiddenDelete?: boolean;
  setCurrentContents: (param: string) => void;
  setModalParam: (param: IAddOrEditModalParam) => void;
}

const ContentBanner: React.FC<IContentBannerProps> = ({
  bannerInfo,
  isFirstLevelContents = false,
  isLastLevelContents = false,
  isHiddenMoveUp,
  isHiddenMoveDown,
  isHiddenDelete = false,
  setCurrentContents,
  currentContents,
  setModalParam
}) => {
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [currentContent, setCurrentContent] = useState('');

  // 点击目录
  const contentsClickHandle = () => {
    if (isLastLevelContents) return;
    setCurrentContents(currentContents === bannerInfo.catoryId ? '' : bannerInfo.catoryId);
  };
  // 编辑
  const editClickHandle = (e: MouseEvent) => {
    console.log('点击编辑');
    setModalParam({ visible: true, type: 1, islastlevel: isLastLevelContents });
    e.stopPropagation();
  };
  // 上/下移 -1上移 1下移
  const moveClickHandle = (e: React.MouseEvent, type: number) => {
    console.log(type === -1 ? '上移' : '下移');
    e.stopPropagation();
  };
  // 删除
  const delClickHandle = () => {
    console.log('删除');
  };
  // 新增
  const addClickHandle = (islastlevel: boolean) => {
    console.log('新增');
    setModalParam({ visible: true, type: 0, islastlevel });
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
          { [style.isChildrenContents]: !isFirstLevelContents },
          { [style.isLastContents]: isLastLevelContents }
        )}
        onClick={contentsClickHandle}
      >
        {isLastLevelContents || (
          <div
            className={classNames(style.icon, {
              [style.active]: currentContents === bannerInfo.catoryId
            })}
          />
        )}
        <div className={style.name}>{bannerInfo.name}</div>
        <div className={style.info}>{`（上架${489}/全部${690}）`}</div>
        <div className={style.edit}>
          {isFirstLevelContents || (
            <span onClick={editClickHandle}>
              <Icon className={style.svgIcon} name="bianji" />
              编辑
            </span>
          )}
          {isHiddenMoveUp || (
            <span onClick={(e) => moveClickHandle(e, -1)}>
              <Icon className={style.svgIcon} name="shangsheng" />
              上移
            </span>
          )}
          {isHiddenMoveDown || (
            <span onClick={(e) => moveClickHandle(e, 1)}>
              <Icon className={style.svgIcon} name="xiajiang" />
              下移
            </span>
          )}
          {isFirstLevelContents || isHiddenDelete || (
            <span onClick={delClickHandle}>
              <Icon className={style.svgIcon} name="shanchu" />
              删除
            </span>
          )}
        </div>
      </div>
      <div className={style.children}>
        {currentContents === bannerInfo.catoryId && (
          <>
            {childrenList.map((item, index) => (
              <div key={index}>
                <ChildrenContentBanner
                  bannerInfo={{ name: item, catoryId: `${index}` }}
                  isLastLevelContents={true}
                  isHiddenMoveUp={childrenList.length === 1 || index === 0}
                  isHiddenMoveDown={childrenList.length === 1 || index === childrenList.length - 1}
                  isHiddenDelete={childrenList.length === 1}
                  currentContents={currentContent}
                  setCurrentContents={setCurrentContent}
                  setModalParam={setModalParam}
                />
                {index === childrenList.length - 1 && (
                  <span
                    className={classNames(style.add, { [style.isLastContents]: true })}
                    onClick={() => addClickHandle(true)}
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
