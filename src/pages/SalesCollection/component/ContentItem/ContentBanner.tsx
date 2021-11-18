import React, { useState } from 'react';
import { Icon } from 'src/components/index';
import { ContentBanner as ChildrenContentBanner } from 'src/pages/SalesCollection/component/index';
import classNames from 'classnames';
import style from './style.module.less';

interface IContentBannerProps {
  isFirstContents?: boolean;
  isLastContents?: boolean;
}

const ContentBanner: React.FC<IContentBannerProps> = ({ isFirstContents = false, isLastContents = false }) => {
  const [isShowIcon, setIsShowIcon] = useState(false);
  const [isShowChildren, setISShowChildren] = useState(false);

  const clickHandle = () => {
    if (isLastContents) return;
    setIsShowIcon(!isShowIcon);
    setISShowChildren(!isShowChildren);
  };

  return (
    <>
      <div
        className={classNames(
          style.bannerWrap,
          { [style.isChildrenContents]: !isFirstContents },
          { [style.isLastContents]: isLastContents }
        )}
        onClick={clickHandle}
      >
        {isLastContents || <div className={classNames(style.icon, { [style.active]: isShowIcon })} />}
        <div className={style.name}>车险流程</div>
        <div className={style.info}>{`（上架${489}/全部${690}）`}</div>
        <div className={style.edit}>
          {isFirstContents || (
            <>
              <span>
                <Icon className={style.svgIcon} name="bianji" />
                编辑
              </span>
              <span>
                <Icon className={style.svgIcon} name="shangsheng" />
                上移
              </span>
              <span>
                <Icon className={style.svgIcon} name="xiajiang" />
                下移
              </span>
            </>
          )}
          <span>
            <Icon className={style.svgIcon} name="shanchu" />
            删除
          </span>
        </div>
      </div>
      <div className={style.children}>
        {isShowChildren && (
          <>
            <ChildrenContentBanner isLastContents={true} />
            <span className={classNames(style.add, { [style.isLastContents]: true })}>
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
