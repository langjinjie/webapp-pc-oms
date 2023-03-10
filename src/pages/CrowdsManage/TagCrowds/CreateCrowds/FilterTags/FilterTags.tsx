import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Tabs, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import TagFilter from './TagFilter';
import { TagGroup } from 'src/utils/interface';
import style from './style.module.less';

interface IFilterTagsProps {
  value?: (TagGroup & { type?: number })[];
  onChange?: (value: (TagGroup & { type?: number })[]) => void;
  readOnly?: boolean;
}

const tabKey2TypeList = [[1, 2], [3], [4]];

/**
 * @desc 选择客户标签
 */
const FilterTags: React.FC<IFilterTagsProps> = (props) => {
  const { value, onChange, readOnly } = props;
  const [tag, setTag] = useState<(TagGroup & { type?: number })[]>([]);
  const [visible, setVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const filterClients = (tag: (TagGroup & { type?: number })[]) => {
    setTag(tag as TagGroup[]);
    setVisible(false);
    onChange && onChange(tag);
  };
  useEffect(() => {
    setTag(value || []);
    if (value) {
      filterClients(value);
    }
  }, [value]);
  const onClose = () => {
    setVisible(false);
  };
  const tabsList = [
    { value: 0, label: '属性标签' },
    { value: 1, label: '兴趣标签' },
    { value: 2, label: '车标签' }
  ];
  const { TabPane } = Tabs;

  // 关闭
  const onCloseHandle = (groupId: string) => {
    onChange?.(value?.filter((filterItem) => filterItem.groupId !== groupId) || []);
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
  const curTagList = useMemo(() => {
    return (tag || []).filter((filterItem) => tabKey2TypeList[tabIndex].includes(filterItem.type || 1));
  }, [tabIndex, tag]);
  return (
    <div className={style.wrap}>
      <div className={style.header}>按照标签筛选</div>
      <div className={style.tagFilter}>
        <div className={style.tagFilterTitle}>按照标签筛选</div>
        <div className={style.tagFilterContent}>
          <Button disabled={readOnly} className={style.addTagBtn} icon={<PlusOutlined />} onClick={addTag}>
            添加标签
          </Button>
          <Tabs className={style.tabs} defaultActiveKey="0" type="card" onChange={(e) => setTabIndex(+e)}>
            {tabsList.map((tabItem) => (
              <TabPane key={tabItem.value} tab={tabItem.label + '（' + tagLength(tabItem.value) + '）'}>
                {tagLength(tabItem.value) === 0 || (
                  <div className={style.tagWrap}>
                    {curTagList.map((mapItem) => (
                      <span key={mapItem.groupId}>
                        {(mapItem.tagList || mapItem.tags || []).map((tagItem) => (
                          <Tag
                            className={style.tag}
                            key={tagItem.tagId}
                            visible
                            {...(readOnly ? { closable: false } : { closable: true })}
                            onClose={() => onCloseHandle(mapItem.groupId)}
                          >
                            {`${
                              mapItem.displayType === 2 || mapItem.displayType === 1 || mapItem.displayType === 3
                                ? mapItem.groupName
                                : mapItem.groupName.slice(0, mapItem.groupName.length - 2)
                            } ` + tagItem.tagName}
                          </Tag>
                        ))}
                      </span>
                    ))}
                  </div>
                )}
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
      <TagFilter
        chooseTag={(tags: TagGroup[]) => {
          console.log('tags', tags);
          filterClients(tags);
        }}
        chooseTagList={tag as TagGroup[]}
        visible={visible}
        onClose={() => {
          onClose();
        }}
      />
    </div>
  );
};
export default FilterTags;
