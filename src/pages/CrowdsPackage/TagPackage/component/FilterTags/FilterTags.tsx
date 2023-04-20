import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Tabs, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { IFilterTagsItem } from 'src/utils/interface';
import { numberToChinese } from 'src/utils/base';
import TagFilter from './TagFilter';
import style from './style.module.less';

interface IFilterTagsProps {
  value?: IFilterTagsItem[];
  onChange?: (value: IFilterTagsItem[]) => void;
  readOnly?: boolean;
  removeHandle?: (index: number | number[]) => void;
  fieldIndex?: number;
  isTagFlat?: boolean;
  id?: string;
}

const tabKey2TypeList = [[1, 2], [3], [4]]; // 1-属性标签 2-预测标签 3-车标签 4-兴趣标签,其中1,2合并显示位属性标签

/**
 * @desc 选择客户标签
 */
const FilterTags: React.FC<IFilterTagsProps> = (props) => {
  const { value, onChange, readOnly, removeHandle, fieldIndex, isTagFlat, id } = props;
  // const [tag, setTag] = useState<IFilterTagsItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const filterClients = (tag: IFilterTagsItem[]) => {
    // setTag(tag as IFilterTagsItem[]);
    setVisible(false);
    onChange && onChange(tag);
  };
  useEffect(() => {
    // setTag(value || []);
    if (value) {
      filterClients(value);
    }
  }, [value]);
  const onClose = () => {
    setVisible(false);
  };
  const tabsList = [
    { value: 0, label: '属性标签' },
    { value: 2, label: '兴趣标签' },
    { value: 1, label: '车标签' }
  ];
  const { TabPane } = Tabs;

  // 关闭
  const onCloseHandle = (tagItem: IFilterTagsItem) => {
    let newChooseTags: IFilterTagsItem[] = [];
    // 判断标签是否扁平(不分组)
    if (isTagFlat) {
      newChooseTags = (value as IFilterTagsItem[]).filter((filterTag) => tagItem.tagId !== filterTag.tagId);
    } else {
      newChooseTags = (value as IFilterTagsItem[]).filter((groupItem) => {
        const newTagList = (groupItem?.tagList || []).filter((filterTagItem) => filterTagItem.tagId !== tagItem.tagId);
        groupItem.tagList = newTagList;
        if (newTagList.length) {
          return true;
        } else {
          return false;
        }
      });
    }
    onChange?.(newChooseTags);
  };

  // 添加标签
  const addTag = () => {
    setVisible(true);
  };

  const tagLength = useCallback(
    (tabKey: number) => {
      return (value || []).filter((filterItem) => tabKey2TypeList[tabKey].includes(filterItem.type || 1)).length;
    },
    [value]
  );

  const curTagList: any[] = useMemo(() => {
    return (value || []).filter((filterItem) => tabKey2TypeList[tabIndex].includes(filterItem.type || 1));
  }, [tabIndex, value]);

  // 定义渲染选中的标签
  const renderTagItem = () => {
    if (isTagFlat) {
      return curTagList.map((tagItem) => (
        <Tag
          className={style.tag}
          key={tagItem.tagId}
          visible
          {...(readOnly ? { closable: false } : { closable: true })}
          onClose={() => onCloseHandle(tagItem)}
        >
          {`${
            tagItem.displayType === 2 || tagItem.displayType === 1 || tagItem.displayType === 3
              ? tagItem.groupName
              : tagItem.groupName.slice(0, tagItem.groupName.length - 2)
          } ` + tagItem.tagName}
        </Tag>
      ));
    } else {
      return curTagList.map((mapItem) => (
        <span key={mapItem.groupId}>
          {(mapItem.tagList || []).map((tagItem: any) => (
            <Tag
              className={style.tag}
              key={tagItem.tagId}
              visible
              {...(readOnly ? { closable: false } : { closable: true })}
              onClose={() => onCloseHandle(tagItem)}
            >
              {`${
                mapItem.displayType === 2 || mapItem.displayType === 1 || mapItem.displayType === 3
                  ? mapItem.groupName
                  : mapItem.groupName.slice(0, mapItem.groupName.length - 2)
              } ` + tagItem.tagName}
            </Tag>
          ))}
        </span>
      ));
    }
  };
  return (
    <div className={style.wrap} id={id}>
      <div className={style.header}>按照标签筛选</div>
      <div className={style.tagFilter}>
        <div className={style.tagFilterTitle}>
          <span>标签组{numberToChinese((fieldIndex || 0) + 1)}</span>
          <div>
            <Button disabled={readOnly} className={style.addTagBtn} icon={<PlusOutlined />} onClick={addTag}>
              添加标签
            </Button>
            {!!fieldIndex && (
              <Button
                className={style.removeTags}
                disabled={readOnly}
                onClick={() => removeHandle?.(fieldIndex as number)}
              >
                删除
              </Button>
            )}
          </div>
        </div>
        <div className={style.tagFilterContent}>
          <Tabs className={style.tabs} defaultActiveKey="0" type="card" onChange={(e) => setTabIndex(+e)}>
            {tabsList.map((tabItem) => (
              <TabPane key={tabItem.value} tab={tabItem.label + '（' + tagLength(tabItem.value) + '）'}>
                {tagLength(tabItem.value) === 0 || <div className={style.tagWrap}>{renderTagItem()}</div>}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
      <TagFilter
        chooseTag={(tags: IFilterTagsItem[]) => {
          filterClients(tags);
        }}
        chooseTagList={value || []}
        visible={visible}
        onClose={() => {
          onClose();
        }}
        isTagFlat={isTagFlat}
      />
    </div>
  );
};
export default FilterTags;
