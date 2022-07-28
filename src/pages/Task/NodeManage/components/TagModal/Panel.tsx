import React from 'react';
import classNames from 'classnames';
import { Icon } from 'src/components';
import { TagInterface, TagGroup } from 'src/utils/interface';
import style from './style.module.less';
import { Button } from 'antd';

interface PanelProps {
  isExpand: boolean;
  categoryName?: string;
  tagType?: number;
  groupList: TagGroup[];
  chooseTag: TagInterface;
  onTagClick: (tagItem: TagInterface) => void;
  expandChange: () => void;
  isHalf?: boolean;
}

const Panel: React.FC<PanelProps> = (props) => {
  const { categoryName, groupList, isExpand, onTagClick, expandChange, chooseTag } = props;
  const handleTagClick = (item: any) => {
    onTagClick(item);
  };

  return (
    <div
      className={classNames(style.panelWrap, {
        [style.mb20]: !isExpand
      })}
    >
      {categoryName && (
        <div className={style.categoryWrap} onClick={expandChange}>
          <span className={style.categoryName}>{categoryName}</span>
          <Icon
            name="shangjiantou"
            className={classNames(style.arrowIcon, {
              [style.down]: !isExpand
            })}
          />
        </div>
      )}
      <div style={{ display: !isExpand && categoryName ? 'none' : 'block' }} className={style.tagContentWrap}>
        <div className="mt20 mb20">
          {groupList.map((item: TagGroup) => (
            <Button
              className={classNames(style.tagItem, {
                [style.active]: chooseTag?.groupId === item.groupId
              })}
              value={item.groupId}
              key={item.groupId}
              onClick={() => handleTagClick(item)}
            >
              {item.groupName}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Panel;
