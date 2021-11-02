import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { Button, Modal, message, Popconfirm } from 'antd';
import {
  requestGetProductTypeList,
  requestSaveProducType,
  requestDeleteProductType,
  requestGetNewTypeList,
  requestSaveNewType,
  requestDeleteNewType,
  requestGetPosterTypeList,
  requestSavePosterType,
  requestDeletePosterType
} from 'src/apis/SystemSettings';
import { IProductTypeItem, IPosterTypeItem } from 'src/utils/interface';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classNames from 'classnames';
import style from './style.module.less';
import { Icon } from 'src/components';

const categoryManage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [editType, setEditType] = useState('');
  const [childrenEditType, setChildrenEditType] = useState('');
  const [typeList, setTypeList] = useState<IProductTypeItem[] | IPosterTypeItem[]>([]);
  const [typeName, setTypeName] = useState<IProductTypeItem | IPosterTypeItem>();
  const [modalType, setModalType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addTypeName, setAddTypeName] = useState('');
  const [parentId, setParentId] = useState('0');
  const [isShowChildrenType, setIsShowChildrenType] = useState('');
  const [popconfirmVisible, setPopconfirmVisible] = useState<string>('');

  const tabs = ['产品库', '文章库', '海报库', '活动库'];
  const addInputNode: MutableRefObject<any> = useRef();

  // 获取产品分类列表
  const getProductTypeList = async () => {
    const res = await requestGetProductTypeList();

    res && setTypeList(res.typeList as IProductTypeItem[]);
  };

  // 获取文章分类
  const getArticleTypeList = async () => {
    const res = await requestGetNewTypeList();
    setTypeList(res.typeList as IProductTypeItem[]);
  };

  // 获取海报分类
  const getPosterTypeList = async () => {
    const res = await requestGetPosterTypeList();
    setTypeList(res.categoryList as IPosterTypeItem[]);
  };

  // 获取分类列表
  const getTypeList = async (index: number) => {
    switch (index) {
      case 0:
        await getProductTypeList();
        break;
      case 1:
        await getArticleTypeList();
        break;
      case 2:
        await getPosterTypeList();
        break;
      case 3:
        await setTypeList([]);
        break;

      default:
        await setTypeList([]);
        break;
    }
  };

  // 添加/修改分类名称
  const modifyTypeName = async (index: number, param: object) => {
    let res: any;
    switch (index) {
      case 0:
        res = await requestSaveProducType(param);
        break;
      case 1:
        res = await requestSaveNewType(param);
        break;
      case 2:
        res = await requestSavePosterType(param);
        break;
      default:
        break;
    }
    return res;
  };

  // 删除分类
  const deleteTypeName = async (index: number, id: string) => {
    let res: any;
    switch (index) {
      case 0:
        res = await requestDeleteProductType({ typeId: id });
        break;
      case 1:
        res = await requestDeleteNewType({ typeId: id });
        break;
      case 2:
        res = await requestDeletePosterType({ id });
        break;
      default:
        break;
    }
    return res;
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
    try {
      if (!result.destination) {
        return;
      }
      // 获取拖拽后的数据 重新赋值
      const newData = reorder(typeList, result.source.index, result.destination.index);
      setTypeList(newData as IProductTypeItem[] | IPosterTypeItem[]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getTypeList(tabIndex);
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
              getTypeList(index);
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <div className={style.content}>
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
                          key={(item as IProductTypeItem).typeId || (item as IPosterTypeItem).id + index}
                          className={classNames(style.typeItemWrap, {
                            [style.active]:
                              isShowChildrenType ===
                              ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                          })}
                        >
                          <div
                            className={style.typeItem}
                            style={
                              editType !== ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                                ? {}
                                : { display: 'none' }
                            }
                          >
                            <div className={style.typeName}>{item.name}</div>
                            <div className={style.operation}>
                              {item.name !== '其他' && (
                                <span
                                  data-edit={'edit'}
                                  className={style.edit}
                                  onClick={async () => {
                                    setParentId('0');
                                    console.log('0');
                                    setChildrenEditType('');
                                    await setEditType(
                                      (item as IProductTypeItem).typeId || (item as IPosterTypeItem).id
                                    );
                                    await setTypeName(item);
                                    const inputNode: HTMLElement = document.querySelector(
                                      'input[type=text]'
                                    ) as HTMLElement;
                                    console.log(inputNode);
                                    inputNode.focus();
                                  }}
                                >
                                  编辑
                                </span>
                              )}
                              {item.name !== '其他' && (
                                <Popconfirm
                                  title={'确认删除该分类吗?'}
                                  visible={
                                    popconfirmVisible ===
                                    ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                                  }
                                  onConfirm={async () => {
                                    const res = await deleteTypeName(
                                      tabIndex,
                                      (item as IProductTypeItem).typeId || (item as IPosterTypeItem).id
                                    );
                                    if (res) {
                                      setPopconfirmVisible('');
                                      getTypeList(tabIndex);
                                      message.success('删除成功');
                                    } else {
                                      message.error('删除失败');
                                    }
                                  }}
                                  onCancel={() => setPopconfirmVisible('')}
                                >
                                  <span
                                    className={style.delete}
                                    onClick={() => {
                                      setPopconfirmVisible(
                                        (item as IProductTypeItem).typeId || (item as IPosterTypeItem).id
                                      );
                                    }}
                                  >
                                    删除
                                  </span>
                                </Popconfirm>
                              )}
                              {!!item.categoryList?.length && (
                                <span
                                  className={style.more}
                                  onClick={() => {
                                    setIsShowChildrenType(
                                      isShowChildrenType ===
                                        ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                                        ? ''
                                        : (item as IProductTypeItem).typeId || (item as IPosterTypeItem).id
                                    );
                                  }}
                                >
                                  <Icon
                                    name={
                                      isShowChildrenType ===
                                      ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                                        ? 'icon_common_16_Line_Down'
                                        : 'shangjiantou'
                                    }
                                  />
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            className={style.inputTypeItem}
                            style={
                              editType !== ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                                ? { display: 'none' }
                                : {}
                            }
                          >
                            <input
                              data-edit={'edit'}
                              type={
                                editType !== ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                                  ? 'none'
                                  : 'text'
                              }
                              value={typeName ? typeName?.name : ''}
                              onChange={(e) => {
                                // @ts-ignore
                                setTypeName({ ...typeName, name: e.target.value });
                              }}
                              onKeyDown={async (e) => {
                                if (typeName?.name === item.name) return;
                                if (e.keyCode === 13) {
                                  const res = await modifyTypeName(tabIndex, { ...typeName, parentId });
                                  if (res) {
                                    await getTypeList(tabIndex);
                                    await setTypeName(undefined);
                                    setEditType('');
                                    message.success('修改成功');
                                  } else {
                                    message.error('修改失败');
                                  }
                                }
                              }}
                            />
                            {typeName && (
                              <span
                                data-edit={'edit'}
                                className={style.icon}
                                onClick={() => {
                                  setTypeName(undefined);
                                  const inputNode: HTMLElement = document.querySelector(
                                    'input[type=text]'
                                  ) as HTMLElement;
                                  inputNode.focus();
                                }}
                              />
                            )}
                          </div>
                          {!!item.categoryList?.length && (
                            <>
                              <div className={style.childrenWrap}>
                                {item.categoryList?.map((childrenItem) => (
                                  <div
                                    key={
                                      (childrenItem as IProductTypeItem).typeId || (childrenItem as IPosterTypeItem).id
                                    }
                                    className={style.childrenItemWrap}
                                  >
                                    <div
                                      className={style.childrenItem}
                                      style={
                                        childrenEditType ===
                                        ((childrenItem as IProductTypeItem).typeId ||
                                          (childrenItem as IPosterTypeItem).id)
                                          ? { display: 'none' }
                                          : {}
                                      }
                                    >
                                      {childrenItem.name}
                                      <div className={style.childrenOperation}>
                                        <span
                                          data-edit={'edit'}
                                          onClick={async () => {
                                            setParentId(
                                              (item as IProductTypeItem).typeId || (item as IPosterTypeItem).id
                                            );
                                            setEditType('');
                                            await setTypeName(childrenItem);
                                            setChildrenEditType(
                                              (childrenItem as IProductTypeItem).typeId ||
                                                (childrenItem as IPosterTypeItem).id
                                            );
                                            const inputNode: HTMLElement = document.querySelector(
                                              'input[type=text]'
                                            ) as HTMLElement;
                                            inputNode.focus();
                                          }}
                                        >
                                          编辑
                                        </span>

                                        <Popconfirm
                                          title={'确认删除该分类吗?'}
                                          visible={
                                            popconfirmVisible ===
                                            ((childrenItem as IProductTypeItem).typeId ||
                                              (childrenItem as IPosterTypeItem).id)
                                          }
                                          onConfirm={async () => {
                                            const res = await deleteTypeName(
                                              tabIndex,
                                              (childrenItem as IProductTypeItem).typeId ||
                                                (childrenItem as IPosterTypeItem).id
                                            );
                                            if (res) {
                                              setPopconfirmVisible('');
                                              getTypeList(tabIndex);
                                              message.success('删除成功');
                                            } else {
                                              message.error('删除失败');
                                            }
                                          }}
                                          onCancel={() => setPopconfirmVisible('')}
                                        >
                                          <span
                                            onClick={() => {
                                              console.log('即将删除');
                                              setPopconfirmVisible(
                                                (childrenItem as IProductTypeItem).typeId ||
                                                  (childrenItem as IPosterTypeItem).id
                                              );
                                            }}
                                          >
                                            删除
                                          </span>
                                        </Popconfirm>
                                      </div>
                                    </div>
                                    <div
                                      className={style.inputChildrenItem}
                                      style={
                                        childrenEditType ===
                                        ((childrenItem as IProductTypeItem).typeId ||
                                          (childrenItem as IPosterTypeItem).id)
                                          ? {}
                                          : { display: 'none' }
                                      }
                                    >
                                      <input
                                        data-edit={'edit'}
                                        type={
                                          childrenEditType ===
                                          ((childrenItem as IProductTypeItem).typeId ||
                                            (childrenItem as IPosterTypeItem).id)
                                            ? 'text'
                                            : 'none'
                                        }
                                        value={typeName ? typeName?.name : ''}
                                        onChange={(e) => {
                                          // @ts-ignore
                                          setTypeName({ ...typeName, name: e.target.value });
                                        }}
                                        onKeyDown={async (e) => {
                                          if (typeName?.name === childrenItem.name) return;
                                          if (e.keyCode === 13) {
                                            const res = await modifyTypeName(tabIndex, { ...typeName, parentId });
                                            if (res) {
                                              await getTypeList(tabIndex);
                                              await setTypeName(undefined);
                                              setChildrenEditType('');
                                              message.success('修改成功');
                                            } else {
                                              message.error('修改失败');
                                            }
                                          }
                                        }}
                                      />
                                      {typeName && (
                                        <span
                                          data-edit={'edit'}
                                          className={style.icon}
                                          onClick={() => {
                                            setTypeName(undefined);
                                            const inputNode: HTMLElement = document.querySelector(
                                              'input[type=text]'
                                            ) as HTMLElement;
                                            inputNode.focus();
                                          }}
                                        />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <Button
                                className={style.addChilrenType}
                                icon={<Icon className={style.icon} name="icon_daohang_28_jiahaoyou" />}
                                type={'primary'}
                                onClick={async () => {
                                  setParentId((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id);
                                  await setIsModalVisible(true);
                                  setModalType('新增分类');
                                  console.log(addInputNode);
                                  addInputNode.current.focus();
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
        onClick={async () => {
          setParentId('0');
          await setIsModalVisible(true);
          setModalType('新增分类');
          addInputNode.current.focus();
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
        onOk={async () => {
          if (!addTypeName) return;
          const res = await modifyTypeName(tabIndex, { parentId, name: addTypeName });
          if (res) {
            await getTypeList(tabIndex);
            message.success('添加成功');
            setIsModalVisible(false);
            setAddTypeName('');
          } else {
            message.error('添加失败');
          }
        }}
      >
        <div className={style.modalContent}>
          <p className={style.content}>请输入分类名称</p>
          <input
            ref={addInputNode}
            className={style.addTypeName}
            value={addTypeName}
            type="text"
            placeholder="待输入"
            onChange={(e) => setAddTypeName(e.target.value)}
            onKeyDown={async (e) => {
              if (e.keyCode === 13) {
                if (!addTypeName) return;
                const res = await modifyTypeName(tabIndex, { parentId, name: addTypeName });
                if (res) {
                  await getTypeList(tabIndex);
                  message.success('添加成功');
                  setIsModalVisible(false);
                  setAddTypeName('');
                } else {
                  message.error('添加失败');
                }
              }
            }}
          />
        </div>
      </Modal>
    </div>
  );
};
export default categoryManage;
