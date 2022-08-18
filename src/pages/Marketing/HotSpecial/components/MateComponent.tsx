import React from 'react';
import { ArticleSelectComponent } from './ArticleSelectComponent';

import style from './style.module.less';

type ValueType = string[] | string;
interface MeatComponentProps {
  type: string;
  value?: ValueType;
  onChange?: (keys: React.Key[], rows: any[]) => void;
}
export const MeatComponent: React.FC<MeatComponentProps> = ({ type, value, onChange }) => {
  console.log(type, value, onChange);
  const handleChange = (keys: React.Key[], rows: any[]) => {
    onChange?.(keys, rows);
  };
  return (
    <div>
      <ArticleSelectComponent onChange={handleChange} />
      <div className="ph20">
        <h3 className="pb20">已选择</h3>
        <div className={style.panelWrap}></div>
      </div>
    </div>
  );
};
