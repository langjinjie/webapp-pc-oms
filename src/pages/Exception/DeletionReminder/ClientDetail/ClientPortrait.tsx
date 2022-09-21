/**
 * @name ClientPortrait
 * @author Lester
 * @date 2021-07-07 16:41
 */
import React, { useState, useEffect, useMemo } from 'react';
// import { Button, Modal } from 'antd';
import classNames from 'classnames';
import { Icon, TagEmpty } from 'src/components';
import { requestGetClientPortrait } from 'src/apis/exception';
import { TagItem, TagCategory as ITagCategory, TagGroup } from 'src/utils/interface';
import style from './style.module.less';

const groupMapNames: any[] = [
  ['重疾险销售概率', '重疾险'],
  ['医疗险销售概率', '医疗险'],
  ['随人驾乘意外险销售概率', '驾乘险', '随人'],
  ['随车驾乘意外险销售概率', '驾乘险', '随车'],
  ['旅游意外险销售概率', '旅游险'],
  ['财产意外险销售概率', '财产险'],
  ['宠物险销售概率', '宠物险']
];

const heartArr: string[] = new Array(5).fill('');

interface FrontTagItem extends TagItem {
  newTagName: string;
  newTagId: string;
}

interface TagCategory {
  category: number;
  tagList: FrontTagItem[];
}

interface PortraitInfo {
  clientCategory?: string;
  clientIntimacyScore?: number;
  clientCategoryUrl?: string;
  multiCar?: number;
  list?: TagCategory[];
}

interface ClientPortraitProps {
  externalUserid: string;
  followStaffId: string;
}

const ClientPortrait: React.FC<ClientPortraitProps> = ({ externalUserid, followStaffId }) => {
  const [portraitInfo, setPortraitInfo] = useState<PortraitInfo>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [allClientPortraitTagListRes, setAllClientPortraitTagListRes] = useState<ITagCategory[]>([]);

  /**
   * 获取客户画像信息
   */
  const getClientPortraitInfo = async () => {
    console.log('followStaffId', followStaffId);
    !hasLoaded && setIsLoading(true);
    const res: any = await requestGetClientPortrait({ externalUserid, followStaffId });
    setHasLoaded(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    if (res && Object.keys(res).length > 0) {
      const { clientCategory, clientIntimacyScore, clientCategoryUrl, list, multiCar } = res;
      setPortraitInfo({
        clientCategory,
        clientIntimacyScore: Math.round((clientIntimacyScore || 0) / 2),
        clientCategoryUrl,
        list: (list || []).map((item: TagCategory) => ({
          category: item.category,
          tagList: (item.tagList || []).map((tag: FrontTagItem) => ({
            ...tag,
            newTagName: tag.tagName
          }))
        })),
        multiCar
      });
    }
  };

  /**
   * 获取所有的客户画像标签(三级预测标签)
   */
  const getAllPrevTagList = async () => {
    const allClientPortraitTagListRes: ITagCategory[] = [].filter((item: ITagCategory) => item.category !== 1);
    // const allClientPortraitTagListRes: ITagCategory[] = (await queryTagList({ queryType: 2 })).filter(
    //   (item: ITagCategory) => item.category !== 1
    // );
    console.log('allClientPortraitTagListRes', allClientPortraitTagListRes);
    if (allClientPortraitTagListRes) {
      setAllClientPortraitTagListRes(allClientPortraitTagListRes);
    }
  };

  const getGroupName = (fullName: string) => {
    const groupName: string[] = groupMapNames.find((item: any) => item[0] === fullName) || [];
    return groupName.slice(1);
  };

  const curClientTag = useMemo(() => {
    return (category: number, groupId: string) => {
      return portraitInfo.list
        ?.find((findItem) => findItem.category === category)
        ?.tagList.find((tagItem) => tagItem.groupId === groupId);
    };
  }, [portraitInfo]);

  useEffect(() => {
    getClientPortraitInfo();
    getAllPrevTagList();
  }, []);

  return (
    <>
      {isLoading && (
        <div className={style.loadingWrap}>
          <img className={style.loadingImg} src={require('src/assets/images/exception/portrait_loading.gif')} alt="" />
          <div className={style.loadingText}>客户画像分析中...</div>
        </div>
      )}
      {!isLoading && (!portraitInfo.list || portraitInfo.list.length < 2) && (
        <div className={style.emptyWrap}>
          <TagEmpty type="portrait" />
          {/* <div className={style.addBtn} onClick={() => history.push('/clientList/editTag', { externalUserid })}>
            <Icon className={style.addIcon} name="tianjiabiaoqian" />
            添加标签
          </div> */}
        </div>
      )}
      {!isLoading && portraitInfo.list && portraitInfo.list.length > 1 && (
        <div className={style.clientPortraitWrap}>
          <div className={style.cardIWrap}>
            <div className={style.cardContent}>
              <div className={style.cardInfo}>
                <div className={style.cardTips}>根据标签数据系统分析该客户为：</div>
                <div className={style.cardUserInfo}>
                  <div className={style.categoryName}>{portraitInfo.clientCategory || '未知'}</div>
                  {portraitInfo.multiCar === 1 && (
                    <img className={style.mulCar} src={require('src/assets/images/exception/multicar.png')} alt="" />
                  )}
                </div>
                <div className={style.intimacyTips}>
                  与你的亲密度：
                  <span className={style.intimacyValue}>{portraitInfo.clientIntimacyScore}颗心</span>
                </div>
                <div className={style.heartList}>
                  {heartArr.map((val: string, index: number) => (
                    <Icon
                      key={val + index}
                      name="xin"
                      className={classNames(style.heartIcon, {
                        [style.red]: index < (portraitInfo.clientIntimacyScore || 0)
                      })}
                    />
                  ))}
                </div>
              </div>
              <img
                className={style.cardImg}
                src={portraitInfo.clientCategoryUrl || require('src/assets/images/exception/portrait_default.png')}
                alt=""
              />
            </div>
          </div>
          <div className={style.charContainer}>
            <div
              className={classNames(style.charWrap, {
                [style.cardEdit]: false
                // [style.cardEdit]: editChar
              })}
            >
              <div className={style.portraitRow}>
                <span className={style.portraitLabel}>客户特征</span>
                <div className={style.charBtnWrap} style={{ display: 'none' }}>
                  {/* <Button
                    className={style.charBtn}
                    onClick={() => {
                      setEditChar(false);
                      setPortraitInfo({
                        ...portraitInfo,
                        list: (portraitInfo.list || []).map((item: TagCategory, index: number) => {
                          if (index === 0) {
                            return {
                              ...item,
                              tagList: item.tagList.map((tag) => ({
                                ...tag,
                                newTagName: tag.tagName
                              }))
                            };
                          } else {
                            return item;
                          }
                        })
                      });
                    }}
                  >
                    <Icon className={style.modifyIcon} name="icon_common_Line_Close" />
                    取消
                  </Button>
                  <Button className={style.charBtn} onClick={() => modifyTag(1)}>
                    <Icon className={style.modifyIcon} name="wancheng" />
                    完成
                  </Button> */}
                </div>
                {/* <Button
                  className={style.modifyBtn}
                  style={{ display: !editChar ? 'inline-flex' : 'none' }}
                  onClick={() => setEditChar(true)}
                >
                  <Icon className={style.modifyIcon} name="xiugai1" />
                  纠错
                </Button> */}
              </div>
              <div className={style.charHeader}>
                <span className={style.colOne} />
                <span className={style.colItem}>低</span>
                <span className={style.colItem}>中</span>
                <span className={style.colItem}>高</span>
              </div>
              <ul className={style.charList}>
                {allClientPortraitTagListRes
                  .find((filterItem) => filterItem.category === 2)
                  ?.groupList.map((item: TagGroup) => (
                    <li key={item.groupId} className={style.charItem}>
                      <span className={style.colOne}>{item.groupName}</span>
                      {item.tagList.map((tagItem) => (
                        <span
                          key={tagItem.tagId}
                          className={classNames(style.charCol, {
                            [style.blue]:
                              tagItem.tagName === curClientTag(2, item.groupId)?.newTagName &&
                              curClientTag(2, item.groupId)?.modified === 0,
                            [style.orange]:
                              tagItem.tagName === curClientTag(2, item.groupId)?.newTagName &&
                              curClientTag(2, item.groupId)?.modified === 1
                          })}
                          // onClick={() => {
                          //   if (editChar) {
                          //     const prevItem = curClientTag(2, item.groupId) as FrontTagItem;
                          //     prevItem.newTagName = tagItem.tagName;
                          //     prevItem.newTagId = tagItem.tagId;
                          //     setPortraitInfo({ ...portraitInfo });
                          //   }
                          // }}
                        />
                      ))}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
          <div className={style.charContainer}>
            <div
              className={classNames(style.charWrap, {
                [style.cardEdit]: false
                // [style.cardEdit]: editPreference
              })}
            >
              <div className={style.portraitRow}>
                <span className={style.portraitLabel}>客户偏好</span>
                <div className={style.charBtnWrap} style={{ display: 'none' }}>
                  {/* <Button
                    className={style.charBtn}
                    onClick={() => {
                      setEditPreference(false);
                      setPortraitInfo({
                        ...portraitInfo,
                        list: (portraitInfo.list || []).map((item: TagCategory, index: number) => {
                          if (index === 1) {
                            return {
                              ...item,
                              tagList: item.tagList.map((tag) => ({
                                ...tag,
                                newTagName: tag.tagName
                              }))
                            };
                          } else {
                            return item;
                          }
                        })
                      });
                    }}
                  >
                    <Icon className={style.modifyIcon} name="icon_common_Line_Close" />
                    取消
                  </Button>
                  <Button className={style.charBtn} onClick={() => modifyTag(2)}>
                    <Icon className={style.modifyIcon} name="wancheng" />
                    完成
                  </Button> */}
                </div>
                {/* <Button
                  className={style.modifyBtn}
                  style={{ display: !editPreference ? 'inline-flex' : 'none' }}
                  onClick={() => setEditPreference(true)}
                >
                  <Icon className={style.modifyIcon} name="xiugai1" />
                  纠错
                </Button> */}
              </div>
              <ul className={style.preferenceList}>
                {allClientPortraitTagListRes
                  .find((filterItem) => filterItem.category === 3)
                  ?.groupList.map((item: TagGroup) => (
                    <li key={item.groupId} className={style.preferenceItem}>
                      <span className={style.colOne} title={item.groupName}>
                        {getGroupName(item.groupName!)[0]}
                      </span>
                      {getGroupName(item.groupName!)[1] && (
                        <span className={style.colOneDesc}>({getGroupName(item.groupName!)[1]})</span>
                      )}
                      {item.tagList.map((tagItem) => (
                        <span
                          key={tagItem.tagId}
                          className={classNames(style.preferenceCol, {
                            [style.blue]:
                              tagItem.tagName === curClientTag(3, item.groupId)?.newTagName &&
                              curClientTag(3, item.groupId)?.modified === 0,
                            [style.orange]:
                              tagItem.tagName === curClientTag(3, item.groupId)?.newTagName &&
                              curClientTag(3, item.groupId)?.modified === 1
                          })}
                          // onClick={() => {
                          //   if (editPreference) {
                          //     const prevItem = curClientTag(3, item.groupId) as FrontTagItem;
                          //     prevItem.newTagName = tagItem.tagName;
                          //     prevItem.newTagId = tagItem.tagId;
                          //     setPortraitInfo({ ...portraitInfo });
                          //   }
                          // }}
                        >
                          {tagItem.tagName}
                        </span>
                      ))}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      {/* <Modal
        className={style.tipsModal}
        width={420}
        visible={tipsVisible}
        onCancel={() => setTipsVisible(false)}
        footer={null}
      >
        <div className={style.tipsContent}>
          <img className={style.emailImg} src={require('src/assets/images/email.png')} alt="" />
          <div className={style.mainText}>感谢您，我们已收到您的反馈</div>
          <div className={style.deputyText}>
            我们会在1～2个工作日内审核该客户标签信息的准确性，再次感谢您的反馈，祝您身体健康，工作顺利。
          </div>
        </div>
      </Modal> */}
    </>
  );
};

export default ClientPortrait;
