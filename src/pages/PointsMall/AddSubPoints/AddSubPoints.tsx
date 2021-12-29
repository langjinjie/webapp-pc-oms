import React from 'react';
import { useDocumentTitle } from 'src/utils/base';
import style from './style.module.less';

const AddSubPoints: React.FC = () => {
  useDocumentTitle('积分商城-加减积分');
  return <div className={style.wrap}>AddSubPoints</div>;
};
export default AddSubPoints;
