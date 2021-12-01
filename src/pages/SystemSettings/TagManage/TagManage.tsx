import React, { useState, useEffect } from 'react';
import { requestGetAllTagList } from 'src/apis/systemSettings';
import { IAllTagList } from 'src/utils/interface';
import { Icon, Empty } from 'src/components';
import { categoryKey2Name } from 'src/utils/commonData';
import { Tabs } from 'src/pages/SystemSettings/component/index';
import classNames from 'classnames';
import style from './style.module.less';

const TagManage: React.FC = () => {
  const [tagList, setTagList] = useState<IAllTagList>();
  const [tabs, setTabs] = useState<any[]>();
  const [tabIndex, setTabIndex] = useState(0);

  const getAllTagList = async () => {
    const res = await requestGetAllTagList();
    res && setTagList(res);
  };
  const getTabs = () => {
    const tabs = Object.keys(tagList as IAllTagList).map((item) => categoryKey2Name[item as keyof IAllTagList]);
    setTabs(tabs);
  };

  useEffect(() => {
    getAllTagList();
  }, []);
  useEffect(() => {
    tagList && getTabs();
  }, [tagList]);
  return (
    <div className={style.wrap}>
      {tabs && <Tabs tabs={tabs} tabIndex={tabIndex} setTabIndex={setTabIndex} />}
      <div className={style.content}>
        {tagList &&
          Object.keys(tagList as IAllTagList).map((item, index) => (
            <div key={item} className={style.tagItemWrap}>
              <div className={style.title} onClick={() => setTabIndex(tabIndex === index ? -1 : index)}>
                {categoryKey2Name[item as keyof IAllTagList]}
                <span>
                  <Icon name={index === tabIndex ? 'icon_common_16_Line_Down' : 'shangjiantou'} />
                </span>
              </div>
              <div
                className={classNames(style.tagListContent, {
                  [style.active]: index === tabIndex
                })}
              >
                {tagList[item as keyof IAllTagList]
                  ? (
                      tagList[item as keyof IAllTagList].map((item) => (
                    <span key={item.tagId} className={style.tagItem}>
                      {item.tagName}
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
export default TagManage;
