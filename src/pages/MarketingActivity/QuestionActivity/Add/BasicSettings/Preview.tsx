import React from 'react';
import { Icon } from 'src/components';
import style from './style.module.less';
import classNames from 'classnames';
import { replaceEnter } from 'src/utils/base';
// import moment from 'moment';

interface IPreviewProps {
  value?: any;
  title?: string;
  className?: string;
}

const Preview: React.FC<IPreviewProps> = ({ value, className, title }) => {
  return (
    <div className={classNames(style.phoneWrap, className)}>
      <div className={style.inner}>
        <header className={style.header}>
          <Icon name="zuojiantou-copy" className={style.back}></Icon>
          <div className={style.staffName}>{title}</div>
          <Icon name="diandian" className={style.more}></Icon>
        </header>
        <div className={classNames(style.content)} style={{ background: value?.themeColor || '#fff' }}>
          <div className={style.index} style={{ color: value?.textColor }}>
            <div className={style.record} style={{ background: value?.buttonBgColor || '#fff' }}>
              我的成绩
            </div>

            <div className={style.title} />
            <div className={style.activityPoster}>
              <img src={value?.activityPoster} />
            </div>
            <span className={style.startBtn} style={{ background: value?.buttonBgColor || '#fff' }}>
              立即答题
            </span>
            <div className={style.desc}>
              <div className={style.descTitle}></div>
              <div
                className={style.descContent}
                dangerouslySetInnerHTML={{ __html: replaceEnter(value?.activityDesc || '') }}
              />
            </div>
          </div>
        </div>
        <div className={style.footerLine} />
      </div>
    </div>
  );
};
export default Preview;
