import React, { useEffect, useState } from 'react';
import { Icon } from 'src/components';
import { IPreviewValue } from 'src/utils/interface';
import style from './style.module.less';
import classNames from 'classnames';
import moment from 'moment';
import { getMomentDetail } from 'src/apis/marketing';

interface IPreviewProps {
  value?: IPreviewValue;
  className?: string;

  isMoment?: boolean; // 是否是朋友圈（默认为聊天框）
}

const Preview: React.FC<IPreviewProps> = ({ value, className, isMoment }) => {
  const [itemIds, setItemIds] = useState<any[]>([]);
  console.log(value, isMoment);

  const getMomentDetailByFeedId = async () => {
    // 如果是今日朋友圈
    if (value?.wayName === '今日朋友圈' && value?.actionRule.feedId && value?.actionRule?.itemIds?.length === 0) {
      const res = await getMomentDetail({ feedId: value?.actionRule.feedId });
      if (res) {
        setItemIds(res.itemList);
      }
    } else {
      setItemIds(value?.actionRule?.itemIds || []);
    }
  };

  useEffect(() => {
    getMomentDetailByFeedId();
  }, [value]);

  return (
    <div className={classNames(style.phoneWrap, className)}>
      <div className={style.inner}>
        <header className={style.header}>
          <Icon name="zuojiantou-copy" className={style.back}></Icon>
          <div className={style.staffName}>{isMoment ? '朋友圈' : '客户经理张晓雅'}</div>
          <Icon name="diandian" className={style.more}></Icon>
        </header>
        <div className={classNames(style.content, { [style.isMoment]: isMoment })}>
          {/* 发送消息 */}
          {isMoment || (
            <>
              {/* 自定义话术 */}
              {value?.speechcraft && (
                <div className={style.newsItem}>
                  <div className={style.avatar}>
                    <img className={style.avatarImg} src={require('src/assets/images/avater.jpg')} />
                  </div>
                  <div className={style.news}>{value?.speechcraft}</div>
                </div>
              )}
              {/* 营销素材列表 */}
              {itemIds.length > 0 &&
                itemIds.map((mapItem) => (
                  <div className={style.newsItem} key={'0' + mapItem.itemId}>
                    <div className={style.avatar}>
                      <img className={style.avatarImg} src={require('src/assets/images/avater.jpg')} />
                    </div>
                    {/* 话术 */}
                    {value?.actionRule?.contentType === 5 && <div className={style.news}>{mapItem.itemName}</div>}
                    {/* 海报 */}
                    {value?.actionRule?.contentType === 2 && (
                      <div className={style.posterWrap}>
                        <img
                          className={style.poster}
                          src={mapItem.itemShareImgUrl || mapItem.imgUrl || mapItem.itemUrl}
                        />
                      </div>
                    )}
                    {[1, 3, 4].includes(value?.actionRule.contentType as number) && (
                      <div className={classNames(style.cardMessage, 'flex')}>
                        <div className={'flex vertical cell'}>
                          <div className={classNames(style.title, 'ellipsis')}>{mapItem.itemName}</div>
                          <div className={classNames(style.desc, 'two-line-ellipsis')}>{mapItem.itemShareTitle}</div>
                        </div>
                        <div className={classNames(style.imgAndDesc, 'fixed ml10')}>
                          <div className={style.img}>
                            <img src={mapItem.itemShareImgUrl || mapItem.imgUrl || mapItem.itemUrl} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </>
          )}

          {isMoment && value && (
            <>
              <div className={style.momentItem}>
                <div className={style.avatar}>
                  <img className={style.avatarImg} src={require('src/assets/images/avater.jpg')} />
                </div>
                <div className={style.moment}>
                  <div className={style.nickName}>李思</div>
                  <div className={style.momentContent}>
                    <div className={classNames(style.momentText, 'two-line-ellipsis')}>
                      {value?.speechcraft || '' + ' '}
                      {value?.actionRule?.contentType === 5 && itemIds[0]?.itemName}
                    </div>
                    {(value?.actionRule?.contentType === 2 ||
                      value?.actionRule?.contentType === 14 ||
                      value?.actionRule?.contentType === 15) && (
                      <div className={style.momentImg}>
                        {itemIds?.map((mapItem, index: number) => (
                          <img
                            key={index + 'img'}
                            className={classNames(
                              style.img,
                              { [style.twoImg]: itemIds?.length === 2 },
                              { [style.multiImg]: itemIds?.length > 2 }
                            )}
                            src={mapItem.itemShareTitle || mapItem.itemUrl || mapItem.imgUrl}
                          />
                        ))}
                      </div>
                    )}
                    {[1, 3, 4, 11, 12, 13].includes(value?.actionRule.contentType) &&
                      itemIds?.map((mapItem, index: number) => (
                        <div className={style.card} key={mapItem.itemId + index}>
                          <img className={style.shareImg} src={mapItem.itemShareImgUrl} />
                          <div className={style.shareTitle}>
                            <span className="two-line-ellipsis">{mapItem.itemName || mapItem.feedName}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* 话术 */}

                  <div className={style.momentItemFooter}>
                    <div className={style.footerTime}>
                      {moment(JSON.parse(JSON.stringify(value.pushTime)), 'HH:mm').format('HH:mm')}
                    </div>
                    <div className={style.footerOp}>
                      <div className={style.dot} />
                      <div className={style.dot} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        {isMoment && <div className={style.footerLine} />}
        {isMoment || <footer className={style.footer} />}
      </div>
    </div>
  );
};
export default Preview;
