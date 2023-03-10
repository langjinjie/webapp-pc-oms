/**
 * @name TagFilter
 * @author Lester
 * @date 2021-06-29 17:38
 */

import React, { useEffect, useState } from 'react';
import { Modal as AntdModal, Input, Drawer, Button, Space, Tabs } from 'antd';
import { Icon } from 'src/components';
import { queryTagList, searchTagList } from 'src/apis/task';
import { TagCategory, TagGroup, TagItem } from 'src/utils/interface';
import EmptyTag from './EmptyTag';
import PanelList from './PanelList';
import style from './style.module.less';

const { Search } = Input;

interface TagFilterProps {
  chooseTag: (tags: TagGroup[]) => any;
  chooseTagList: TagGroup[];
  visible: boolean;
  className?: string;
  onClose: () => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ visible, chooseTag, chooseTagList, onClose, ...props }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  // 属性标签
  const [attrTagList, setAttrTagList] = useState<TagCategory[]>([]);
  const [allAttrTagList, setAllAttrTagList] = useState<TagCategory[]>([]);
  // 预测标签
  const [predictTagList, setPredictTagList] = useState<TagCategory[]>([]);
  const [allPredictTagList, setAllPredictTagList] = useState<TagCategory[]>([]);
  // 车标签
  const [carTagList, setCarTagList] = useState<TagCategory[]>([]);
  const [allCarList, setAllCarTagList] = useState<TagCategory[]>([]);
  const [chooseTags, setChooseTags] = useState<TagGroup[]>([]);
  // 兴趣标签
  const [interestTagList, setinterestTagList] = useState<TagCategory[]>([]);
  const [allInterestList, setAllinterestTagList] = useState<TagCategory[]>([]);

  const tabList: string[] = ['属性标签', '兴趣标签', '车标签'];

  /**
   * 清除已选标签
   */
  const deleteAll = () => {
    AntdModal.confirm({
      title: '提示',
      content: '确定删除所有已筛选的标签？',
      onOk () {
        setChooseTags([]);
      }
    });
  };

  /**
   * 获取全部标签列表
   *  @param queryType
   */
  const getTagList = async () => {
    const res: any = await queryTagList();
    const resList = Array.isArray(res.list) ? res.list : [];
    setAllAttrTagList(resList[0].list);
    setAttrTagList(resList[0].list);
    setAllPredictTagList(resList[1].list);
    setPredictTagList(resList[1].list);
    setAllCarTagList(resList[2].list);
    setCarTagList(resList[2].list);
    setAllinterestTagList(resList[3].list);
    setinterestTagList(resList[3].list);
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
  const onTagClick = (tagItem: TagItem & { type?: number }) => {
    let newChooseTags = [...chooseTags];
    // 判断该标签组是否有标签被选中
    const curGroupItem = newChooseTags.find((findItem) => findItem.groupId === tagItem.groupId);
    if (curGroupItem) {
      // 判断该标签组中的标签是否被选中
      if (curGroupItem.tagList.some((tag) => tag.tagId === tagItem.tagId)) {
        curGroupItem.tagList = curGroupItem.tagList.filter((filterItem) => filterItem.tagId !== tagItem.tagId);
      } else {
        curGroupItem.tagList = [...curGroupItem.tagList, { tagId: tagItem.tagId, tagName: tagItem.tagName }];
      }
    } else {
      const newGroupItem: TagGroup & { type?: number } = {
        displayType: tagItem.displayType || 0,
        groupId: tagItem.groupId || '',
        groupName: tagItem.groupName || '',
        type: tagItem.type,
        tagList: [
          {
            tagId: tagItem.tagId,
            tagName: tagItem.tagName
          }
        ]
      };
      newChooseTags = [...newChooseTags, newGroupItem];
    }
    // 过滤掉tagList为空数组的
    newChooseTags = newChooseTags.filter((newItem) => newItem.tagList && newItem.tagList.length);
    setChooseTags(newChooseTags);
  };

  // 取消选择
  const cancelChooseHandle = (tagItem: any) => {
    const newChooseTags = chooseTags.filter((groupItem) => {
      const newTagList = groupItem.tagList.filter((filterTagItem) => filterTagItem.tagId !== tagItem.tagId);
      groupItem.tagList = newTagList;
      if (newTagList.length) {
        return true;
      } else {
        return false;
      }
    });
    setChooseTags(newChooseTags);
  };
  useEffect(() => {
    if (visible) {
      setChooseTags(chooseTagList);
      getTagList();
      // getTagList(1);
      // getTagList(2);
      // getTagList(3);
      // getTagList(4);
    }
  }, [visible]);

  return (
    <Drawer
      width={1000}
      title="筛选标签"
      visible={visible}
      maskClosable={false}
      className={style.filterModal}
      {...props}
      bodyStyle={{ paddingBottom: 80 }}
      onClose={onClose}
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
            <Button onClick={() => chooseTag(chooseTags)} type="primary" shape="round">
              确定筛选
            </Button>
          </Space>
        </div>
      }
    >
      <div className={style.chooseTagWrap}>
        <span className={style.tagDesc}>已筛选的标签:</span>
        <div className={style.chooseTagList}>
          {chooseTags.map((item: TagGroup) => (
            <span key={item.groupId}>
              {(item?.tagList || []).map((tagItem) => (
                <span key={tagItem.tagId} className={style.chooseTagItem}>
                  {`${
                    item.displayType === 2 || item.displayType === 1 || item.displayType === 3
                      ? item.groupName
                      : item.groupName.slice(0, item.groupName.length - 2)
                  } ` + tagItem.tagName}

                  <span
                    className={style.close}
                    onClick={() => cancelChooseHandle({ groupId: item.groupId, ...tagItem })}
                  >
                    <Icon className={style.closeIcon} name="icon_common_Line_Close" />
                  </span>
                </span>
              ))}
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
        defaultActiveKey={'0'}
        onChange={(activeKey: string) => {
          setTabIndex(+activeKey);
        }}
      >
        {tabList.map((val: string, index: number) => (
          <Tabs.TabPane key={index} tab={val}>
            {tabIndex === 0 && (
              <>
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
                    type={1}
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
                    type={2}
                  />
                </div>
              </>
            )}
            {tabIndex === 1 && (
              <>
                <div className={style.searchWrap}>
                  <Search placeholder="可输入标签名称查询" allowClear onSearch={(val) => searchTag(val)} />
                </div>
                {interestTagList.length === 0 && <EmptyTag />}
                <div className={style.tagContent}>
                  {/* 兴趣标签 */}
                  <PanelList
                    defaultActiveIndex={0}
                    tagType={4}
                    dataSource={interestTagList}
                    chooseTags={chooseTags}
                    onTagClick={onTagClick}
                    type={3}
                  />
                </div>
              </>
            )}
            {tabIndex === 2 && (
              <>
                {(carTagList.length === 0 || (carTagList[0].groupList || []).length === 0) && <EmptyTag />}
                <div className={style.tagContent}>
                  {/* 车标签 */}
                  <PanelList
                    defaultActiveIndex={0}
                    tagType={3}
                    dataSource={carTagList}
                    chooseTags={chooseTags}
                    onTagClick={onTagClick}
                    type={4}
                  />
                </div>
              </>
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Drawer>
  );
};
export default TagFilter;
