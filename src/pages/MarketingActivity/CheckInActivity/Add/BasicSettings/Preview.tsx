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
          <div className={style.checkIndex} style={{ backgroundColor: value?.themeBgcolour }}>
            <div className={style.contentHeader}>
              {/* <img className={style.headerTitle} src={require('src/assets/images/generalActivity/checkIn.png')} /> */}
              <img className={style.bgImgUrl} src={value?.bgImgUrl} />
            </div>
            <div className={style.checkbox}>
              <div className={style.title}>连续签到，领超多奖品!</div>
              <div className={style.checkDays}>
                <div className={style.prev}>
                  <Icon name="zuojiantou-copy" />
                </div>
                <div className={classNames(style.checkList, 'flex justify-center')}>
                  <div className={classNames(style.item)}>
                    <div className={style.checkInText}>今天</div>
                    <img className={style.goodsSmallImgUrl} src={value?.signLogo} />
                    <div className={style.checkInText}>未签到</div>
                  </div>
                  <div className={classNames(style.item)}>
                    <div className={style.checkInText}>第2天</div>
                    <img className={style.goodsSmallImgUrl} src={value?.signLogo} />
                    <div className={style.checkInText}>未签到</div>
                  </div>
                  <div className={classNames(style.item)}>
                    <div className={style.checkInText}>第3天</div>
                    <img className={style.goodsSmallImgUrl} src={value?.signLogo} />
                    <div className={style.checkInText}>未签到</div>
                  </div>
                  <div className={classNames(style.item)}>
                    <div className={style.checkInText}>第4天</div>
                    <img className={style.goodsSmallImgUrl} src={value?.signLogo} />
                    <div className={style.checkInText}>未签到</div>
                  </div>
                  <div className={classNames(style.item)}>
                    <div className={style.checkInText}>第5天</div>
                    <img className={style.goodsSmallImgUrl} src={value?.signLogo} />
                    <div className={style.checkInText}>未签到</div>
                  </div>
                  <div className={classNames(style.item)}>
                    <div className={style.checkInText}>第6天</div>
                    <img className={style.goodsSmallImgUrl} src={value?.signLogo} />
                    <div className={style.checkInText}>未签到</div>
                  </div>
                  <div className={classNames(style.item)}>
                    <div className={style.checkInText}>第7天</div>
                    <img className={style.goodsSmallImgUrl} src={value?.signLogo} />
                    <div className={style.checkInText}>未签到</div>
                  </div>
                </div>

                <div className={style.next}>
                  <Icon name="iconfontjiantou2" />
                </div>
              </div>
              <div className={classNames(style.btnWrap, 'flex justify-between align-center')}>
                <div className={style.records}>签到记录</div>
                <div className={style.check} style={{ backgroundColor: value?.buttonBgcolour }}>
                  立即打卡
                </div>
                <div className={style.prizes}>我的奖品</div>
              </div>
            </div>
            <div className={style.sectionTitle}>签到有奖</div>
            <div className={style.rewardsWrap}>
              <div className={style.prev}>
                <Icon name="zuojiantou-copy" />
              </div>
              <div className={style.rewardsItem}>
                <div className={style.condiDay}>签到1天</div>
                <img className={style.goodsSmallImgUrl} src={require('src/assets/images/icon_dateboard.png')} />
                <div className={classNames(style.goodsName, 'text-ellipsis')}>奖品名称</div>
              </div>
              <div className={style.rewardsItem}>
                <div className={style.condiDay}>签到2天</div>
                <img className={style.goodsSmallImgUrl} src={require('src/assets/images/icon_dateboard.png')} />
                <div className={classNames(style.goodsName, 'text-ellipsis')}>奖品名称</div>
              </div>
              <div className={style.next}>
                <Icon name="iconfontjiantou2" />
              </div>
            </div>
            <div className={style.sectionTitle} style={{ color: value?.wordBgcolour }}>
              活动说明
            </div>
            <div
              className={style.description}
              style={{ color: value?.wordBgcolour }}
              dangerouslySetInnerHTML={{ __html: replaceEnter(value?.desc || '') }}
            ></div>
          </div>
        </div>
        <div className={style.footerLine} />
      </div>
    </div>
  );
};
export default Preview;
