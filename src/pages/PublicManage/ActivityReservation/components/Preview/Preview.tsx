import React from 'react';
import { Icon } from 'src/components';
import style from './style.module.less';
import classNames from 'classnames';

export interface IValue {
  liveName?: string;
  liveQrCode?: string;
  /* 👆上面是群活码 👇下面是人工留资  */
  mainImgUrl?: string;
  needClientName?: 0 | 1;
  needPhone?: 0 | 1;
  needCarNumber?: 0 | 1;
}

interface IPreviewProps {
  value?: IValue;
  className?: string;
  type?: 1 | 2;
}

const Preview: React.FC<IPreviewProps> = ({ value, className, type }) => {
  return (
    <div className={classNames(style.phoneWrap, className)}>
      <div className={style.inner}>
        <header className={style.header}>
          <Icon name="zuojiantou-copy" className={style.back}></Icon>
          <div className={style.staffName}>客户经理</div>
          <Icon name="diandian" className={style.more}></Icon>
        </header>
        <div className={classNames(style.content)}>
          {type === 1 && (
            <>
              <div className={style.mainImgUrl}>
                <img src={value?.mainImgUrl} alt="主图" />
              </div>
              <div className={classNames(style.title, 'text-center')}>填写资料</div>
              {!value?.needClientName || <div className={style.item}>姓名</div>}
              {!value?.needPhone || <div className={style.item}>手机号码</div>}
              {!value?.needCarNumber || <div className={style.item}>车牌号</div>}
              <div className={style.submitWrap}>
                <div className={style.submit}>提交</div>
                <div className={style.tips}>
                  我有疑问， <span className={style.text}>问一问</span>
                </div>
              </div>
            </>
          )}
          {type === 2 && (
            <>
              <div className={style.banner}>
                <div className={classNames(style.name, 'two-line-ellipsis')} title={value?.liveName}>
                  {value?.liveName}
                </div>
              </div>
              <div className={style.groupChat}>
                <img className={style.chatCode} src={value?.liveQrCode} alt="群二维码" />
                <div className={style.scanTip}>长按识别二维码</div>
                <div className={classNames(style.customerTip, 'two-line-ellipsis')}>若无法扫码进群，请联系客服</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Preview;
