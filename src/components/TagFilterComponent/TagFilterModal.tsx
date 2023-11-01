/**
 * @name TagFilter
 * @author Lester
 * @date 2021-06-29 17:38
 */

import React, { useEffect, useState } from 'react';
import { Input, Button, Space, Tabs } from 'antd';
import { NgModal, Icon, ITagFilterValue } from 'src/components';
import { queryTagList, searchTagByTagName as searchTagList } from 'src/apis/task';
import { TagCategory, TagItem } from 'src/utils/interface';
import EmptyTag from './EmptyTag';
import PanelList from './PanelList';
import style from './style.module.less';

const { Search } = Input;

interface TagFilterProps {
  value?: ITagFilterValue;
  onOk?: (value?: ITagFilterValue) => void;
  visible: boolean;
  className?: string;
  onClose: () => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ visible, value, onOk, onClose, ...props }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [logicType, setLogicType] = useState<1 | 2>(2);
  const [attrTagList, setAttrTagList] = useState<TagCategory[]>([]);
  const [allAttrTagList, setAllAttrTagList] = useState<TagCategory[]>([]);
  const [predictTagList, setPredictTagList] = useState<TagCategory[]>([]);
  const [allPredictTagList, setAllPredictTagList] = useState<TagCategory[]>([]);
  const [carTagList, setCarTagList] = useState<TagCategory[]>([]);
  const [allCarList, setAllCarTagList] = useState<TagCategory[]>([]);
  // const [tag, setTag] = useState<{ logicType: 1 | 2; tagList: TagGroup[] }>({ logicType: 2, tagList: [] });
  const [chooseTags, setChooseTags] = useState<TagItem[]>([]);
  const [interestTagList, setinterestTagList] = useState<TagCategory[]>([]);
  const [allInterestList, setAllinterestTagList] = useState<TagCategory[]>([]);

  /**
   * 获取全部标签列表
   *  @param queryType
   */
  const getTagList = async () => {
    const res: any = await queryTagList();
    if (res) {
      const { list } = res;
      list.forEach((item: any) => {
        const { type, list } = item;
        switch (type) {
          case 1:
            setAllAttrTagList(list);
            setAttrTagList(list);
            break;
          case 2:
            setAllPredictTagList(list);
            setPredictTagList(list);
            break;
          case 3:
            setAllCarTagList(list);
            setCarTagList(list);
            break;
          case 4:
            setAllinterestTagList(list);
            setinterestTagList(list);
            break;
        }
      });
    }
  };

  /**
   * 搜索标签
   * @param tagName
   */
  const searchTag = async (tagName: string) => {
    if (tagName) {
      if (tabIndex === 0) {
        const res1 = await searchTagList({ queryType: 1, tagName });
        const res2 = await searchTagList({ queryType: 2, tagName });
        if (res1.groupList) {
          setAttrTagList([
            {
              category: 0,
              groupList: res1.groupList
            }
          ]);
        } else {
          setAttrTagList([]);
        }
        if (res2.groupList) {
          setPredictTagList([
            {
              category: 0,
              groupList: res2.groupList
            }
          ]);
        } else {
          setPredictTagList([]);
        }
      } else {
        const res3 = await searchTagList({ queryType: 3, tagName });
        setinterestTagList([
          {
            category: 0,
            groupList: res3.groupList || []
          }
        ]);
      }
    } else {
      if (tabIndex === 0) {
        setAttrTagList(allAttrTagList);
        setPredictTagList(allPredictTagList);
      } else if (tabIndex === 2) {
        setCarTagList(allCarList);
      } else {
        setinterestTagList(allInterestList);
      }
    }
  };

  // 选择标签
  const onTagClick = (tagItem: TagItem) => {
    let newChooseTags = [...chooseTags];
    // 判断该标签组是否有标签被选中
    const curGroupItem = newChooseTags.find((findItem) => findItem.tagId === tagItem.tagId);
    if (curGroupItem) {
      newChooseTags = newChooseTags.filter((filterItem) => filterItem.tagId !== tagItem.tagId);
    } else {
      newChooseTags = [...newChooseTags, tagItem];
    }
    setChooseTags(newChooseTags);
  };

  // 确定
  const onOkHandle = () => {
    onOk?.({ logicType, tagList: chooseTags });
  };

  // 取消选择
  const cancelChooseHandle = (tagItem: TagItem) => {
    const newChooseTags = chooseTags.filter((tag) => tag.tagId !== tagItem.tagId);
    setChooseTags(newChooseTags);
  };

  // 取消所有选择的标签
  const deleteAll = () => {
    setChooseTags([]);
  };

  useEffect(() => {
    if (visible) {
      setChooseTags(value?.tagList || []);
      setLogicType((value?.logicType as 1 | 2) || logicType);
      getTagList();
    }
  }, [visible]);
  return (
    <NgModal
      width={1000}
      title="标签"
      visible={visible}
      maskClosable={false}
      className={style.filterModal}
      {...props}
      bodyStyle={{ paddingBottom: 80 }}
      onCancel={() => {
        onClose();
      }}
      footer={
        <div
          style={{
            textAlign: 'right'
          }}
        >
          <Space size={20}>
            <Button onClick={onClose} style={{ marginRight: 8 }} shape="round">
              取消
            </Button>
            <Button onClick={onOkHandle} type="primary" shape="round">
              确定
            </Button>
          </Space>
        </div>
      }
    >
      <div className={style.chooseTagWrap}>
        <span className={style.tagDesc}>已筛选的标签:</span>
        <div className={style.chooseTagList}>
          {chooseTags.map((tagItem) => (
            <span key={tagItem.tagId} className={style.chooseTagItem}>
              {`${tagItem.displayType ? tagItem.groupName + ': ' + tagItem.tagName : tagItem.tagName}`}
              <span className={style.close} onClick={() => cancelChooseHandle(tagItem)}>
                <Icon className={style.closeIcon} name="icon_common_Line_Close" />
              </span>
            </span>
          ))}
          {chooseTags.length > 0 && (
            <li className={style.delItem} onClick={() => deleteAll()}>
              <Icon className={style.delIcon} name="cangpeitubiao_shanchu" />
            </li>
          )}
        </div>
      </div>
      <Tabs
        className={style.filterRule}
        defaultActiveKey={logicType + ''}
        onChange={(activeKey) => setLogicType(+activeKey as 1 | 2)}
      >
        <Tabs.TabPane tab={'以下标签同时满足'} key={1} />
        <Tabs.TabPane tab={'以下标签满足其一'} key={2} />
      </Tabs>
      <Tabs className={style.tabContent} onChange={(activeKey) => setTabIndex(+activeKey)}>
        <Tabs.TabPane tab={'属性标签'} key={0}>
          <div className={style.searchWrap}>
            <Search placeholder="可输入标签名称查询" allowClear onSearch={(val) => searchTag(val)} />
          </div>

          <div className={style.tagContent}>
            <PanelList
              defaultActiveIndex={0}
              tagType={2}
              dataSource={attrTagList}
              chooseTags={chooseTags}
              onTagClick={onTagClick}
            />
          </div>
          {/* 预测标签 */}
          {predictTagList.length === 0 && attrTagList.length === 0 && <EmptyTag />}
          <div className={style.tagContent}>
            <PanelList
              defaultActiveIndex={-1}
              tagType={1}
              dataSource={predictTagList}
              chooseTags={chooseTags}
              onTagClick={onTagClick}
            />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key={1} tab="兴趣标签">
          <div className={style.searchWrap}>
            <Search placeholder="可输入标签名称查询" allowClear onSearch={(val) => searchTag(val)} />
          </div>
          {(interestTagList.length === 0 || (interestTagList[0].groupList || []).length === 0) && <EmptyTag />}
          <div className={style.tagContent}>
            <PanelList
              defaultActiveIndex={0}
              tagType={4}
              dataSource={interestTagList}
              chooseTags={chooseTags}
              onTagClick={onTagClick}
            />
          </div>
        </Tabs.TabPane>

        <Tabs.TabPane key={2} tab="车标签">
          {(carTagList.length === 0 || (carTagList[0].groupList || []).length === 0) && <EmptyTag />}
          <div className={style.tagContent}>
            <PanelList
              defaultActiveIndex={0}
              tagType={3}
              dataSource={carTagList}
              chooseTags={chooseTags}
              onTagClick={onTagClick}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </NgModal>
  );
};
export default TagFilter;
