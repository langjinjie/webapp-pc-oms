/**
 * @name PanelList
 * @author Lester
 * @date 2021-07-28 11:06
 */

import React, { useState, useMemo } from 'react';
import { TagCategory, TagItem, IFilterTagsItem } from 'src/utils/interface';
import Panel from './Panel';

export const predictTagCategory: { key: number; label: string }[] = [
  { key: 1, label: '好友亲密度' },
  { key: 2, label: '客户特征' },
  {
    key: 3,
    label: '客户偏好'
  }
];

export const attrTagCategory: { key: number; label: string }[] = [
  { key: 1, label: '基本情况' },
  { key: 2, label: '家庭情况' },
  { key: 5, label: '非车险情况' }
];
export const carTagCategory: any[] = [
  { key: 3, label: '投保车情况' },
  { key: 4, label: '车险情况' },
  { key: 5, label: '客户偏好' }
];
export const interestTagCategory: any[] = [
  { key: 4, label: '产品兴趣' },
  { key: 5, label: '文章兴趣' },
  { key: 6, label: '活动兴趣' },
  { key: 7, label: '其他兴趣' }
];

const CategoryList: any[] = [
  {
    tagType: 1,
    value: predictTagCategory
  },
  {
    tagType: 2,
    value: attrTagCategory
  },
  {
    tagType: 3,
    value: carTagCategory
  },
  {
    tagType: 4,
    value: interestTagCategory
  }
];
interface PanelListProps {
  dataSource: TagCategory[];
  onTagClick: (tagItem: TagItem) => void;
  chooseTags: IFilterTagsItem[];
  tagType: number;
  defaultActiveIndex: number;
  type?: number; // 标签类型，1-属性标签；2-预测标签；3-车标签；4-二级兴趣标签
  isTagFlat?: boolean; // 标签是否平铺展示
}

const PanelList: React.FC<PanelListProps> = ({
  dataSource,
  onTagClick,
  chooseTags,
  tagType,
  defaultActiveIndex,
  type,
  isTagFlat
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(-1);
  useMemo(() => {
    setActiveIndex(defaultActiveIndex);
  }, [defaultActiveIndex]);
  const tagCategory = CategoryList.filter((category) => category.tagType === tagType)[0].value;
  return (
    <>
      {dataSource.map((item: TagCategory, index: number) => (
        <Panel
          key={`${item.category}${index}`}
          isExpand={activeIndex === index}
          isHalf={tagType === 4}
          tagType={tagType}
          categoryName={item.category > 0 ? tagCategory.filter((tag: any) => tag.key === item.category)[0]?.label : ''}
          chooseTags={chooseTags}
          onTagClick={onTagClick}
          groupList={item.groupList}
          expandChange={() => {
            if (activeIndex === index) {
              setActiveIndex(null);
            } else {
              setActiveIndex(index);
            }
          }}
          type={type}
          isTagFlat={isTagFlat}
        />
      ))}
    </>
  );
};

export default PanelList;
