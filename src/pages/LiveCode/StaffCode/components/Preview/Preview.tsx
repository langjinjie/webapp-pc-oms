import React from 'react';
import { Icon } from 'src/components';
import style from './style.module.less';
import classNames from 'classnames';
import ParseEmoji from 'src/pages/SalesCollection/SpeechManage/Components/Emoji/parseEmoji';

export interface IValue {
  welcomeWord?: string;
  welcomes?: IWelcome[];
}

interface IWelcome {
  welcomeTitle?: string;
  welcomeDesc?: string;
  welcomeLogo?: string;
  welcomeUrl?: string;
  itemId?: string;
  welcomeType: number;
}

interface IPreviewProps {
  value?: IValue;
  className?: string;
}

const Preview: React.FC<IPreviewProps> = ({ value, className }) => {
  return (
    <div className={classNames(style.phoneWrap, className)}>
      <div className={style.inner}>
        <header className={style.header}>
          <Icon name="zuojiantou-copy" className={style.back}></Icon>
          <div className={style.staffName}>客户经理</div>
          <Icon name="diandian" className={style.more}></Icon>
        </header>
        <div className={classNames(style.content)}>
          {/* 自定义话术 */}
          {value?.welcomeWord && (
            <div className={style.newsItem}>
              <div className={style.avatar}>
                <img className={style.avatarImg} src={require('src/assets/images/avater.jpg')} />
              </div>
              <div className={style.news}>{<ParseEmoji content={value?.welcomeWord} />}</div>
            </div>
          )}
          {/* 营销素材列表 */}
          {(value?.welcomes || []).length > 0 &&
            (value?.welcomes || []).map((mapItem) => (
              <div className={style.newsItem} key={mapItem.itemId || mapItem.welcomeUrl}>
                <div className={style.avatar}>
                  <img className={style.avatarImg} src={require('src/assets/images/avater.jpg')} />
                </div>
                {/* 海报 */}
                {[2, 10].includes(mapItem?.welcomeType) && (
                  <div className={style.posterWrap}>
                    <img className={style.poster} src={mapItem.welcomeUrl} />
                  </div>
                )}
                {[1, 3, 4, 11].includes(mapItem?.welcomeType) && (
                  <div className={classNames(style.cardMessage, 'flex')}>
                    <div className={'flex vertical cell'}>
                      <div className={classNames(style.title, 'ellipsis')}>{mapItem.welcomeTitle}</div>
                      <div className={classNames(style.desc, 'two-line-ellipsis')}>{mapItem.welcomeDesc}</div>
                    </div>
                    <div className={classNames(style.imgAndDesc, 'fixed ml10')}>
                      <div className={style.img}>
                        <img src={mapItem.welcomeLogo} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
        <footer className={style.footer} />
      </div>
    </div>
  );
};
export default Preview;
