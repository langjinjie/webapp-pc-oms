import React from 'react';
import { Icon } from 'src/components';
import { IPreviewValue } from 'src/utils/interface';
import style from './style.module.less';
import classNames from 'classnames';
import { Moment } from 'moment';

interface IPreviewProps {
  value?: IPreviewValue;
  className?: string;
  isMoment?: boolean; // 是否是朋友圈（默认为聊天框）
}

const Preview: React.FC<IPreviewProps> = ({ value, className, isMoment }) => {
  const itemIds = value?.actionRule.itemIds || [];
  console.log('++++++++++++++++++++++++++++++++', typeof itemIds);
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
                    <img
                      className={style.avatarImg}
                      src="http://wx.qlogo.cn/mmhead/7j1UQofaR9ckJPex8aHRlKzfvEq8FIZxIBvBDyQZibvTeIHtYiaB3z2g/0"
                    />
                  </div>
                  <div className={style.news}>{value?.speechcraft}</div>
                </div>
              )}
              {/* 营销素材列表 */}
              {itemIds.length > 0 &&
                itemIds.map((mapItem) => (
                  <div className={style.newsItem} key={'0' + mapItem.itemId}>
                    <div className={style.avatar}>
                      <img
                        className={style.avatarImg}
                        src="http://wx.qlogo.cn/mmhead/7j1UQofaR9ckJPex8aHRlKzfvEq8FIZxIBvBDyQZibvTeIHtYiaB3z2g/0"
                      />
                    </div>
                    {/* 话术 */}
                    {value?.actionRule?.contentType === 5 && <div className={style.news}>{mapItem.speechcraft}</div>}
                    {/* 海报 */}
                    {value?.actionRule?.contentType === 2 && (
                      <div className={style.posterWrap}>
                        <img className={style.poster} src={mapItem.imgUrl} />
                      </div>
                    )}
                    {[1, 3, 4].includes(value?.actionRule.contentType as number) && (
                      <div className={style.cardMessage}>
                        <div className={classNames(style.title, 'two-line-ellipsis')}>{mapItem.title}</div>
                        <div className={style.imgAndDesc}>
                          <div className={classNames(style.desc, 'two-line-ellipsis')}>
                            90年代生人开始相信圣诞老人了
                          </div>
                          <div className={style.img}>
                            <img src={mapItem.imgUrl} />
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
                  <img
                    className={style.avatarImg}
                    src="http://wx.qlogo.cn/mmhead/7j1UQofaR9ckJPex8aHRlKzfvEq8FIZxIBvBDyQZibvTeIHtYiaB3z2g/0"
                  />
                </div>
                <div className={style.moment}>
                  <div className={style.nickName}>李思</div>
                  <div className={style.momentContent}>
                    <div className={classNames(style.momentText, 'two-line-ellipsis')}>{value?.speechcraft}</div>
                    {value?.actionRule.contentType === 2 && (
                      <div className={style.momentImg}>
                        {value?.actionRule?.itemIds?.map((mapItem) => (
                          <img
                            key={mapItem.itemId}
                            className={classNames(
                              style.img,
                              { [style.twoImg]: value?.actionRule?.itemIds?.length === 2 },
                              { [style.multiImg]: value?.actionRule?.itemIds?.length > 2 }
                            )}
                            src={mapItem.imgUrl}
                          />
                        ))}
                      </div>
                    )}
                    {[1, 3, 4].includes(value?.actionRule.contentType) &&
                      value?.actionRule?.itemIds?.map((mapItem) => (
                        <div className={style.card} key={mapItem.itemId}>
                          <img className={style.shareImg} src={mapItem.imgUrl} />
                          <div className={style.shareTitle}>
                            <span className="two-line-ellipsis">{mapItem.itemName}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className={style.momentItemFooter}>
                    <div className={style.footerTime}>{(value.pushTime as Moment).format('HH:mm')}</div>
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
