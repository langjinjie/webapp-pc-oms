import classNames from 'classnames';
import React, { useState } from 'react';
import { emojiData, emojiPanelData } from './emojiData';
// import parser from './parseEmoji';
const emojiSource = require('./emoji-sprite.b5bd1fe0.png');

type EmotionType =
  | {
      id: number;
      cn: string;
      hk: string;
      us: string;
      code: string;
      // eslint-disable-next-line camelcase
      web_code: string;
      style: string;
      emoji?: undefined;
    }
  | {
      id: number;
      cn: string;
      emoji: string;
      hk: string;
      us: string;
      code: string;
      // eslint-disable-next-line camelcase
      web_code: string;
      style: string;
    };
type EmotionListType = EmotionType[];

const emotionMap: {
  [key: string]: EmotionType;
} = {};
emojiData.forEach(function (item) {
  emotionMap[item.id] = item;
});
const emotions: EmotionListType = [];
emojiPanelData.forEach(function (id) {
  return emotions.push(emotionMap[id]);
});
const Emoji: React.FC<{ insertEmoji: (params: any) => void }> = (props) => {
  const [data, setData] = useState({
    history: [],
    emotions: emotions,
    extraPadding: 0,
    perLine: 0
  });
  const getEmojiNames = () => {
    const emotionNames: string[] = [];
    emojiData.forEach(function (item) {
      // emotionMap[item.id] = item;
      emotionNames.push(item.cn);
    });
    return emotionNames;
  };
  const LRUCache = (arr: number[], limit: number, data: number) => {
    const idx = arr.indexOf(data);
    if (idx >= 0) {
      arr.splice(idx, 1);
      arr.unshift(data);
    } else if (arr.length < limit) {
      arr.push(data);
    } else if (arr.length === limit) {
      arr[limit - 1] = data;
    }
  };
  const insertEmoji = (evt: EmotionType, idx: number) => {
    const emotionName = emotions[idx].cn;
    console.log(emotionName);

    LRUCache(data.history, data.perLine, idx);
    setData((data) => ({ ...data, history: data.history }));
    props.insertEmoji({ emotionName });
  };

  return (
    <div>
      {emotions.map((item, index) => {
        return (
          <div onClick={() => insertEmoji(item, index)} key={item.id}>
            <div
              className={classNames('weui-icon_emotion ', item.style)}
              style={{ backgroundImage: `url(${emojiSource})` }}
            ></div>
          </div>
        );
      })}
      <div></div>
    </div>
  );
};
export default Emoji;
