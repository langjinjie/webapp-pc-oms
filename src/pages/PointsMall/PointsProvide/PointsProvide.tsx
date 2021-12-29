import React from 'react';
import { useDocumentTitle } from 'src/utils/base';
import style from './style.module.less';

const PointsProvide: React.FC = () => {
  useDocumentTitle('积分商城-积分发放');
  return <div className={style.wrap}>PointsProvide</div>;
};
export default PointsProvide;
