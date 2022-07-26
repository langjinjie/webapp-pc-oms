/**
 * @name TagFilter
 * @author Lester
 * @date 2021-06-29 17:38
 */

import React, { useEffect, useState } from 'react';
import { Input, Button, Space, Tabs } from 'antd';
import { NgModal } from 'src/components';
import { queryTagList, searchTagList } from 'src/apis/task';
import { TagCategory, TagInterface } from 'src/utils/interface';
import EmptyTag from './EmptyTag';
import PanelList from './PanelList';
import style from './style.module.less';

const { Search } = Input;

interface TagFilterProps {
  onChoose: (tag: TagInterface) => any;
  visible: boolean;
  currentTag?: TagInterface;
  className?: string;
  onClose: () => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ visible, onChoose, currentTag, onClose, ...props }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [attrTagList, setAttrTagList] = useState<TagCategory[]>([]);
  const [allAttrTagList, setAllAttrTagList] = useState<TagCategory[]>([]);
  const [predictTagList, setPredictTagList] = useState<TagCategory[]>([]);
  const [allPredictTagList, setAllPredictTagList] = useState<TagCategory[]>([]);
  const [carTagList, setCarTagList] = useState<TagCategory[]>([]);
  const [allCarList, setAllCarTagList] = useState<TagCategory[]>([]);
  const [chooseTag, setChooseTag] = useState<TagInterface>();
  const [interestTagList, setinterestTagList] = useState<TagCategory[]>([]);
  const [allInterestList, setAllinterestTagList] = useState<TagCategory[]>([]);

  /**
   * 获取全部标签列表
   *  @param queryType
   */
  const getTagList = async () => {
    const res: any = await queryTagList();
    console.log(res);
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

  useEffect(() => {
    if (visible) {
      setChooseTag(currentTag);
      getTagList();
    }
  }, [visible]);

  const onTagClick = (tagItem: TagInterface) => {
    setChooseTag(tagItem);
  };

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
            <Button onClick={() => onChoose(chooseTag!)} type="primary" shape="round">
              确定
            </Button>
          </Space>
        </div>
      }
    >
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
              chooseTag={chooseTag!}
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
              chooseTag={chooseTag!}
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
              chooseTag={chooseTag!}
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
              chooseTag={chooseTag!}
              onTagClick={onTagClick}
            />
          </div>
        </Tabs.TabPane>
      </Tabs>
    </NgModal>
  );
};
export default TagFilter;
