import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import style from './style.module.less';
import { Icon } from 'src/components';
import { Button, message } from 'antd';
import { getAutoParams } from 'src/apis/salesCollection';

interface CustomTextAreaProps {
  value?: string | undefined;
  onChange?: (value: string) => void;
  maxLength: number;
  visible?: boolean;
  sensitive?: number;
  sensitiveWord?: string;
  disabled?: boolean;
}
const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  onChange,
  value,
  maxLength,
  visible,
  sensitive,
  sensitiveWord,
  disabled
}) => {
  const textareaRef: React.LegacyRef<HTMLTextAreaElement> = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [customBtns, setCustomBtns] = useState<string[]>([]);
  const [count, setCount] = useState(0);

  const getAutoParamList = async () => {
    const autoParamsOfSpeech: string[] = JSON.parse(sessionStorage.getItem('autoParamsOfSpeech') || '[]');
    if (autoParamsOfSpeech.length > 0) {
      return setCustomBtns(autoParamsOfSpeech);
    }
    const res: string[] = await getAutoParams({});
    if (res) {
      sessionStorage.setItem('autoParamsOfSpeech', JSON.stringify(res));
      setCustomBtns(res);
    }
  };

  useEffect(() => {
    getAutoParamList();
  }, []);
  useEffect(() => {
    if (value) setCount(value.length);
  }, [value]);
  useEffect(() => {
    if (visible) {
      setIsOpen(false);
    }
  }, [visible]);

  const getPositionForTextArea = (ctrl: HTMLTextAreaElement) => {
    // 获取光标位置
    const CaretPos = {
      start: 0,
      end: 0
    };
    if (ctrl.selectionStart) {
      // Firefox support
      CaretPos.start = ctrl.selectionStart;
    }
    if (ctrl.selectionEnd) {
      CaretPos.end = ctrl.selectionEnd;
    }
    return CaretPos;
  };
  const setCursorPosition = (ctrl: HTMLTextAreaElement, pos: number) => {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  };
  const handlePushName = (param: string) => {
    const len = param.length + 2;
    if (textareaRef.current) {
      const textareaEle = textareaRef.current;
      const pos = getPositionForTextArea(textareaEle);
      const inputValue = textareaEle.value;
      const b = inputValue.split('');
      b.splice(pos.start, 0, `[${param}]`).join('');
      const formatVal = b.join('');
      if (formatVal.length > 300) {
        return message.warning('话术最多300字，已超过最大限度无法插入');
      }
      textareaEle.value = formatVal;
      setCursorPosition(textareaEle, pos.start + len);
      setCount(formatVal.length);
      onChange?.(formatVal);
    }
  };

  const handleTextareaChange: React.FocusEventHandler<HTMLTextAreaElement> = (event) => {
    const content = event.target.value || '';
    onChange?.(content);
    setCount(content.length);
  };

  return (
    <div>
      <div className={classNames(style.textAreaWrap, 'isError')}>
        <div className={classNames(style.btnGroup, { [style.open]: isOpen })}>
          <div className={classNames(style.btnArrow)} onClick={() => setIsOpen(!isOpen)}>
            {isOpen
              ? (
              <span>
                收起 <Icon name="shangjiantou" />
              </span>
                )
              : (
              <span>
                展开 <Icon name="icon_common_16_Line_Down" />
              </span>
                )}
          </div>
          <div className={style.btnsWrap}>
            {customBtns.map((btnText) => (
              <Button
                type="link"
                className={style.mr10}
                key={btnText}
                color="primary"
                onClick={() => handlePushName(btnText)}
                disabled={disabled}
              >
                [插入{btnText}]
              </Button>
            ))}
          </div>
        </div>
        <div className={style.textAreaBox}>
          <textarea
            rows={4}
            placeholder="请输入"
            className={style.textarea}
            ref={textareaRef}
            value={value}
            maxLength={maxLength}
            onChange={handleTextareaChange}
            disabled={disabled}
          />
        </div>
        <div className={classNames(style.count, 'flex justify-end')}>
          {count}/{maxLength}
        </div>
      </div>
      {sensitive === 1 && (
        <div className={style.sensitiveWrap}>
          触发敏感词：<span className={style.errorText}>{sensitiveWord}</span>
        </div>
      )}
    </div>
  );
};

export default CustomTextArea;
