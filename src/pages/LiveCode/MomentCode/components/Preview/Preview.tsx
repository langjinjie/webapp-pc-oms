import React, { useEffect } from 'react';
import { Icon } from 'src/components';
import { IPreviewValue } from 'src/utils/interface';
import style from './style.module.less';
import classNames from 'classnames';
// import moment from 'moment';
import { getMomentDetail } from 'src/apis/marketing';

interface IPreviewProps {
  value?: Partial<IPreviewValue>;
  className?: string;
  isMoment?: boolean; // 是否是朋友圈（默认为聊天框）
}

const Preview: React.FC<IPreviewProps> = ({ value, className, isMoment }) => {
  // const [itemIds, setItemIds] = useState<any[]>([]);
  console.log(value, isMoment);

  const getMomentDetailByFeedId = async () => {
    // 如果是今日朋友圈
    if (value?.wayName === '今日朋友圈' && value?.actionRule?.feedId && value?.actionRule?.itemIds?.length === 0) {
      const res = await getMomentDetail({ feedId: value?.actionRule.feedId });
      if (res) {
        // setItemIds(res.itemList);
      }
    } else {
      // setItemIds(value?.actionRule?.itemIds || []);
    }
  };

  useEffect(() => {
    getMomentDetailByFeedId();
  }, [value]);

  return (
    <div className={classNames(style.phoneWrap, className)}>
      <div className={style.inner}>
        <header className={style.header}>
          <Icon name="zuojiantou-copy" className={style.back}></Icon>
          {/* <div className={style.staffName}>{isMoment ? '朋友圈' : '客户经理张晓雅'}</div> */}
          <div className={style.staffName}>加入群聊</div>
          <Icon name="diandian" className={style.more}></Icon>
        </header>
        <div className={classNames(style.content, { [style.isMoment]: isMoment })}></div>
        {isMoment && <div className={style.footerLine} />}
        {isMoment || <footer className={style.footer} />}
      </div>
    </div>
  );
};
export default Preview;
