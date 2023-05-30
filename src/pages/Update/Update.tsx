import React from 'react';
import style from './style.module.less';
const Update: React.FC = () => {
  return (
    <div className={style.wrap}>
      <div className={style.left}>
        <div className={style.updateImg} />
        <div className={style.updating}>正在更新中</div>
        <div className={style.updateTips}>等待是为了更好的体验</div>
      </div>
      <div className={style.right} />
      <div className={style.footer}>
        <div> 本服务由腾银提供。腾银，面向金融领域提供产业应用方案。</div>
        <div>Copyright @ 2021 Tencent-TengYin All Rights Reserved</div>
      </div>
    </div>
  );
};
export default Update;
