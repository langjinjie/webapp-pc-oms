/**
 * @name Panel
 * @author Lester
 * @date 2021-06-30 17:50
 */

import React from 'react';
import classNames from 'classnames';
import { Icon } from 'src/components';
import { TagItem, TagGroup } from 'src/utils/interface';
import style from './style.module.less';
import { Col, Row } from 'antd';

interface PanelProps {
  isExpand: boolean;
  categoryName?: string;
  tagType?: number;
  groupList: TagGroup[];
  chooseTags: TagItem[];
  onTagClick: (TagItem: TagItem) => void;
  expandChange: () => void;
  isHalf?: boolean;
  type?: number;
}

const Panel: React.FC<PanelProps> = (props) => {
  const { categoryName, groupList, isExpand, onTagClick, chooseTags, expandChange, isHalf, type } = props;

  const handleTagClick = (item: any, tag: any) => {
    onTagClick({
      displayType: item.displayType,
      ...tag,
      groupId: item.groupId,
      groupName: item.groupName,
      type: type
    });
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
        <Row>
          {groupList.map((item: TagGroup) => (
            <Col span={isHalf ? 12 : 24} key={item.groupId}>
              <div className={style.tagGroup}>
                <div className={style.groupName}>{item.groupName}</div>
                <ul className={style.tagList}>
                  {(item.tagList || []).map((tag: TagItem) => (
                    <li
                      key={tag.tagId}
                      className={classNames(style.tagItem, {
                        [style.active]: chooseTags?.some((tagItem) => tagItem.tagId === tag.tagId)
                      })}
                      onClick={() => handleTagClick(item, tag)}
                    >
                      {tag.tagName}
                    </li>
                  ))}
                </ul>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Panel;
