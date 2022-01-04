/**
 * @name MessageType
 * @author Lester
 * @date 2021-12-07 17:31
 */
import React from 'react';
import { Icon } from 'src/components';
import style from './style.module.less';

interface MessageTypeProps {
  value?: number;
  onChange?: (val: number) => void;
}

const MessageType: React.FC<MessageTypeProps> = ({ value, onChange }) => {
  return (
    <ul className={style.msgTypeWrap}>
      <li className={style.msgTypeItem} onClick={() => onChange && onChange(1)}>
        {value === 1 && (
          <div className={style.checkMask}>
            <Icon className={style.checkIcon} name="biaoqian_wancheng" />
          </div>
        )}
        <img className={style.msgImg} src={require('src/assets/images/notice/new.png')} alt="" />
        <div className={style.msgDesc}>上新</div>
      </li>
      <li className={style.msgTypeItem} onClick={() => onChange && onChange(2)}>
        {value === 2 && (
          <div className={style.checkMask}>
            <Icon className={style.checkIcon} name="biaoqian_wancheng" />
          </div>
        )}
        <img className={style.msgImg} src={require('src/assets/images/notice/notice.png')} alt="" />
        <div className={style.msgDesc}>通知</div>
      </li>
    </ul>
  );
};

export default MessageType;
