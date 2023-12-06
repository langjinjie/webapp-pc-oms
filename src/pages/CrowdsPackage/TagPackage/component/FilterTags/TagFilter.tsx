/**
 * @name TagFilter
 * @author Lester
 * @date 2021-06-29 17:38
 */

import React, { useEffect, useState } from 'react';
import { Modal as AntdModal, Input, Drawer, Button, Space, Tabs } from 'antd';
import { Icon } from 'src/components';
import { queryTagList, searchTagByTagName } from 'src/apis/task';
import { TagCategory, IFilterTagsItem } from 'src/utils/interface';
import EmptyTag from './EmptyTag';
import PanelList from './PanelList';
import style from './style.module.less';
import classNames from 'classnames';

const { Search } = Input;

interface TagFilterProps {
  chooseTag: (tags: IFilterTagsItem[]) => any;
  chooseTagList: IFilterTagsItem[];
  visible: boolean;
  className?: string;
  onClose: () => void;
  isTagFlat?: boolean; // 标签是否平铺展示
}

const TagFilter: React.FC<TagFilterProps> = ({ visible, chooseTag, chooseTagList, onClose, isTagFlat, ...props }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  // 属性标签
  const [attrTagList, setAttrTagList] = useState<{ type: number; list: TagCategory[] }>({ type: 0, list: [] });
  const [allAttrTagList, setAllAttrTagList] = useState<{ type: number; list: TagCategory[] }>({ type: 0, list: [] });
  // 预测标签
  const [predictTagList, setPredictTagList] = useState<{ type: number; list: TagCategory[] }>({ type: 0, list: [] });
  const [allPredictTagList, setAllPredictTagList] = useState<{ type: number; list: TagCategory[] }>({
    type: 0,
    list: []
  });

  // 兴趣标签
  const [interestTagList, setInterestTagList] = useState<{ type: number; list: TagCategory[] }>({ type: 0, list: [] });
  const [allInterestList, setAllInterestTagList] = useState<{ type: number; list: TagCategory[] }>({
    type: 0,
    list: []
  });

  // 车标签
  const [carTagList, setCarTagList] = useState<{ type: number; list: TagCategory[] }>({ type: 0, list: [] });
  // const [allCarList, setAllCarTagList] = useState<{ type: number; list: TagCategory[] }>({ type: 0, list: [] });

  const [chooseTags, setChooseTags] = useState<IFilterTagsItem[]>([]);

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

  // 重置
  const onResetHandle = () => {
    setTabIndex(0);
    setAttrTagList(allAttrTagList);
    setPredictTagList(allPredictTagList);
    setInterestTagList(allInterestList);
  };

  /**
   * 获取全部标签列表
   *  @param queryType
   */
  const getTagList = async () => {
    // 不重复请求
    if (
      allAttrTagList.list.length &&
      allPredictTagList.list.length &&
      allInterestList.list.length &&
      carTagList.list.length
    ) {
      return;
    }
    const res: any = await queryTagList();
    const resList = Array.isArray(res.list) ? res.list : [];
    setAllAttrTagList(resList[0]);
    setAttrTagList(resList[0]);
    setAllPredictTagList(resList[1]);
    setPredictTagList(resList[1]);
    // setAllCarTagList(resList[2]);
    setCarTagList(resList[2]);
    setAllInterestTagList(resList[3]);
    setInterestTagList(resList[3]);
  };

  /**
   * 搜索标签
   * @param tagName
   */
  const searchTag = async (tagName: string) => {
    if (tagName) {
      if (tabIndex === 0) {
        const res1 = await searchTagByTagName({ queryType: 1, tagName });
        const res2 = await searchTagByTagName({ queryType: 2, tagName });
        if (res1?.groupList) {
          setAttrTagList({
            type: attrTagList.type,
            list: [
              {
                category: 0,
                groupList: res1.groupList
              }
            ]
          });
        } else {
          setAttrTagList((attrTagList) => ({ ...attrTagList, list: [] }));
        }
        if (res2?.groupList) {
          setPredictTagList((predictTagList) => ({
            ...predictTagList,
            list: [
              {
                category: 0,
                groupList: res2.groupList
              }
            ]
          }));
        } else {
          setPredictTagList((attrTagList) => ({ ...attrTagList, list: [] }));
        }
      } else {
        const res3 = await searchTagByTagName({ queryType: 3, tagName });
        setInterestTagList((interestTagList) => ({
          ...interestTagList,
          list: [
            {
              category: 0,
              groupList: res3.groupList || []
            }
          ]
        }));
      }
    } else {
      if (tabIndex === 0) {
        setAttrTagList(allAttrTagList);
        setPredictTagList(allPredictTagList);
      } else {
        setInterestTagList(allInterestList);
      }
    }
  };

  // 选择标签, 标签值平铺
  const onTagClick: (tagItem: any) => void = (tagItem) => {
    let newChooseTags = [...chooseTags];
    // 判断标签值需要平铺还是分组
    if (isTagFlat) {
      // 判断是否
      if (newChooseTags.some((item) => item.tagId === tagItem.tagId)) {
        newChooseTags = newChooseTags.filter((item) => item.tagId !== tagItem.tagId);
      } else {
        newChooseTags = [
          ...newChooseTags,
          {
            displayType: tagItem.displayType || 0,
            groupId: tagItem.groupId || '',
            groupName: tagItem.groupName || '',
            type: tagItem.type,
            tagId: tagItem.tagId,
            tagName: tagItem.tagName
          }
        ];
      }
    } else {
      // 判断该标签组是否有标签被选中
      const curGroupItem = newChooseTags.find((findItem) => findItem.groupId === tagItem.groupId);
      if (curGroupItem) {
        // 判断该标签组中的标签是否被选中
        if ((curGroupItem.tagList || []).some((tag: any) => tag.tagId === tagItem.tagId)) {
          curGroupItem.tagList = (curGroupItem.tagList || []).filter(
            (filterItem: any) => filterItem.tagId !== tagItem.tagId
          );
        } else {
          curGroupItem.tagList = [...(curGroupItem.tagList || []), { tagId: tagItem.tagId, tagName: tagItem.tagName }];
        }
      } else {
        const newGroupItem: IFilterTagsItem = {
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
    }

    setChooseTags(newChooseTags);
  };

  // 取消选择
  const cancelChooseHandle = (tagItem: any) => {
    let newChooseTags: IFilterTagsItem[] = [];
    // 判断标签是否扁平(不分组)
    if (isTagFlat) {
      newChooseTags = chooseTags.filter((filterTag) => tagItem.tagId !== filterTag.tagId);
    } else {
      newChooseTags = chooseTags.filter((groupItem) => {
        const newTagList = (groupItem?.tagList || []).filter((filterTagItem) => filterTagItem.tagId !== tagItem.tagId);
        groupItem.tagList = newTagList;
        if (newTagList.length) {
          return true;
        } else {
          return false;
        }
      });
    }
    setChooseTags(newChooseTags);
  };

  // 渲染已选中的标签
  const renderChoosedTag = () => {
    if (isTagFlat) {
      return chooseTags.map((item: any) => (
        <span key={item.tagId} className={style.chooseTagItem}>
          {`${
            item.displayType === 2 || item.displayType === 1 || item.displayType === 3
              ? item.groupName.replace(/意愿|兴趣$/g, '')
              : ''
          } ` + item.tagName}

          <span className={style.close} onClick={() => cancelChooseHandle({ groupId: item.groupId, ...item })}>
            <Icon className={style.closeIcon} name="icon_common_Line_Close" />
          </span>
        </span>
      ));
    } else {
      return chooseTags.map((item: IFilterTagsItem) => (
        <span key={item.groupId}>
          {(item?.tagList || []).map((tagItem) => (
            <span key={tagItem.tagId} className={style.chooseTagItem}>
              {`${
                item.displayType === 2 || item.displayType === 1 || item.displayType === 3
                  ? item.groupName
                  : item.groupName.slice(0, item.groupName.length - 2)
              } ` + tagItem.tagName}

              <span className={style.close} onClick={() => cancelChooseHandle({ groupId: item.groupId, ...tagItem })}>
                <Icon className={style.closeIcon} name="icon_common_Line_Close" />
              </span>
            </span>
          ))}
        </span>
      ));
    }
  };

  useEffect(() => {
    if (visible) {
      setChooseTags(chooseTagList);
      getTagList();
    } else {
      onResetHandle();
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
      destroyOnClose
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
          {renderChoosedTag()}
          {chooseTags.length > 0 && (
            <li className={style.delItem} onClick={() => deleteAll()}>
              <Icon className={style.delIcon} name="cangpeitubiao_shanchu" />
            </li>
          )}
        </div>
      </div>
      <Tabs
        activeKey={tabIndex.toString()}
        onChange={(activeKey: string) => {
          setTabIndex(+activeKey);
        }}
      >
        {tabList.map((val: string, index: number) => (
          <Tabs.TabPane key={index} tab={val}>
            <div className={classNames(style.tabTagWrap, { block: tabIndex === 0 })}>
              <div className={style.searchWrap}>
                <Search placeholder="可输入标签组名称查询" allowClear onSearch={(val) => searchTag(val)} />
              </div>
              <div className={style.tagContent}>
                <PanelList
                  defaultActiveIndex={0}
                  tagType={2}
                  dataSource={attrTagList.list}
                  chooseTags={chooseTags}
                  onTagClick={onTagClick}
                  type={attrTagList.type}
                  isTagFlat={isTagFlat}
                />
              </div>
              {/* 预测标签 */}
              {predictTagList.list.length === 0 && attrTagList.list.length === 0 && <EmptyTag />}
              <div className={style.tagContent}>
                <PanelList
                  defaultActiveIndex={-1}
                  tagType={1}
                  dataSource={predictTagList.list}
                  chooseTags={chooseTags}
                  onTagClick={onTagClick}
                  type={predictTagList.type}
                  isTagFlat={isTagFlat}
                />
              </div>
            </div>
            {/* )} */}
            {/* {tabIndex === 1 && ( */}
            <div className={classNames(style.tabTagWrap, { block: tabIndex === 1 })}>
              <div className={style.searchWrap}>
                <Search placeholder="可输入标签名称查询" allowClear onSearch={(val) => searchTag(val)} />
              </div>
              {interestTagList.list.length === 0 && <EmptyTag />}
              <div className={style.tagContent}>
                {/* 兴趣标签 */}
                <PanelList
                  defaultActiveIndex={0}
                  tagType={4}
                  dataSource={interestTagList.list}
                  chooseTags={chooseTags}
                  onTagClick={onTagClick}
                  type={interestTagList.type}
                  isTagFlat={isTagFlat}
                />
              </div>
            </div>
            {/* )} */}
            {tabIndex === 2 && (
              <>
                {carTagList.list.length === 0 && <EmptyTag />}
                <div className={style.tagContent}>
                  {/* 车标签 */}
                  <PanelList
                    defaultActiveIndex={0}
                    tagType={3}
                    dataSource={carTagList.list}
                    chooseTags={chooseTags}
                    onTagClick={onTagClick}
                    type={carTagList.type}
                    isTagFlat={isTagFlat}
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
export default React.memo(TagFilter);
