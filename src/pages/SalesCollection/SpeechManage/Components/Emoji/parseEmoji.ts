import { emojiData, emojiPanelData } from './emojiData';

// type Iemoji =
//   | {
//       id: number;
//       cn: string;
//       hk: string;
//       us: string;
//       code: string;
//       web_code: string;
//       style: string;
//       emoji?: undefined;
//     }
//   | {
//       id: number;
//       cn: string;
//       emoji: string;
//     };

const emotionMap: any = {};
// let emotionNames: string[] = [];
// let emotions: Iemoji[] = [];
emojiPanelData.forEach((id) => {
  // emotions.push(emotionMap[id]);
  console.log(id);
});
emojiData.forEach((item) => {
  if (item.cn) {
    emotionMap[item.cn] = item;
  }
  if (item.code) emotionMap[item.code] = item;
  if (item.us) emotionMap[item.us] = item;
  // emotionNames.push(item.cn);
});

type ContentType = {
  type: number;
  content: string;
  imageClass?: string;
};

type ContentListType = ContentType[];

/**
 * @description emoji字符串进行解析成  ContentListType
 */
const parseEmoji = (content: string): ContentListType => {
  let emojiIndexList: { idx: number; code: string; type: number }[] = [];

  for (const k in emotionMap) {
    let idx = content.indexOf(k);

    while (idx > 0) {
      emojiIndexList.push({ idx: idx, code: k, type: 2 });
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
        content: content.substring(item.idx, item.code.length),
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
};

export default parseEmoji;
