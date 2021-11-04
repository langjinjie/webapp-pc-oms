import React, { useEffect, useState, useRef, useContext, MutableRefObject, useCallback } from 'react';
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
  // requestSaveSortMarket
} from 'src/apis/SystemSettings';
import { IProductTypeItem, IPosterTypeItem } from 'src/utils/interface';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Icon } from 'src/components';
import { Context } from 'src/store';
import classNames from 'classnames';
import style from './style.module.less';
import { Drag, Drop, DropChild } from 'src/components/drag-and-drop';

export const useDragEnd: (typeList: any, reorder: any) => ({ source, destination, type }: DropResult) => void = (
  typeList,
  reorder
) => {
  // const { data: kanbans } = useKanbans(useKanbanSearchParams());
  // const { mutate: reorderKanban } = useReorderKanban(useKanbanQueryKey());
  // const { mutate: reorderTask } = useReorderTask(useTasksQueryKey());
  // const { data: allTasks = [] } = useTasks(useTasksSearchParams());
  return useCallback(
    ({ source, destination, type }: DropResult) => {
      console.log({ source, destination, type, typeList });
      if (!destination) {
        return;
      }
      if (source.droppableId !== destination.droppableId) {
        return message.warning('不支持跨组拖拽');
      }
      // 看板排序

      if (type === 'COLUMN') {
        const fromKanbanId = +source.droppableId;
        const toKanbanId = +destination.droppableId;
        console.log('111', { type, fromKanbanId, toKanbanId });
        // if (fromKanbanId === toKanbanId) {
        //   return;
        // }
        const fromTask = typeList.filter((task) => task.kanbanId === fromKanbanId)[source.index];
        const toTask = typeList.filter((task) => task.kanbanId === toKanbanId)[destination.index];
        if (fromTask?.id === toTask?.id) {
          return false;
        }
        // reorderTask({
        //   fromId: fromTask?.id,
        //   referenceId: toTask?.id,
        //   fromKanbanId,
        //   toKanbanId,
        //   type: fromKanbanId === toKanbanId && destination.index > source.index ? 'after' : 'before'
        // });
      }
      if (type === 'ROW') {
        const type = destination.index > source.index ? 'after' : 'before';
        reorder(typeList, source.index, destination.index, type);
      }
    },
    [typeList]
  );
};

const categoryManage: React.FC = () => {
  const { isMainCorp } = useContext(Context);
  const [tabIndex, setTabIndex] = useState(0);
  const [editType, setEditType] = useState('');
  const [typeList, setTypeList] = useState<IProductTypeItem[] | IPosterTypeItem[]>([]);
  const [typeName, setTypeName] = useState<IProductTypeItem | IPosterTypeItem>();
  const [modalType, setModalType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addTypeName, setAddTypeName] = useState('');
  const [parentId, setParentId] = useState('0');
  const [isShowChildrenType, setIsShowChildrenType] = useState('');
  const [popconfirmVisible, setPopconfirmVisible] = useState<string>('');
  const [isOnDrag] = useState(-1);
  const [isCancel, setIsCancel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const tabs = ['产品库', '文章库', '海报库'];
  const addInputNode: MutableRefObject<any> = useRef();

  // 获取产品分类列表
  const getProductTypeList = async () => {
    const res = await requestGetProductTypeList();
    res && setTypeList(res.typeList as IProductTypeItem[]);
  };

  // 获取文章分类
  const getArticleTypeList = async () => {
    const res = await requestGetNewTypeList();
    res && setTypeList(res.typeList as IProductTypeItem[]);
  };

  // 获取海报分类
  const getPosterTypeList = async () => {
    const res = await requestGetPosterTypeList();
    res && setTypeList(res.categoryList as IPosterTypeItem[]);
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

  // // 重新记录数组顺序
  const reorder = (list: any, startIndex: number, endIndex: number, type: string) => {
    const result = Array.from(list);
    // 删除并记录 删除元素
    const [removed] = result.splice(startIndex, 1);
    // 将原来的元素添加进数组
    result.splice(endIndex, 0, removed);
    console.log({ result, startIndex, endIndex, type });
    return result;
  };
  const onDragEnd = useDragEnd(typeList, reorder);
  // 拖拽结束
  // const onDragEnd = async (result: any) => {
  //   setIsOnDrag(-1);
  //   if (!isMainCorp && tabIndex !== 0) return message.error('非主机构不能操作');
  //   try {
  //     if (!result.destination) {
  //       return;
  //     }
  //     // 获取拖拽后的数据 重新赋值
  //     const newData = reorder(typeList, result.source.index, result.destination.index);
  //     const otherIndex = newData.findIndex((item: any) => item.name.startsWith('其他'));
  //     const productPosterIndex = newData.findIndex((item: any) => item.name === '产品海报');
  //     if (otherIndex < newData.length - 1) {
  //       getTypeList(tabIndex);
  //       return message.error('其他分类不支持拖动排序');
  //     }
  //     if (productPosterIndex !== -1 && productPosterIndex !== newData.length - 2) {
  //       getTypeList(tabIndex);
  //       return message.error('产品海报分类不支持拖动排序');
  //     }
  //     await setTypeList(newData as IProductTypeItem[] | IPosterTypeItem[]);
  //     const sortTypeIdList = newData.reverse().map((item: any) => item.typeId || item.id);
  //     const res = await requestSaveSortMarket({ type: tabIndex + 1, typeId: sortTypeIdList });
  //     if (res) {
  //       message.success('排序成功');
  //     } else {
  //       message.error('排序失败');
  //     }
  //     getTypeList(tabIndex);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  useEffect(() => {
    getTypeList(tabIndex);
  }, []);
  return (
    <div className={style.wrap}>
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
          <Drop type={'ROW'} droppableId={'kanban'}>
            <DropChild>
              {typeList.map((item, index) => (
                <Drag index={index} draggableId={index + 'draggableId'} key={'draggableId' + index}>
                  <div>
                    <div
                      className={classNames(style.typeItem, { [style.isOnDrag]: isOnDrag === index })}
                      style={
                        editType !== ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                          ? {}
                          : { display: 'none' }
                      }
                    >
                      <div className={style.typeName}>{item.name}</div>
                      <div className={style.operation}>
                        {(isMainCorp || tabIndex === 0) && item.name !== '其他' && item.name !== '产品海报' && (
                          <span
                            data-edit={'edit'}
                            className={style.edit}
                            onClick={async () => {
                              if (!isMainCorp && tabIndex !== 0) return message.error('非主机构不能操作');
                              if (isEditing) return message.error('请先完成上一次编辑');
                              setParentId('0');
                              await setEditType((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id);
                              await setTypeName(item);
                              (document.querySelector('input[type=text]') as HTMLElement).focus();
                            }}
                          >
                            编辑
                          </span>
                        )}
                        {(isMainCorp || tabIndex === 0) && item.name !== '其他' && item.name !== '产品海报' && (
                          <Popconfirm
                            title={'删除分类后,素材将移至"其他"分类下'}
                            visible={
                              popconfirmVisible === ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
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
                                if (!isMainCorp && tabIndex !== 0) return message.error('非主机构不能操作');
                                setPopconfirmVisible((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id);
                              }}
                            >
                              删除
                            </span>
                          </Popconfirm>
                        )}
                        {item.name !== '其他' && item.categoryList && (
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
                          setTypeName({ ...typeName, name: e.target.value.trim() });
                          if (e.target.value.trim() !== item.name) {
                            setIsEditing(true);
                          }
                        }}
                        onKeyDown={async (e) => {
                          const inputNode = document.querySelector('input[type=text]') as HTMLElement;
                          if (e.keyCode === 13) {
                            if (typeName && typeName?.name.trim().length > 12) {
                              return message.error('最多12个字符,不区分中英文');
                            }
                            if (!typeName?.name) return message.error('分类名称不能为空');
                            if (typeName?.name === item.name) return message.error('该分类名称已存在,请重新输入');
                            inputNode.blur();
                            setIsEditing(false);
                          } else if (e.keyCode === 27) {
                            setIsEditing(false);
                            setIsCancel(true);
                            setEditType('');
                          }
                        }}
                        onBlur={async () => {
                          if (editType !== ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)) {
                            return;
                          }
                          if (typeName && typeName?.name.trim().length > 12) {
                            message.error('最多12个字符,不区分中英文');
                            (document.querySelector('input[type=text]') as HTMLElement).focus();
                            return;
                          }
                          if (isCancel) {
                            setIsCancel(false);
                            setIsEditing(false);
                            return setEditType('');
                          }
                          if (!typeName?.name) {
                            (document.querySelector('input[type=text]') as HTMLElement).focus();
                            return message.error('分类名称不能为空');
                          }
                          if (typeName?.name === item.name) {
                            setIsEditing(false);
                            return setEditType('');
                          }
                          const res = await modifyTypeName(tabIndex, { ...typeName, parentId });
                          if (res) {
                            await getTypeList(tabIndex);
                            await setTypeName(undefined);
                            message.success('一级分类修改成功');
                          }
                          setIsEditing(false);
                          setEditType('');
                        }}
                      />
                      {typeName && (
                        <span
                          data-edit={'edit'}
                          className={style.icon}
                          onClick={() => {
                            setTypeName({ ...typeName, name: '' });
                            setIsEditing(true);
                            const inputNode: HTMLElement = document.querySelector('input[type=text]') as HTMLElement;
                            inputNode.focus();
                          }}
                        />
                      )}
                      {typeName && typeName?.name.length > 12 && (
                        <span className={style.check}>{'最多12个字符,不区分中英文'}</span>
                      )}
                    </div>

                    {!!item.categoryList?.length && (
                      <div className={style.childrenWrap}>
                        <Drop type={'COLUMN'} direction={'vertical'} droppableId={String('kanbank' + index)}>
                          <DropChild>
                            {item.categoryList?.map((childrenItem: any, childIndex) => (
                              <Drag
                                key={(childrenItem as IProductTypeItem).typeId || (childrenItem as IPosterTypeItem).id}
                                index={childIndex}
                                draggableId={String(childrenItem.id)}
                              >
                                <div
                                  className={classNames(style.childrenItemWrap, {
                                    [style.active]:
                                      typeName &&
                                      // @ts-ignore
                                      (childrenItem.typeId || childrenItem.id) === (typeName.typeId || typeName.id)
                                  })}
                                >
                                  <div
                                    className={style.childrenItem}
                                    style={
                                      editType ===
                                      ((childrenItem as IProductTypeItem).typeId ||
                                        (childrenItem as IPosterTypeItem).id)
                                        ? { display: 'none' }
                                        : {}
                                    }
                                  >
                                    {childrenItem.name}
                                    <div className={style.childrenOperation}>
                                      {item.name !== '产品海报' && (isMainCorp || tabIndex === 0) && (
                                        <span
                                          data-edit={'edit'}
                                          onClick={async () => {
                                            if (!isMainCorp && tabIndex !== 0) return message.error('非主机构不能操作');
                                            if (isEditing) return message.error('请先完成上一次编辑');
                                            setParentId(
                                              (item as IProductTypeItem).typeId || (item as IPosterTypeItem).id
                                            );
                                            await setEditType('');
                                            setTypeName(childrenItem);
                                            setEditType(
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
                                      )}

                                      <Popconfirm
                                        title={'删除分类后,素材将移至"其他"分类下'}
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
                                        {item.name !== '产品海报' && (isMainCorp || tabIndex === 0) && (
                                          <span
                                            onClick={() => {
                                              if (!isMainCorp && tabIndex !== 0) {
                                                return message.error('非主机构不能操作');
                                              }
                                              setPopconfirmVisible(
                                                (childrenItem as IProductTypeItem).typeId ||
                                                  (childrenItem as IPosterTypeItem).id
                                              );
                                            }}
                                          >
                                            删除
                                          </span>
                                        )}
                                      </Popconfirm>
                                    </div>
                                  </div>
                                  <div
                                    className={style.inputChildrenItem}
                                    style={
                                      editType ===
                                      ((childrenItem as IProductTypeItem).typeId ||
                                        (childrenItem as IPosterTypeItem).id)
                                        ? {}
                                        : { display: 'none' }
                                    }
                                  >
                                    <input
                                      data-edit={'edit'}
                                      type={
                                        editType ===
                                        ((childrenItem as IProductTypeItem).typeId ||
                                          (childrenItem as IPosterTypeItem).id)
                                          ? 'text'
                                          : 'none'
                                      }
                                      value={typeName ? typeName?.name : ''}
                                      onChange={(e) => {
                                        // @ts-ignore
                                        setTypeName({ ...typeName, name: e.target.value.trim() });
                                        if (e.target.value.trim() !== childrenItem.name) {
                                          setIsEditing(true);
                                        }
                                      }}
                                      onKeyDown={async (e) => {
                                        const inputNode = document.querySelector('input[type=text]') as HTMLElement;
                                        if (e.keyCode === 13) {
                                          if (typeName && typeName.name.trim().length > 12) {
                                            return message.error('最多12个字符,不区分中英文');
                                          }
                                          if (!typeName?.name) return message.error('分类名称不能为空');
                                          if (typeName?.name === childrenItem.name) {
                                            return message.error('该分类名称已存在,请重新输入');
                                          }
                                          inputNode.blur();
                                          setIsEditing(false);
                                        } else if (e.keyCode === 27) {
                                          setIsCancel(true);
                                          setIsEditing(false);
                                          setEditType('');
                                        }
                                      }}
                                      onBlur={async () => {
                                        if (
                                          editType &&
                                          editType !==
                                            ((childrenItem as IProductTypeItem).typeId ||
                                              (childrenItem as IPosterTypeItem).id)
                                        ) {
                                          return;
                                        }
                                        if (typeName) {
                                          if (typeName && typeName.name.trim().length > 12) {
                                            message.error('最多12个字符,不区分中英文');
                                            (document.querySelector('input[type=text]') as HTMLElement).focus();
                                            return;
                                          }
                                        }
                                        if (isCancel) {
                                          setIsCancel(false);
                                          setIsEditing(false);
                                          setTypeName(undefined);
                                          return setEditType('');
                                        }
                                        if (!typeName?.name) {
                                          (document.querySelector('input[type=text]') as HTMLElement).focus();
                                          return message.error('分类名称不能为空');
                                        }
                                        if (typeName?.name === childrenItem.name) {
                                          setTypeName(undefined);
                                          setIsEditing(false);
                                          return setEditType('');
                                        }
                                        const res = await modifyTypeName(tabIndex, { ...typeName, parentId });
                                        if (res) {
                                          await getTypeList(tabIndex);
                                          await setTypeName(undefined);
                                          message.success('二级分类修改成功');
                                        }
                                        setIsEditing(false);
                                        setEditType('');
                                      }}
                                    />
                                    {typeName && (
                                      <span
                                        data-edit={'edit'}
                                        className={style.icon}
                                        onClick={() => {
                                          console.log('清空了');
                                          setTypeName({ ...typeName, name: '' });
                                          setIsEditing(true);
                                          const inputNode: HTMLElement = document.querySelector(
                                            'input[type=text]'
                                          ) as HTMLElement;
                                          inputNode.focus();
                                        }}
                                      />
                                    )}
                                    {typeName && typeName?.name.length > 12 && (
                                      <span className={style.check}>{'最多12个字符,不区分中英文'}</span>
                                    )}
                                  </div>
                                </div>
                              </Drag>
                            ))}
                          </DropChild>
                        </Drop>
                      </div>
                    )}
                    {item.name !== '产品海报' && (isMainCorp || tabIndex === 0) && (
                      <Button
                        className={classNames(style.addChilrenType, {
                          [style.active]: !item.categoryList?.length
                        })}
                        icon={<Icon className={style.icon} name="icon_daohang_28_jiahaoyou" />}
                        type={'primary'}
                        onClick={async () => {
                          if (!typeName?.name && isEditing) return message.error('请先完成上一次编辑');
                          if (item.categoryList && item.categoryList.length >= 20) {
                            return message.error('分类总数不得超过20个');
                          }
                          setParentId((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id);
                          await setIsModalVisible(true);
                          setModalType('新增分类');
                          addInputNode.current.focus();
                        }}
                      >
                        新增
                      </Button>
                    )}
                  </div>
                </Drag>
              ))}
            </DropChild>
          </Drop>
        </DragDropContext>
      </div>

      {(isMainCorp || tabIndex === 0) && (
        <Button
          className={style.addType}
          icon={<Icon className={style.icon} name="icon_daohang_28_jiahaoyou" />}
          type={'primary'}
          onClick={async () => {
            if (!typeName?.name && isEditing) return message.error('请先完成上一次编辑');
            if (typeList.length >= 20) return message.error('分类总数不得超过20个');
            setParentId('0');
            await setIsModalVisible(true);
            setModalType('新增分类');
            addInputNode.current.focus();
          }}
        >
          新增
        </Button>
      )}
      <Modal
        wrapClassName={style.modalWrap}
        title={modalType}
        closeIcon={<span />}
        visible={isModalVisible}
        centered
        width={480}
        okText={'确认'}
        okButtonProps={{ disabled: addTypeName.length > 12 }}
        onCancel={() => setIsModalVisible(false)}
        onOk={async () => {
          if (!addTypeName) return message.error('请输入有效的分类名称');
          const res = await modifyTypeName(tabIndex, { parentId, name: addTypeName });
          if (res) {
            await getTypeList(tabIndex);
            message.success('添加成功');
            setIsModalVisible(false);
            setAddTypeName('');
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
            placeholder="请输入分类名称"
            onChange={(e) => {
              setAddTypeName(e.target.value.trim());
            }}
            onKeyDown={async (e) => {
              if (e.keyCode === 13) {
                if (addTypeName.trim().length > 12) {
                  return message.error('最多12个字符,不区分中英文');
                }
                if (!addTypeName) return message.error('请输入有效的分类名称');
                const res = await modifyTypeName(tabIndex, { parentId, name: addTypeName });
                if (res) {
                  await getTypeList(tabIndex);
                  message.success('添加成功');
                  setIsModalVisible(false);
                  setAddTypeName('');
                }
              }
            }}
          />
          {addTypeName.length > 12 && <span className={style.check}>{'最多12个字符,不区分中英文'}</span>}
        </div>
      </Modal>
    </div>
  );
};
export default categoryManage;
