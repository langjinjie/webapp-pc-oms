import React from 'react';
import { Icon } from 'src/components';
import style from './style.module.less';
import classNames from 'classnames';

export interface IGroupLive {
  name: string; // 是
  word: string; // 是
  codeList: {
    chatName: string; // 是
    chatCode: string; // 是
  }[];
}

interface IPreviewProps {
  value?: IGroupLive;
  className?: string;
  isMoment?: boolean; // 是否是朋友圈（默认为聊天框）
}

const Preview: React.FC<IPreviewProps> = ({ value, className, isMoment }) => {
  return (
    <div className={classNames(style.phoneWrap, className)}>
      <div className={style.inner}>
        <header className={style.header}>
          <Icon name="zuojiantou-copy" className={style.back}></Icon>
          {/* <div className={style.staffName}>{isMoment ? '朋友圈' : '客户经理张晓雅'}</div> */}
          <div className={style.staffName}>加入群聊</div>
          <Icon name="diandian" className={style.more}></Icon>
        </header>
        <div className={classNames(style.content, { [style.isMoment]: isMoment })}>
          <div className={style.banner}>
            <div className={style.name}>{value?.name}</div>
            <div className={style.word}>{value?.word}</div>
          </div>
          <div className={style.groupChat}>
            <div className={style.chatName}>{value?.codeList?.[0]?.chatName}</div>
            <img className={style.chatCode} src={value?.codeList?.[0]?.chatCode} alt="群二维码" />
            <div className={style.scanTip}>长按识别二维码</div>
            <div className={style.customerTip}>若无法扫码进群，请联系客服</div>
          </div>
        </div>
        <div className={style.footerLine} />
      </div>
    </div>
  );
};
export default Preview;
