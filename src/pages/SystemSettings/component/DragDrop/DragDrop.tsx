import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface IDragDropProps {
  data: any;
  setData: (param: any) => void;
}

const DragDrop: React.FC<IDragDropProps> = ({ data, setData, children }) => {
  // 重新记录数组顺序
  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    // 删除并记录 删除元素
    const [removed] = result.splice(startIndex, 1);
    // 将原来的元素添加进数组
    result.splice(endIndex, 0, removed);
    return result;
  };
  // 拖拽结束
  const onDragEnd = (result: any) => {
    try {
      if (!result.destination) {
        return;
      }
      // 获取拖拽后的数据 重新赋值
      const newData = reorder(data, result.source.index, result.destination.index);

      setData(newData);
      console.log(newData);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* direction代表拖拽方向  默认垂直方向  水平方向:horizontal */}
        <Droppable droppableId="droppable">
          {(provided: any) => (
            // 这里是拖拽容器 在这里设置容器的宽高等等...
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {/* 这里放置所需要拖拽的组件,必须要被 Draggable 包裹 */}
              {data.map((item: any, index: number) => {
                return (
                  <Draggable index={index} draggableId={index + 'draggableId'} key={index}>
                    {(provided: any) => (
                      // 在这里写你的拖拽组件的样式 dom 等等...
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={index}
                      >
                        {children}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {/* 这个不能少 */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
export default DragDrop;
