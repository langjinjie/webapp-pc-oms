import React from 'react';
import { useDocumentTitle } from 'src/utils/base';
import style from './style.module.less';

const PointsDeduction: React.FC = () => {
  useDocumentTitle('积分商城-积分扣减');
  return <div className={style.wrap}>PointsDeduction</div>;
};
export default PointsDeduction;
