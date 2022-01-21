/**
 * @name MessageType
 * @author Lester
 * @date 2021-12-07 17:31
 */
import React from 'react';
import { Icon } from 'src/components';
import style from './style.module.less';

interface MessageTypeProps {
  disabled?: boolean;
  value?: number;
  onChange?: (val: number) => void;
}

const MessageType: React.FC<MessageTypeProps> = ({ value, onChange, disabled }) => {
  const noticeUrl = 'https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/img/common/market/news1.png';
  const newsUrl = ' https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/img/common/market/notice1.png';

  return (
    <ul className={style.msgTypeWrap}>
      <li className={style.msgTypeItem} onClick={() => !disabled && onChange && onChange(1)}>
        {value === 1 && (
          <div className={style.checkMask}>
            <Icon className={style.checkIcon} name="biaoqian_wancheng" />
          </div>
        )}
        <img className={style.msgImg} src={newsUrl} alt="" />
        <div className={style.msgDesc}>上新</div>
      </li>
      <li className={style.msgTypeItem} onClick={() => !disabled && onChange && onChange(2)}>
        {value === 2 && (
          <div className={style.checkMask}>
            <Icon className={style.checkIcon} name="biaoqian_wancheng" />
          </div>
        )}
        <img className={style.msgImg} src={noticeUrl} alt="" />
        <div className={style.msgDesc}>通知</div>
      </li>
    </ul>
  );
};

export default MessageType;
