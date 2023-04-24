import React from 'react';
import Emoji from './Components/Emoji';
const EmojiTest: React.FC = () => {
  const insertEmoji = (param: any) => {
    console.log(param);
  };
  return (
    <div>
      <h3>Emoji测试</h3>
      <Emoji insertEmoji={insertEmoji}></Emoji>
    </div>
  );
};

export default EmojiTest;
