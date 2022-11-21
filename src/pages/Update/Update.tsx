import React from 'react';
import style from './style.module.less';
const Update: React.FC = () => {
  return (
    <div className={style.wrap}>
      <img className={style.img} src={require('src/assets/images/update/update.jpg')} alt="" />
    </div>
  );
};
export default Update;
