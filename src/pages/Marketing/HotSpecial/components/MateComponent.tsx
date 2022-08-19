import classNames from 'classnames';
import React, { useState } from 'react';
import { isArray } from 'src/utils/tools';
import { Icon } from 'tenacity-ui';
import { ArticleSelectComponent } from './ArticleSelectComponent';
import { PosterSelectComponent } from './PosterSelectComponent';
import { ProductSelectComponent } from './ProductSelectComponent';

import style from './style.module.less';

type ValueType = string[] | string;
interface MeatComponentProps {
  type: string;
  value?: ValueType;
  onChange?: (keys: React.Key[], rows: any[]) => void;
}
export const MeatComponent: React.FC<MeatComponentProps> = ({ type, value, onChange }) => {
  console.log(type, value, onChange);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const handleChange = (keys: React.Key[], rows: any[]) => {
    onChange?.(keys, rows);
    setSelectedRowKeys(keys);
  };

  const removeItem = (index: number) => {
    console.log(index);
  };
  return (
    <div>
      {false && <ArticleSelectComponent onChange={handleChange} />}
      {false && <PosterSelectComponent selectedRowKeys={selectedRowKeys} onChange={handleChange} />}
      <ProductSelectComponent selectedRowKeys={selectedRowKeys} onChange={handleChange} />
      <div className="ph20 mb20">
        <h3 className="pb20">已选择</h3>
        <div className={classNames(style.panelWrap, style.tagWrap)}>
          <div className={classNames(style.marketingWarp)}>
            {isArray(value) &&
              (value as any[]).map((row, index) => (
                <div className={classNames(style.customTag)} key={(row.newsId || row.itemId || row.posterId) + index}>
                  <span>{row}</span>
                  <Icon className={style.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem(index)}></Icon>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
