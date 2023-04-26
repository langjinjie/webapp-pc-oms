import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import classNames from 'classnames';
import { isArray } from 'src/utils/tools';
import { Icon } from 'tenacity-ui';
import { ArticleSelectComponent } from './ArticleSelectComponent';
import { PosterSelectComponent } from './PosterSelectComponent';
import { ProductSelectComponent } from './ProductSelectComponent';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Drag, Drop, DropChild } from 'src/components/drag-and-drop';
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

  // 列表选择时数据处理
  const handleChange = (keys: React.Key[], rows: any[]) => {
    // 针对海报选中未加载的数据进行过滤重组处理

    const res = rows.filter((row) => row.itemId !== undefined);
    const filterKeys = keys.filter((key) => !res.map((item) => item.itemId).includes(key));

    const filterRows = selectRows.filter((item) => filterKeys.includes(item.itemId!));
    setSelectRows([...res, ...filterRows]);
    onChange?.([...res, ...filterRows]);
    setSelectedRowKeys(keys);
  };

  // 重新记录数组顺序
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = [...list];
    // 删除并记录 删除元素
    const [removed] = result.splice(startIndex, 1);
    // 将原来的元素添加进数组
    result.splice(endIndex, 0, removed);
    return result;
  };

  // 拖拽结束
  const onDragEnd = async ({ source, destination }: DropResult) => {
    destination && onChange?.(reorder(value as any[], source.index, destination.index));
  };

  useEffect(() => {
    if (value) {
      const keys = (isArray(value) && (value as any[])?.map((item: any) => item.itemId)) || [];
      setSelectedRowKeys(keys);
      if (isArray(value)) {
        setSelectRows(value as any[]);
      }
    }
  }, [value]);

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
              {isArray(value) && (
                <DragDropContext onDragEnd={onDragEnd}>
                  {/* direction代表拖拽方向  默认垂直方向  水平方向:horizontal */}
                  <Drop type={'ROW'} droppableId={'kanban'}>
                    <DropChild>
                      {(value as any[])?.map((row: any, index) => (
                        <Drag index={index} draggableId={index + 'draggableId'} key={'draggableId' + index}>
                          <div className={classNames(style.customTag)} key={row.itemId + index}>
                            <span>{row.itemName}</span>
                            <Icon
                              className={style.closeIcon}
                              name="biaoqian_quxiao"
                              onClick={() => removeItem(index)}
                            ></Icon>
                          </div>
                        </Drag>
                      ))}
                    </DropChild>
                  </Drop>
                </DragDropContext>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
