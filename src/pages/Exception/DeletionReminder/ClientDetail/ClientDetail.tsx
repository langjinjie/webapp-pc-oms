/**
 * @name ClientDetail
 * @author Lester
 * @date 2021-07-01 14:50
 */

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Tooltip } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
// import { Button } from 'tenacity-ui';
import { BreadCrumbs, Icon, Empty, DrawerItem } from 'src/components';
// import { wxAgentConfig } from 'src/utils/wx';
import { Nav, TagItem } from 'src/utils/interface';
import { requestGetClientDetail } from 'src/apis/exception';
import qs from 'qs';
import DynamicList from './DynamicList';
import ClientPortrait from './ClientPortrait';
import ServiceSuggestion from './ServiceSuggestion';
import style from './style.module.less';

interface TagInfo {
  tagId?: string;
  tagName?: string;
  groupId: string;
  groupName: string;
}

export interface CarItem {
  carNumber: string;
  carBrandId: string;
  carBrandIdUpdateCount: number;
  carBrandName: string;
  salesStatus: number;
  salesStatusUpdateCount: number;
  compulsoryInsuranceExpireDate: string;
  compInsExpDateUpdateCount: number;
  commercialInsuranceExpireDate: string;
  commInsExpDateUpdateCount: number;
  carInspectionExpireDate: string;
  carInspectionTagInfo: TagInfo;
  compInsBuyStatusTagInfo: TagInfo;
  commInsBuyStatusTagInfo: TagInfo;
  carTagList: TagItem[];
}

export interface ClientInfo {
  avatar?: string;
  name?: string;
  nickName?: string;
  multiCar?: number;
  birthDate?: string;
  birthDateUpdateCount?: number;
  resideCity?: string;
  resideCityUpdateCount?: number;
  factTagList?: TagItem[];
  personalTagList?: TagItem[];
  carList?: CarItem[];
  ruleTagList?: TagItem[];
  tradeOrderStatusTagInfo?: TagItem;
}

export interface BoundCarInfo {
  allowBindCar?: number;
  isPrompt?: number;
  unBindCarList?: string[];
}

const ClientDetail: React.FC<RouteComponentProps> = ({ history }) => {
  const [clientInfo, setClientInfo] = useState<ClientInfo>({});
  // const [baseVisible, setBaseVisible] = useState<boolean>(false);
  // const [attrVisible, setAttrVisible] = useState<boolean>(false);
  // const [customizeVisible, setCustomizeVisible] = useState<boolean>(false);
  // const [tagName, setTagName] = useState<string>('');
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [tabIndexes, setTabIndexes] = useState<number[]>([0]);
  // const [oldTag, setOldTag] = useState<TagItem>({ tagId: '', tagName: '' });
  // const [tagList, setTagList] = useState<Tag[]>([]);
  // const [groupName, setGroupName] = useState<string>('');
  // const [tagIndex, setTagIndex] = useState<number>(0);
  const [externalUserId, setExternalUserId] = useState<string>('');
  const [followStaffId, setfollowStaffId] = useState('');
  // const [customTagList, setCustomTagList] = useState<Tag[]>([]);
  const [attrCollapse, setAttrCollapse] = useState<boolean>(false);
  const [customCollapse, setCustomCollapse] = useState<boolean>(false);
  const [carIndex, setCarIndex] = useState<number>(0);
  // const [cardVisible, setCarVisible] = useState<boolean>(false);
  // const [cardInfoVisible, setCardInfoVisible] = useState<boolean>(false);
  // const [tagType, setTagType] = useState<number>(0); // 0 属性标签 1 车标签
  const [attrTagHideIndex, setAttrTagHideIndex] = useState<number>(0);
  const [customTagHideIndex, setCustomTagHideIndex] = useState<number>(0);
  // const [customTagType, setCustomTagType] = useState<number>(0); // 0 修改 1 添加、修改
  // const [editTagVisible, setEditTagVisible] = useState<boolean>(false);
  const [attrHasExpand, setAttrHasExpand] = useState<boolean>(false);
  const [customHasExpand, setCustomHasExpand] = useState<boolean>(false);
  const [loadAttrTag, setLoadAttrTag] = useState<boolean>(false);
  const [loadCustomTag, setLoadCustomTag] = useState<boolean>(false);
  const [interestTagHideIndex, setInterestTagHideIndex] = useState<number>(0);
  const [interestHasExpand, setInterestHasExpand] = useState<boolean>(false);
  const [loadInterestTag, setLoadInterestTag] = useState<boolean>(false);
  const [interestCollapse, setInterestCollapse] = useState<boolean>(false);
  // const [editInterestVisible, setEditInterestVisible] = useState<boolean>(false);
  // const [modifyField, setModifyField] = useState<string>('');
  // const [boundVisible, setBoundVisible] = useState<boolean>(false);
  // const [boundType, setBoundType] = useState<number>(0);
  // const [boundTipVisible, setBoundTipVisible] = useState<boolean>(false);
  // const [orderVisible, setOrderVisible] = useState<boolean>(false);

  const attrContentRef: MutableRefObject<any> = useRef(null);
  const interestContentRef: MutableRefObject<any> = useRef(null);
  const customContentRef: MutableRefObject<any> = useRef(null);

  const tabList: string[] = ['客户动态', '客户画像', '服务建议'];

  // const hasTag = (clientInfo.factTagList || []).length > 0 || (clientInfo.personalTagList || []).length > 0;

  const navList: Nav[] = [
    {
      name: '删人提醒',
      path: '/deletionReminder'
    },
    {
      name: '客户详情'
    }
  ];

  const calcAttrTag = () => {
    if (!attrHasExpand || attrCollapse) {
      const attrEle = Array.from([...attrContentRef.current.children]);
      const attrOverIndex = attrEle.findIndex((ele) => ele.offsetTop > 38);
      setAttrCollapse(attrOverIndex > -1);
      if (attrOverIndex > -1) {
        const prevEle = attrEle[attrOverIndex - 1];
        if (attrContentRef.current.clientWidth - prevEle.offsetLeft - prevEle.clientWidth > 38) {
          setAttrTagHideIndex(attrOverIndex);
        } else {
          setAttrTagHideIndex(attrOverIndex - 1);
        }
      } else {
        setAttrTagHideIndex(0);
      }
    }
    setLoadAttrTag(false);
  };

  const calcInterestTag = () => {
    if (!interestHasExpand || interestCollapse) {
      const interestEle = Array.from([...interestContentRef.current.children]);
      const interestOverIndex = interestEle.findIndex((ele) => ele.offsetTop > 38);
      setInterestCollapse(interestOverIndex > -1);
      if (interestOverIndex > -1) {
        const prevEle = interestEle[interestOverIndex - 1];
        if (interestContentRef.current.clientWidth - prevEle.offsetLeft - prevEle.clientWidth > 38) {
          setInterestTagHideIndex(interestOverIndex);
        } else {
          setInterestTagHideIndex(interestOverIndex - 1);
        }
      } else {
        setInterestTagHideIndex(0);
      }
    }
    setLoadInterestTag(false);
  };

  const calcCustomTag = () => {
    if (!customHasExpand || customCollapse) {
      const customEle = Array.from([...customContentRef.current.children]);
      const customOverIndex = customEle.findIndex((ele) => ele.offsetTop > 38);
      setCustomCollapse(customOverIndex > -1);
      if (customOverIndex > -1) {
        const prevEle = customEle[customOverIndex - 1];
        if (customContentRef.current.clientWidth - prevEle.offsetLeft - prevEle.clientWidth > 39) {
          setCustomTagHideIndex(customOverIndex);
        } else {
          setCustomTagHideIndex(customOverIndex - 1);
        }
      } else {
        setCustomTagHideIndex(0);
      }
    }
    setLoadCustomTag(false);
  };

  const getClientInfo = async (externalUserId: string, followStaffId: string) => {
    const res: any = await requestGetClientDetail({ externalUserid: externalUserId, followStaffId });
    if (res) {
      setClientInfo(res);
      setLoadAttrTag(true);
      setLoadInterestTag(true);
      setLoadCustomTag(true);
    }
  };

  const getStatusName = (status?: number) => {
    let statusName = '未知';
    if (status === 1) {
      statusName = '销售期';
    } else if (status === 2) {
      statusName = '非销售期';
    }
    return statusName;
  };

  useEffect(() => {
    if (loadAttrTag) {
      calcAttrTag();
    }
  }, [loadAttrTag]);

  useEffect(() => {
    if (loadInterestTag) {
      calcInterestTag();
    }
  }, [loadInterestTag]);

  useEffect(() => {
    if (loadCustomTag) {
      calcCustomTag();
    }
  }, [loadCustomTag]);

  useEffect(() => {
    const { externalUserid: externalUserId = '', followStaffId }: any = qs.parse(history.location.search, {
      ignoreQueryPrefix: true
    });
    setExternalUserId(externalUserId);
    setfollowStaffId(followStaffId);
    getClientInfo(externalUserId, followStaffId);
    // getCustomTagList(externalUserId);
  }, []);
  return (
    <div className={style.detailWrap}>
      <BreadCrumbs navList={navList} />
      <div className={style.contentWrap}>
        <div className={style.left}>
          <div className={style.baseWrap}>
            <div className={style.baseInfo}>
              <div className={style.userInfoWrap}>
                <div className={style.baseTitle}>客户信息</div>
                <div className={style.userInfo}>
                  <img className={style.avatar} src={clientInfo.avatar} alt="" />
                  <div className={style.mainInfo}>
                    <div className={style.nameWrap}>
                      <span className={style.name}>{clientInfo.name}</span>
                      {clientInfo.multiCar === 1 && (
                        <img
                          className={style.mulCar}
                          src={require('src/assets/images/exception/multicar.png')}
                          alt=""
                        />
                      )}
                    </div>
                    <div className={style.nickName}>客户昵称：{clientInfo.nickName}</div>
                  </div>
                </div>
              </div>
              {clientInfo?.tradeOrderStatusTagInfo && (
                <div className={style.orderWrap}>
                  <div className={style.baseTitle}>出单状态</div>
                  <div className={style.orderInfo}>
                    <Tooltip
                      overlayClassName={style.orderTip}
                      title={clientInfo.tradeOrderStatusTagInfo.remark}
                      placement="bottom"
                    >
                      <span>{clientInfo.tradeOrderStatusTagInfo.tagName || '未知'}</span>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
            <div className={style.infoRowWrap}>
              <div className={style.infoCol}>
                <div className={style.infoRow}>
                  <div className={style.infoLabel}>
                    <Icon className={style.labelIcon} name="chengshi" />
                    居住城市
                  </div>
                  <div className={style.infoValue}>{clientInfo.resideCity || '未知'}</div>
                </div>
              </div>
              <div className={style.infoCol}>
                <div className={style.infoRow}>
                  <div className={style.infoLabel}>
                    <Icon className={style.labelIcon} name="shengri" />
                    生日时间
                  </div>
                  <div className={style.infoValue}>{clientInfo.birthDate || '未知'}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.tagWrap}>
            <div className={style.tagGroup}>
              属性标签
              {/* {(clientInfo.factTagList || []).length > 0 && (
                <span className={style.tagDesc}>鼠标点击标签可做修改。 </span>
              )} */}
            </div>
            <div
              className={classNames(style.tagContainer, {
                [style.expand]: !attrCollapse
              })}
            >
              <ul className={style.tagList} ref={attrContentRef}>
                {(clientInfo.factTagList || []).length === 0 && <li className={style.tagTips}>还未添加任何属性标签</li>}
                {(clientInfo.factTagList || []).map((item, index) => (
                  <li
                    key={item.tagId}
                    className={classNames(style.tagItem, {
                      [style.yellow]: item.modified === 1,
                      [style.blue]: item.modified === 0,
                      [style.hide]: !loadAttrTag && attrTagHideIndex > 0 && attrCollapse && index >= attrTagHideIndex
                    })}
                    // onClick={() => {
                    //   setAttrVisible(true);
                    //   setTagType(0);
                    //   getTagListByGroup(item.groupId!, item.tagId);
                    //   setOldTag(item);
                    // }}
                  >
                    {item.displayType === 1 ? item.groupName : ''}
                    {item.tagName}
                  </li>
                ))}
              </ul>
            </div>
            {attrTagHideIndex > 0 && (
              <div
                className={style.expandWrap}
                onClick={() => {
                  setAttrCollapse(!attrCollapse);
                  setAttrHasExpand(true);
                }}
              >
                {attrCollapse ? '展开查看更多标签' : '收起'}
                <Icon className={style.expandIcon} name={attrCollapse ? 'icon_common_16_Line_Down' : 'shangjiantou'} />
              </div>
            )}
          </div>
          <div className={style.tagWrap}>
            <div className={style.tagGroup}>
              兴趣标签
              {(clientInfo.ruleTagList || []).length > 0 && (
                <span className={style.tagDesc}>鼠标点击标签可做修改。 </span>
              )}
            </div>
            <div
              className={classNames(style.tagContainer, {
                [style.expand]: !interestCollapse
              })}
            >
              <ul className={style.tagList} ref={interestContentRef}>
                {(clientInfo.ruleTagList || []).length === 0 && <li className={style.tagTips}>还未添加任何兴趣标签</li>}
                {(clientInfo.ruleTagList || []).map((item, index) => (
                  <li
                    key={item.tagId}
                    className={classNames(style.tagItem, {
                      [style.yellow]: item.modified === 1,
                      [style.blue]: item.modified === 0,
                      [style.hide]:
                        !loadInterestTag &&
                        interestTagHideIndex > 0 &&
                        interestCollapse &&
                        index >= interestTagHideIndex
                    })}
                    // onClick={() => {
                    //   setAttrVisible(true);
                    //   setTagType(2);
                    //   getTagListByGroup(item.groupId!, item.tagId);
                    //   setOldTag(item);
                    // }}
                  >
                    {item.displayType === 1 ? item.groupName!.replace(/兴趣|意愿/g, '') : ''}
                    {item.tagName}
                  </li>
                ))}
              </ul>
            </div>
            {interestTagHideIndex > 0 && (
              <div
                className={style.expandWrap}
                onClick={() => {
                  setInterestCollapse(!interestCollapse);
                  setInterestHasExpand(true);
                }}
              >
                {interestCollapse ? '展开查看更多标签' : '收起'}
                <Icon
                  className={style.expandIcon}
                  name={interestCollapse ? 'icon_common_16_Line_Down' : 'shangjiantou'}
                />
              </div>
            )}
          </div>
          <div className={style.tagWrap}>
            <div className={style.tagGroup}>
              自定义标签
              {(clientInfo.personalTagList || []).length > 0 && (
                <span className={style.tagDesc}>鼠标点击标签可做修改。 </span>
              )}
            </div>
            <div
              className={classNames(style.tagContainer, {
                [style.expand]: !customCollapse
              })}
            >
              <ul className={style.tagList} ref={customContentRef}>
                {(clientInfo.personalTagList || []).length === 0 && (
                  <li className={style.tagTips}>还未添加任何自定义标签</li>
                )}
                {(clientInfo.personalTagList || []).map((item, index) => (
                  <li
                    key={item.tagName}
                    className={classNames(style.tagItem, style.yellow, {
                      [style.hide]:
                        !loadCustomTag && customTagHideIndex > 0 && customCollapse && index >= customTagHideIndex
                    })}
                    // onClick={() => {
                    //   setCustomTagType(0);
                    //   setCustomizeVisible(true);
                    // }}
                  >
                    {item.tagName}
                  </li>
                ))}
              </ul>
            </div>
            {customTagHideIndex > 0 && (
              <div
                className={style.expandWrap}
                onClick={() => {
                  setCustomCollapse(!customCollapse);
                  setCustomHasExpand(true);
                }}
              >
                {customCollapse ? '展开查看更多标签' : '收起'}
                <Icon
                  className={style.expandIcon}
                  name={customCollapse ? 'icon_common_16_Line_Down' : 'shangjiantou'}
                />
              </div>
            )}
          </div>
          <div className={style.cardInfoWrap}>
            <div className={style.cardInfoTitleWrap}>
              <span className={style.cardInfoTitle}>车辆信息</span>
              {/* {boundCarInfo.allowBindCar === 1 && (boundCarInfo.unBindCarList || []).length > 0 && (
                <div className={style.boundTips}>
                  <span>系统识别到你有{(boundCarInfo.unBindCarList || []).length}辆车未绑定</span>
                  <span
                    className={style.boundBtn}
                    // onClick={() => {
                    //   setBoundType(0);
                    //   setBoundVisible(true);
                    // }}
                  >
                    去绑定
                  </span>
                </div>
              )} */}
            </div>
            {clientInfo.carList?.length === 0 && (
              <>
                <Empty />
                {/* {boundCarInfo.allowBindCar === 1 && (
                  <Button
                    className={style.addCarBtn}
                    type="primary"
                    // onClick={() => {
                    //   setBoundType(1);
                    //   setBoundVisible(true);
                    // }}
                  >
                    去添加车辆
                  </Button>
                )} */}
              </>
            )}
            {(clientInfo.carList || []).length > 0 && (
              <ul className={style.carNumList}>
                {(clientInfo.carList || []).map((item: CarItem, index: number) => (
                  <li
                    key={item.carNumber}
                    className={classNames(style.carNumItem, {
                      [style.active]: index === carIndex
                    })}
                    onClick={() => setCarIndex(index)}
                  >
                    {item.carNumber}
                  </li>
                ))}
                {/* {boundCarInfo.allowBindCar === 1 && (clientInfo.carList || []).length < 5 && (
                  <li
                    className={style.carAdd}
                    // onClick={() => {
                    //   setBoundType(1);
                    //   setBoundVisible(true);
                    // }}
                  >
                    <Icon className={style.addCarIcon} name="tianjiabiaoqian1" />
                  </li>
                )} */}
              </ul>
            )}
            <div className={style.carInfoWrap}>
              {(clientInfo.carList || []).map((item: CarItem, index: number) => (
                <DrawerItem key={item.carNumber} visible={carIndex === index}>
                  <div className={style.carInfo}>
                    <div className={style.infoCol}>
                      <div className={style.infoRow}>
                        <div className={style.infoLabel}>
                          <Icon className={style.labelIcon} name="chepinpai" />
                          车品牌
                        </div>
                        <div className={style.infoValue}>{item.carBrandName || '未知'}</div>
                      </div>
                      <div className={style.infoRow}>
                        <div className={style.infoLabel}>
                          <Icon className={style.labelIcon} name="xiaoshou" />
                          车险销售状态
                        </div>
                        <div className={style.infoValue}>{getStatusName(item.salesStatus)}</div>
                      </div>
                      {item.carInspectionTagInfo && (
                        <>
                          <div className={style.infoRow}>
                            <div className={style.infoLabel}>
                              <Icon className={style.labelIcon} name="shijian" />
                              年检到期
                            </div>
                            <div className={style.infoValue}>{item.carInspectionExpireDate || '未知'}</div>
                          </div>
                          <div className={style.infoRow}>
                            <div className={style.infoLabel}>
                              <Icon className={style.labelIcon} name="nianjianzhuangtai" />
                              年检状态
                            </div>
                            <div className={style.infoValue}>{item.carInspectionTagInfo?.tagName || '未知'}</div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className={style.infoCol}>
                      <div className={classNames(style.infoRow, style.flexStart)}>
                        <div className={style.infoLabel}>
                          <Icon className={style.labelIcon} name="shijian" />
                          车险到期
                        </div>
                        <div className={style.infoValue}>
                          {item.compInsBuyStatusTagInfo && (
                            <div className={style.insuranceRow}>
                              交强险 {item.compInsBuyStatusTagInfo?.tagName || '未知'}
                            </div>
                          )}
                          <div className={style.insuranceRow}>
                            交强险到期 {item.compulsoryInsuranceExpireDate || '未知'}
                          </div>
                          {item.commInsBuyStatusTagInfo && (
                            <div className={style.insuranceRow}>
                              商业险 {item.commInsBuyStatusTagInfo?.tagName || '未知'}
                            </div>
                          )}
                          <div className={classNames(style.infoValueRow, style.insuranceRow)}>
                            商业险到期 {item.commercialInsuranceExpireDate || '未知'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={style.tagWrap}>
                    <div className={style.tagGroup}>
                      车标签
                      {(item.carTagList || []).length > 0 && (
                        <span className={style.tagDesc}>鼠标点击标签可做修改。 </span>
                      )}
                    </div>
                    <ul className={style.tagList}>
                      {(item.carTagList || []).length === 0 && <li className={style.tagTips}>还未添加任何车标签</li>}
                      {(item.carTagList || []).map((item, index) => (
                        <li
                          key={item?.tagId || index}
                          className={classNames(style.tagItem, {
                            [style.yellow]: item?.modified === 1,
                            [style.blue]: item?.modified === 0
                          })}
                        >
                          {item?.displayType === 1 ? item?.groupName : ''}
                          {item?.tagName}
                        </li>
                      ))}
                    </ul>
                  </div>
                </DrawerItem>
              ))}
            </div>
          </div>
        </div>
        <div className={style.right}>
          <div className={style.tabWrap}>
            <ul className={style.tabList}>
              {tabList.map((val: string, index: number) => (
                <li
                  key={val}
                  className={classNames(style.tabItem, {
                    [style.active]: tabIndex === index
                  })}
                  onClick={() => {
                    setTabIndex(index);
                    if (!tabIndexes.includes(index)) {
                      setTabIndexes([...tabIndexes, index]);
                    }
                  }}
                >
                  {val}
                </li>
              ))}
            </ul>
          </div>
          <div className={style.tabContent}>
            <DrawerItem visible={tabIndex === 0}>
              {externalUserId && followStaffId && (
                <DynamicList externalUserid={externalUserId} followStaffId={followStaffId} />
              )}
            </DrawerItem>
            <DrawerItem visible={tabIndex === 1}>
              {externalUserId && followStaffId && tabIndexes.includes(1) && (
                <ClientPortrait externalUserid={externalUserId} followStaffId={followStaffId} />
              )}
            </DrawerItem>
            <DrawerItem visible={tabIndex === 2}>
              {externalUserId && followStaffId && tabIndexes.includes(2) && (
                <ServiceSuggestion externalUserid={externalUserId} followStaffId={followStaffId} />
              )}
            </DrawerItem>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
