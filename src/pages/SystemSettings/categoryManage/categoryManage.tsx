import React, { useEffect, useState, useRef, useContext, MutableRefObject } from 'react';
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
  requestDeletePosterType,
  requestSaveSortMarket
} from 'src/apis/SystemSettings';
import { IProductTypeItem, IPosterTypeItem } from 'src/utils/interface';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Icon } from 'src/components';
import { Context } from 'src/store';
import classNames from 'classnames';
import style from './style.module.less';

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
  const [isOnDrag, setIsOnDrag] = useState(-1);
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

  // 重新记录数组顺序
  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    // 删除并记录 删除元素
    const [removed] = result.splice(startIndex, 1);
    // 将原来的元素添加进数组
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragStart = (result: any) => setIsOnDrag(+result.draggableId.split('draggableId')[0]);
  // 拖拽结束
  const onDragEnd = async (result: any) => {
    setIsOnDrag(-1);
    if (!isMainCorp && tabIndex !== 0) return message.error('非主机构不能操作');
    try {
      if (!result.destination) {
        return;
      }
      // 获取拖拽后的数据 重新赋值
      const newData = reorder(typeList, result.source.index, result.destination.index);
      const otherIndex = newData.findIndex((item: any) => item.name.startsWith('其他'));
      const productPosterIndex = newData.findIndex((item: any) => item.name === '产品海报');
      if (otherIndex < newData.length - 1) {
        getTypeList(tabIndex);
        return message.error('其他分类不支持拖动排序');
      }
      if (productPosterIndex !== -1 && productPosterIndex !== newData.length - 2) {
        getTypeList(tabIndex);
        return message.error('产品海报分类不支持拖动排序');
      }
      await setTypeList(newData as IProductTypeItem[] | IPosterTypeItem[]);
      const sortTypeIdList = newData.reverse().map((item: any) => item.typeId || item.id);
      const res = await requestSaveSortMarket({ type: tabIndex + 1, typeId: sortTypeIdList });
      if (res) {
        message.success('排序成功');
      } else {
        message.error('排序失败');
      }
      getTypeList(tabIndex);
    } catch (err) {
      console.error(err);
    }
  };
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
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
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
                                    await setEditType(
                                      (item as IProductTypeItem).typeId || (item as IPosterTypeItem).id
                                    );
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
                                      if (!isMainCorp && tabIndex !== 0) return message.error('非主机构不能操作');
                                      setPopconfirmVisible(
                                        (item as IProductTypeItem).typeId || (item as IPosterTypeItem).id
                                      );
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

                          {!!item.categoryList?.length && (
                            <div className={style.childrenWrap}>
                              {item.categoryList?.map((childrenItem) => (
                                <div
                                  key={
                                    (childrenItem as IProductTypeItem).typeId || (childrenItem as IPosterTypeItem).id
                                  }
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
                              ))}
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
