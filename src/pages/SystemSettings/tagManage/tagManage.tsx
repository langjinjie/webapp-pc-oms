import React, { useState, useEffect } from 'react';
import { requestGetAllTagList } from 'src/apis/SystemSettings';
import { IAllTagList } from 'src/utils/interface';
import { Icon, Empty } from 'src/components';
import { categoryKey2Name } from 'src/utils/commonData';
import classNames from 'classnames';
import style from './style.module.less';

const tagManage: React.FC = () => {
  const [tagList, setTagList] = useState<IAllTagList>();
  const [currentTalList, setCurrentTagList] = useState('产品库');

  const getAllTagList = async () => {
    const res = await requestGetAllTagList();
    res && setTagList(res);
  };
  useEffect(() => {
    getAllTagList();
  }, []);
  return (
    <div className={style.wrap}>
      <div className={style.tabsWrap}>
        {tagList &&
          Object.keys(tagList as IAllTagList).map((item) => (
            <span
              key={item}
              className={classNames(style.tabItem, {
                [style.active]: currentTalList === categoryKey2Name[item as keyof IAllTagList]
              })}
              onClick={() => {
                setCurrentTagList(categoryKey2Name[item as keyof IAllTagList]);
              }}
            >
              {categoryKey2Name[item as keyof IAllTagList]}
            </span>
          ))}
      </div>
      <div className={style.content}>
        {tagList &&
          Object.keys(tagList as IAllTagList).map((item) => (
            <div key={item} className={style.tagItemWrap}>
              <div
                className={style.title}
                onClick={() =>
                  setCurrentTagList(
                    currentTalList === categoryKey2Name[item as keyof IAllTagList]
                      ? ''
                      : categoryKey2Name[item as keyof IAllTagList]
                  )
                }
              >
                {categoryKey2Name[item as keyof IAllTagList]}
                <span>
                  <Icon
                    name={
                      currentTalList === categoryKey2Name[item as keyof IAllTagList]
                        ? 'icon_common_16_Line_Down'
                        : 'shangjiantou'
                    }
                  />
                </span>
              </div>
              <div
                className={classNames(style.tagListContent, {
                  [style.active]: currentTalList === categoryKey2Name[item as keyof IAllTagList]
                })}
              >
                {tagList[item as keyof IAllTagList]
                  ? (
                      tagList[item as keyof IAllTagList].map((item) => (
                    <span key={item.tagId} className={style.tagItem}>
                      {item.tagName || '暂无标签'}
                    </span>
                      ))
                    )
                  : (
                  <Empty />
                    )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default tagManage;
