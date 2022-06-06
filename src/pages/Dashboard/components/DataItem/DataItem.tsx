import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Icon } from 'src/components';
import { numFormat } from 'src/utils/tools';
import styles from './style.module.less';
import { dataCodeList } from '../../List/config';

interface DataItemProps {
  path?: string;
  onClick: () => void;
  dataCodeImg: string;
  data?: { key: string; title: string; children?: any[]; [prop: string]: any };
}
export const DataItem: React.FC<DataItemProps> = ({ onClick, data }) => {
  const title = useMemo(() => {
    if (data) {
      return dataCodeList.filter((item) => item.key === data?.dataCode)?.[0]?.title;
    } else {
      return '';
    }
  }, [data]);
  return (
    <div className={classNames(styles.wrapper, 'flex align-center justify-between cell mb30')} onClick={onClick}>
      <dl className="ml30 flex vertical align-center" style={{ width: '74px' }}>
        <dt>
          <img src={data?.dataCodeImg} className={styles.iconType}></img>
        </dt>
        <dd className="bold font18 mt12">{title}</dd>
      </dl>
      <div className={styles.bigNum}> {numFormat(data?.totalCount || 100001)}</div>
      <dl className="flex vertical align-center">
        <dt className="f28 italic">{data?.monthDayAvg}</dt>
        <dd className="color-text-regular font16 mt16">本月日人均</dd>
      </dl>
      <dl className="mr30 flex vertical align-center">
        <dt className={classNames(styles.contrast, 'f28', [data?.dataMOM >= 0 ? 'color-danger' : 'color-success'])}>
          {data?.dataMOM >= 0
            ? (
            <Icon className={classNames(styles.contrastArrow, 'f24')} name="icon_common_12_Rising" />
              )
            : (
            <Icon className={classNames(styles.contrastArrow, 'f24')} name="icon_common_12_Drop" />
              )}

          <span className="italic">{Math.abs(data?.dataMOM)} %</span>
        </dt>
        <dd className="color-text-regular font16 mt16">环比上月</dd>
      </dl>
    </div>
  );
};
