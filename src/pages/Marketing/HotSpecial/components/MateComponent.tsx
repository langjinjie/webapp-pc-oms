import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import classNames from 'classnames';
import { isArray } from 'src/utils/tools';
import { Icon } from 'tenacity-ui';
import { ArticleSelectComponent } from './ArticleSelectComponent';
import { PosterSelectComponent } from './PosterSelectComponent';
import { ProductSelectComponent } from './ProductSelectComponent';

import style from './style.module.less';
import { ActivitySelectComponent } from './ActivitySelectComponent';

type ValueType = any[] | string;

interface MeatComponentProps {
  type: number;
  value?: ValueType;
  onChange?: (value: any) => void;
}
export const MeatComponent: React.FC<MeatComponentProps> = ({ type, value, onChange }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [selectRows, setSelectRows] = useState<any[]>([]);
  const handleChange = (keys: React.Key[], rows: any[]) => {
    // 针对海报选中未加载的数据进行过滤重组处理
    const res = rows.filter((row) => row !== undefined);
    const filterKeys = keys.filter((key) => !res.map((item) => item.itemId).includes(key));

    const filterRows = selectRows.filter((item) => filterKeys.includes(item.itemId!));
    setSelectRows([...res, ...filterRows]);
    console.log('++++++++++++++++++', [...res, ...filterRows]);
    onChange?.([...res, ...filterRows]);
    setSelectedRowKeys(keys);
  };

  useEffect(() => {
    if (value) {
      const keys = (isArray(value) && (value as any[])?.map((item: any) => item.itemId)) || [];
      setSelectedRowKeys(keys);
      if (isArray(value)) {
        setSelectRows(value as any[]);
      }
    }
  }, []);

  /**
   * 删除选中的内容
   */
  const removeItem = (index: number) => {
    if (value) {
      const copyData = [...(value as any[])];
      copyData.splice(index, 1);
      onChange?.(copyData);
    }
  };
  const speechChange = (speech: string) => {
    onChange?.(speech);
  };

  return (
    <div>
      {/* 话术类型 */}
      {type === 0 && (
        <Input.TextArea
          style={{ width: '600px' }}
          onChange={(e) => speechChange(e.target.value)}
          className={style.speechContent}
          value={value}
        ></Input.TextArea>
      )}
      {type === 1 && <ArticleSelectComponent selectedRowKeys={selectedRowKeys} onChange={handleChange} />}
      {type === 2 && <PosterSelectComponent selectedRowKeys={selectedRowKeys} onChange={handleChange} />}
      {type === 3 && <ProductSelectComponent selectedRowKeys={selectedRowKeys} onChange={handleChange} />}
      {type === 4 && <ActivitySelectComponent selectedRowKeys={selectedRowKeys} onChange={handleChange} />}
      {type !== 0 && (
        <div className="ph20 mb20">
          <h3 className="pb20">已选择</h3>
          <div className={classNames(style.panelWrap, style.tagWrap)}>
            <div className={classNames(style.marketingWarp)}>
              {isArray(value) &&
                (value as any[])?.map((row: any, index) => (
                  <div
                    className={classNames(style.customTag)}
                    key={(row.newsId || row.itemId || row.posterId || row.activityId) + index}
                  >
                    <span>{row.itemName || row.title || row.name || row.activityName}</span>
                    <Icon className={style.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem(index)}></Icon>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
