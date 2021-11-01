import React, { useEffect, useState, MutableRefObject, useRef } from 'react';
import { Button, Modal } from 'antd';
import { requestGetProductTypeList, requestGetNewTypeList, requestGetPosterTypeList } from 'src/apis/SystemSettings';
import { IProductTypeItem } from 'src/utils/interface';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import style from './style.module.less';
import { Icon } from 'src/components';

const categoryManage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [childrenTabIndex, setChildrenTabIndex] = useState(0);
  const [editType, setEditType] = useState('');
  const [childrenEditType, setChildrenEditType] = useState('');
  const [typeList, setTypeList] = useState<IProductTypeItem[]>([]);
  const [typeName, setTypeName] = useState('');
  const [modalType, setModalType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addTypeName, setAddTypeName] = useState('');
  const [isShowChildrenType, setIsShowChildrenType] = useState('');

  const tabs = ['产品库', '文章库', '海报库', '活动库'];
  const typeWrap: MutableRefObject<any> = useRef();

  // 获取产品分类列表
  const getProductTypeList = async () => {
    const res = await requestGetProductTypeList();

    res && setTypeList(res.typeList);
  };

  // 获取文章分类
  const getArticleTypeList = async () => {
    const res = await requestGetNewTypeList();
    setTypeList(res.typeList);
  };

  // 获取海报分类
  const getPosterTypeList = async () => {
    const res = await requestGetPosterTypeList();
    console.log(res);
    setTypeList(res.categoryList);
  };
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
    console.log(childrenTabIndex);
    console.log(result);
    try {
      if (!result.destination) {
        return;
      }
      if (result.type === 'app') {
        // 获取拖拽后的数据 重新赋值
        const newData = reorder(typeList, result.source.index, result.destination.index);
        setTypeList(newData as IProductTypeItem[]);
      } else {
        const newData = reorder(typeList[childrenTabIndex].children, result.source.index, result.destination.index);
        const newTypeList: IProductTypeItem[] = typeList;
        newTypeList[childrenTabIndex].children = newData as IProductTypeItem[];
        console.log(newData);
        console.log(newTypeList[childrenTabIndex].children);
        setTypeList(newTypeList);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getProductTypeList();
  }, []);
  return (
    <div
      className={style.wrap}
      onClick={(e) => {
        // @ts-ignore
        if (e.target.dataset.edit === 'edit') return;
        setEditType('');
        setChildrenEditType('');
      }}
    >
      <div className={style.tabsWrap}>
        {tabs.map((item, index) => (
          <span
            key={item}
            className={classNames(style.tabItem, { [style.active]: index === tabIndex })}
            onClick={() => {
              setTabIndex(index);
              switch (index) {
                case 0:
                  getProductTypeList();
                  break;
                case 1:
                  getArticleTypeList();
                  break;
                case 2:
                  getPosterTypeList();
                  break;
                case 3:
                  setTypeList([]);
                  break;

                default:
                  break;
              }
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <div className={style.content} ref={typeWrap}>
        <DragDropContext onDragEnd={onDragEnd}>
          {/* direction代表拖拽方向  默认垂直方向  水平方向:horizontal */}
          <Droppable droppableId="droppable" type="app">
            {(provided: any) => (
              // 这里是拖拽容器 在这里设置容器的宽高等等...
              // <div {...provided.droppableProps} ref={provided.innerRef}>
              <div ref={provided.innerRef}>
                {/* 这里放置所需要拖拽的组件,必须要被 Draggable 包裹 */}
                {typeList.map((item, index) => {
                  return (
                    <Draggable index={index} draggableId={index + 'draggableId'} key={'draggableId' + index}>
                      {(provided: any) => (
                        // 在这里写你的拖拽组件的样式 dom 等等...
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          key={item.typeId + index}
                          className={classNames(style.typeItemWrap, {
                            [style.active]: isShowChildrenType === item.typeId
                          })}
                        >
                          <div className={style.typeItem} style={editType !== item.typeId ? {} : { display: 'none' }}>
                            <div className={style.typeName}>{item.name}</div>
                            <div className={style.operation}>
                              {item.name !== '其他' && (
                                <span
                                  data-edit={'edit'}
                                  className={style.edit}
                                  onClick={async () => {
                                    setChildrenEditType('');
                                    await setEditType(item.typeId);
                                    typeWrap.current.children[index].children[1].children[0].focus();
                                    setTypeName(item.name);
                                  }}
                                >
                                  编辑
                                </span>
                              )}
                              {item.name !== '其他' && <span className={style.delete}>删除</span>}
                              {item.children && (
                                <span
                                  className={style.more}
                                  onClick={() => {
                                    setIsShowChildrenType(isShowChildrenType === item.typeId ? '' : item.typeId);
                                    setChildrenTabIndex(index);
                                  }}
                                >
                                  <Icon
                                    name={
                                      isShowChildrenType === item.typeId ? 'icon_common_16_Line_Down' : 'shangjiantou'
                                    }
                                  />
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            className={style.inputTypeItem}
                            style={editType !== item.typeId ? { display: 'none' } : {}}
                          >
                            <input
                              data-edit={'edit'}
                              type="text"
                              value={typeName}
                              onChange={(e) => setTypeName(e.target.value)}
                            />
                            {typeName && (
                              <span
                                data-edit={'edit'}
                                className={style.icon}
                                onClick={() => {
                                  setTypeName('');
                                  typeWrap.current.children[index].children[1].children[0].focus();
                                }}
                              />
                            )}
                          </div>
                          {item.children && (
                            <>
                              {/* <DragDropContext onDragEnd={onDragEnd}> */}
                              {/* direction代表拖拽方向  默认垂直方向  水平方向:horizontal */}
                              <Droppable droppableId={item.typeId + ''} type={item.typeId}>
                                {(provided: any) => (
                                  // 这里是拖拽容器 在这里设置容器的宽高等等...
                                  // <div {...provided.droppableProps} ref={provided.innerRef}>
                                  <div ref={provided.innerRef}>
                                    {/* 这里放置所需要拖拽的组件,必须要被 Draggable 包裹 */}
                                    <div className={style.childrenWrap}>
                                      {item.children?.map((childrenItem, childrenIndex) => (
                                        <Draggable
                                          key={childrenItem.typeId}
                                          draggableId={childrenItem.typeId + ''}
                                          index={index}
                                        >
                                          {(provided: any) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              key={childrenItem.typeId}
                                              className={style.childrenItemWrap}
                                            >
                                              <div
                                                className={style.childrenItem}
                                                style={
                                                  childrenEditType === childrenItem.typeId ? { display: 'none' } : {}
                                                }
                                              >
                                                {childrenItem.name}
                                                <div className={style.childrenOperation}>
                                                  <span
                                                    data-edit={'edit'}
                                                    onClick={async () => {
                                                      setEditType('');
                                                      await setTypeName(childrenItem.name);
                                                      setChildrenEditType(childrenItem.typeId);
                                                      typeWrap.current.children[index].children[2].children[
                                                        childrenIndex
                                                      ].children[1].children[0].focus();
                                                    }}
                                                  >
                                                    编辑
                                                  </span>
                                                  <span>删除</span>
                                                </div>
                                              </div>
                                              <div
                                                className={style.inputChildrenItem}
                                                style={
                                                  childrenEditType === childrenItem.typeId ? {} : { display: 'none' }
                                                }
                                              >
                                                <input
                                                  data-edit={'edit'}
                                                  type="text"
                                                  value={typeName}
                                                  onChange={(e) => setTypeName(e.target.value)}
                                                />
                                                {typeName && (
                                                  <span
                                                    data-edit={'edit'}
                                                    className={style.icon}
                                                    onClick={() => {
                                                      setTypeName('');
                                                      typeWrap.current.children[index].children[2].children[
                                                        childrenIndex
                                                      ].children[1].children[0].focus();
                                                    }}
                                                  />
                                                )}
                                              </div>
                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                    </div>
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                              {/* </DragDropContext> */}
                              <Button
                                className={style.addChilrenType}
                                icon={<Icon className={style.icon} name="icon_daohang_28_jiahaoyou" />}
                                type={'primary'}
                                onClick={() => {
                                  setIsModalVisible(true);
                                  setModalType('新增分类');
                                }}
                              >
                                新增
                              </Button>
                            </>
                          )}
                          {provided.placeholder}
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

      <Button
        className={style.addType}
        icon={<Icon className={style.icon} name="icon_daohang_28_jiahaoyou" />}
        type={'primary'}
        onClick={() => {
          setIsModalVisible(true);
          setModalType('新增分类');
        }}
      >
        新增
      </Button>
      <Modal
        wrapClassName={style.modalWrap}
        title={modalType}
        closeIcon={<span />}
        visible={isModalVisible}
        centered
        width={480}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          setIsModalVisible(false);
        }}
      >
        <div className={style.modalContent}>
          <p className={style.content}>请输入分类名称</p>
          <input
            className={style.addTypeName}
            value={addTypeName}
            type="text"
            placeholder="待输入"
            onChange={(e) => setAddTypeName(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
export default categoryManage;
