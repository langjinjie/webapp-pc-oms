import classNames from 'classnames';
import React from 'react';
import { Icon } from 'src/components';
import { percentage } from 'src/utils/base';
import { numFormat } from 'src/utils/tools';
import styles from './style.module.less';

interface DataItemProps {
  path?: string;
  onClick: () => void;
}
export const DataItem: React.FC<DataItemProps> = ({ onClick }) => {
  return (
    <div className={classNames(styles.wrapper, 'flex cell align-center justify-between')} onClick={onClick}>
      <dl className="ml30 flex vertical align-center">
        <dt>
          <i className={styles.iconType}></i>
        </dt>
        <dd className="bold font18">客户信息</dd>
      </dl>
      <div className={styles.bigNum}> {numFormat(810108)}</div>
      <dl className="flex vertical align-center">
        <dt className="f28 italic">3.20</dt>
        <dd className="color-text-regular font16 mt16">本月日人均</dd>
      </dl>
      <dl className="mr30 flex vertical align-center">
        <dt className={classNames(styles.contrast, 'f28 color-danger')}>
          {/* <Icon className={classNames(styles.contrastArrow, 'f24')} name="icon_common_12_Rising" /> */}
          <Icon className={classNames(styles.contrastArrow, 'f24')} name="icon_common_12_Drop" />
          <span className="italic">{percentage(33, 51)}</span>
        </dt>
        <dd className="color-text-regular font16 mt16">环比上月</dd>
      </dl>
    </div>
  );
};
