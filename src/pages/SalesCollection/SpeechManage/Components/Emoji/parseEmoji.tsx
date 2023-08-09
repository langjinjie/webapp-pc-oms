import classNames from 'classnames';
import React, { useMemo } from 'react';
import { emojiData } from './emojiData';
import style from './index.module.less';
import dangerousHTMLToSafeHTML from 'src/utils/dangerousHTMLToSafeHTML';
const emotionMap: any = {};
const emojiSource = require('./emoji-sprite.b5bd1fe0.png');
emojiData.forEach((item) => {
  if (item.cn) {
    emotionMap[item.cn] = item;
  }
  if (item.code) emotionMap[item.code] = item;
  if (item.us) emotionMap[item.us] = item;
});

type ContentType = {
  type: number;
  content: string;
  imageClass?: string;
  customValue?: string;
};

type ContentListType = ContentType[];

/**
 * @description emoji字符串进行解析成  ContentListType
 */
type customType = {
  [propKey: string]: string | { isKeywords: string; value: string };
};
const ParseEmoji: React.FC<{ content: string; customText?: customType }> = ({ content, customText }) => {
  const newContentList = useMemo(() => {
    let emojiIndexList: { idx: number; code: string; type: number; customValue?: string }[] = [];
    if (customText) {
      for (const key in customText) {
        const newKey = key.indexOf('keywords') > -1 ? key.replace('keywords', '') : `[${key}]`;
        emotionMap[newKey] = customText[key];
      }
    }
    for (const k in emotionMap) {
      let idx = content.indexOf(k);

      while (idx >= 0) {
        emojiIndexList.push({
          idx: idx,
          code: k,
          type: emotionMap[k].id !== undefined ? 2 : 3,
          customValue: emotionMap[k].id === undefined ? emotionMap[k] : ''
        });
        idx = content.indexOf(k, idx + k.length);
      }
    }
    emojiIndexList = emojiIndexList.sort((a, b) => a.idx - b.idx);

    const newContentList: ContentListType = [];
    let lastTextIndex = 0;

    emojiIndexList.forEach((item) => {
      if (lastTextIndex !== item.idx) {
        newContentList.push({
          type: 1,
          content: content.substring(lastTextIndex, item.idx)
        });
      }
      if (item.type === 2) {
        newContentList.push({
          type: item.type,
          content: content.substring(item.idx, item.idx + item.code.length),
          imageClass: emotionMap[item.code].style
        });
      }
      if (item.type === 3) {
        newContentList.push({
          type: item.type,
          content: content.substring(item.idx, item.idx + item.code.length),
          customValue: item.customValue as string,
          imageClass: emotionMap[item.code].style
        });
      }
      lastTextIndex = item.idx + item.code.length;
    });
    const lastText = content.substring(lastTextIndex);
    if (lastText) {
      newContentList.push({
        type: 1,
        content: lastText
      });
    }
    return newContentList;
  }, [content, customText]);

  const lineHeight = 18;

  return (
    <div className={style.contentWrap}>
      {newContentList.map((item, index) => {
        return (
          <span key={index}>
            {item.type === 1 && (
              <span
                dangerouslySetInnerHTML={{ __html: dangerousHTMLToSafeHTML(item.content.replace(/\n|\r/g, '<br/>')) }}
              ></span>
            )}
            {item.type === 2 && (
              <div
                style={{
                  display: 'inline-block',
                  margin: '0',
                  overflow: 'hidden',
                  height: lineHeight + 'px',
                  width: lineHeight + 'px',
                  transform: 'translate(0, 4px)'
                }}
              >
                <span
                  className={item.imageClass}
                  style={{
                    backgroundImage: `url(${emojiSource})`,
                    transformOrigin: '0 0',
                    backgroundSize: '724px',
                    transform: `scale(${lineHeight / 64})`
                  }}
                ></span>
              </div>
            )}
            {item.type === 3 && (
              <span
                className={classNames({
                  'color-primary': !item.customValue || item.content === item.customValue
                })}
              >
                {item.customValue || item.content}
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default ParseEmoji;
