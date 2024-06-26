import React, { useEffect, useState, useRef, useContext, MutableRefObject } from 'react';
import { Button, Modal, message, Popconfirm } from 'antd';
import {
  HttpFC,
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
} from 'src/apis/systemSettings';

import { IProductTypeItem, IPosterTypeItem } from 'src/utils/interface';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { AuthBtn, Icon } from 'src/components';
import { Context } from 'src/store';
import { Tabs, ChildrenCategory } from 'src/pages/SystemSettings/component/index';
import classNames from 'classnames';
import style from './style.module.less';
import { Drag, Drop, DropChild } from 'src/components/drag-and-drop';
import { useDocumentTitle } from 'src/utils/base';
import { addVideoType, delVideoType, getVideoTypeList, sortVideoType } from 'src/apis/marketing';

const CategoryManage: React.FC = () => {
  const { btnList } = useContext(Context);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [editType, setEditType] = useState('');
  const [typeList, setTypeList] = useState<IProductTypeItem[] | IPosterTypeItem[]>([]);
  const [typeName, setTypeName] = useState<IProductTypeItem | IPosterTypeItem>();
  const [modalType, setModalType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addTypeName, setAddTypeName] = useState('');
  const [parentId, setParentId] = useState('0');
  const [isShowChildrenType, setIsShowChildrenType] = useState('');
  const [popconfirmVisible, setPopconfirmVisible] = useState<string>('');
  const [isOnDrag, setIsOnDrag] = useState('');
  const [isCancel, setIsCancel] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  useDocumentTitle('系统设置-分类管理');

  const tabs = ['产品库', '文章库', '海报库', '视频库'];
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
  // 获取视频分类列表
  const getVideoTypes = async () => {
    const res = await getVideoTypeList({});
    res && setTypeList(res.typeList.map((item: any) => ({ id: item.typeId, name: item.typeName })));
  };

  // 获取分类列表
  const getTypeList: (() => Promise<void>)[] = [
    getProductTypeList,
    getArticleTypeList,
    getPosterTypeList,
    getVideoTypes
  ];

  // 新增/修改视频分类
  const saveVideoType = async (values: any) => {
    const res = await addVideoType({ typeId: values.id, typeName: values.name });
    return res;
  };

  // 删除视频分类
  const deleteVideoType = async (values: any) => {
    return await delVideoType({ typeId: values.id });
  };
  // 添加/修改分类名称
  const modifyTypeName: HttpFC[] = [requestSaveProducType, requestSaveNewType, requestSavePosterType, saveVideoType];
  // 删除分类
  const deleteTypeName: HttpFC[] = [
    requestDeleteProductType,
    requestDeleteNewType,
    requestDeletePosterType,
    deleteVideoType
  ];

  // 重新记录数组顺序
  const reorder = (list: (IProductTypeItem | IPosterTypeItem)[], startIndex: number, endIndex: number) => {
    const result = [...list];
    // 删除并记录 删除元素
    const [removed] = result.splice(startIndex, 1);
    // 将原来的元素添加进数组
    result.splice(endIndex, 0, removed);

    return result;
  };

  // 开始拖拽
  const onDragStart = ({ source, type }: DropResult) => {
    setIsOnDrag(type + source.index);
  };

  // 拖拽结束
  const onDragEnd = async ({ source, destination, type }: DropResult) => {
    if (!btnList.includes('/sort')) {
      return null;
    }
    setIsOnDrag('');
    if (source.index === destination?.index) return;
    // if (!isMainCorp && tabIndex !== 0) return message.error('非主机构不能操作');
    try {
      if (!destination || source.droppableId !== destination.droppableId) {
        return message.warning('不可以跨父类别进行拖拽');
      }
      if (type === 'COLUMN') {
        if (+destination.droppableId.split('-')[1] === typeList.length - 2) {
          return message.error('产品海报分类不支持拖动排序');
        }
        // 子分类
        if (source.droppableId !== destination.droppableId) return message.warning('不可以跨父类别进行拖拽');
        const currentIndex = parseInt(source.droppableId.split('-')[1]);
        if (currentIndex !== undefined) {
          const currentItemChildren = typeList[currentIndex].categoryList || [];
          const copyData = [...typeList];
          const newCurrentData = reorder(currentItemChildren, source.index, destination.index);
          // @ts-ignore
          copyData[currentIndex].categoryList = newCurrentData;
          // 数据倒序提交
          setTypeList(copyData as IProductTypeItem[] | IPosterTypeItem[]);
          const sortTypeIdList = [...newCurrentData].reverse().map((item: any) => item.typeId || item.id);
          const res = await requestSaveSortMarket({ type: tabIndex + 1, typeId: sortTypeIdList });
          if (res) {
            message.success('排序成功');
          } else {
            message.error('排序失败');
            getTypeList[tabIndex]();
          }
        }
      } else {
        // 父分类
        if (destination.index === typeList.length - 1 || source.index === typeList.length - 1) {
          return message.error('其他分类不支持拖动排序');
        }
        if (tabIndex === 2 && (destination.index === typeList.length - 2 || source.index === typeList.length - 2)) {
          return message.error('产品海报分类不支持拖动排序');
        }
        // 获取拖拽后的数据 重新赋值
        const newData = reorder(typeList, source.index, destination.index);
        setTypeList(newData as IProductTypeItem[] | IPosterTypeItem[]);
        const sortTypeIdList = [...newData].reverse().map((item: any) => item.typeId || item.id);
        let res: any;
        // 视频类型
        if (tabIndex === 3) {
          res = await sortVideoType({ typeId: [...newData].map((item: any) => item.typeId || item.id) });
        } else {
          res = await requestSaveSortMarket({ type: tabIndex + 1, typeId: sortTypeIdList });
        }
        if (res) {
          message.success('排序成功');
        } else {
          message.error('排序失败');
          getTypeList[tabIndex]();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 点击编辑按钮
  const handleEdit = async (item: any, childrenItem: any) => {
    if (isEditing) return message.error('请先完成上一次编辑');
    childrenItem ? setParentId((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id) : setParentId('0');
    setEditType((childrenItem || (item as IProductTypeItem)).typeId || (childrenItem || (item as IPosterTypeItem)).id);
    // 此处使用await可以获取到 input[type=text] 的node
    await setTypeName(childrenItem || item);
    (document.querySelector('input[type=text]') as HTMLElement).focus();
  };

  // 点击删除
  const clickDeleteHandle = (item: IProductTypeItem | IPosterTypeItem) => {
    setPopconfirmVisible((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id);
  };

  // 删除的二确confirm
  const onConfirmHandle = async (item: IProductTypeItem | IPosterTypeItem) => {
    const param =
      tabIndex === 2 || tabIndex === 3
        ? { id: (item as IPosterTypeItem).id }
        : { typeId: (item as IProductTypeItem).typeId };
    const res = await deleteTypeName[tabIndex](param);
    if (res) {
      setPopconfirmVisible('');
      getTypeList[tabIndex]();
    }
    res ? message.success('删除成功') : message.error('删除失败');
  };

  // 点击查看子类
  const showChildrenTypeHandle = (item: IProductTypeItem | IPosterTypeItem) => {
    setIsShowChildrenType(
      isShowChildrenType === ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
        ? ''
        : (item as IProductTypeItem).typeId || (item as IPosterTypeItem).id
    );
  };

  const inputOnChangeHandle = (e: React.ChangeEvent<HTMLInputElement>, item: IProductTypeItem | IPosterTypeItem) => {
    // @ts-ignore
    setTypeName({ ...typeName, name: e.target.value.trim() });
    if (e.target.value.trim() !== item.name) {
      setIsEditing(true);
    }
  };

  const inputOnKeyDownHandle = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    item: IProductTypeItem | IPosterTypeItem
  ) => {
    if (e.keyCode === 13) {
      if (!typeName?.name || (typeName && typeName?.name.trim().length > 12)) {
        return message.error('请输入有效的分类名称');
      }
      if (typeName?.name === item.name) return message.error('该分类名称已存在,请重新输入');
      (document.querySelector('input[type=text]') as HTMLElement).blur();
      // setIsEditing(false);
    } else if (e.keyCode === 27) {
      await setIsCancel(true); // await 可以在触发失去焦点的时候获取到最新的isCancel的值
      (document.querySelector('input[type=text]') as HTMLElement).blur();
    }
  };

  const modalOnKeyDownHandle = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      if (!addTypeName || addTypeName.trim().length > 12) return message.error('请输入有效的分类名称');
      const res = await modifyTypeName[tabIndex]({ parentId, name: addTypeName });
      if (res) {
        await getTypeList[tabIndex]();
        message.success('添加成功');
        setIsModalVisible(false);
        setAddTypeName('');
      }
    }
  };

  const inputOnBlurHandle = async (item: IProductTypeItem | IPosterTypeItem) => {
    if (!isCancel) {
      // 解决在上一次编辑未做修改的情况,切换到下一个编辑之后,上一个编辑会发送请求的情况
      if (editType !== ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)) return;
      if (!typeName?.name || (typeName && typeName?.name.trim().length > 12)) {
        message.warning('请输入有效的分类名称');
        return (document.querySelector('input[type=text]') as HTMLElement).focus();
      }
      if (!(typeName?.name === item.name)) {
        const res = await modifyTypeName[tabIndex]({ ...typeName, parentId });
        if (res) {
          await getTypeList[tabIndex]();
          setTypeName(undefined);
          message.success('分类名称修改成功');
        }
      }
    }
    setIsCancel(false);
    setIsEditing(false);
    setEditType('');
    setTypeName(undefined);
  };

  const clearInputTextHandle = () => {
    typeName && setTypeName({ ...typeName, name: '' });
    setIsEditing(true);
    const inputNode: HTMLElement = document.querySelector('input[type=text]') as HTMLElement;
    inputNode.focus();
  };

  const addTypeHandle = async (item: any = null) => {
    if (!typeName?.name && isEditing) return message.error('请先完成上一次编辑');
    if (item ? item.categoryList && item.categoryList.length >= 20 : typeList.length >= 20) {
      return message.error('分类总数不得超过20个');
    }
    setParentId(item ? item.typeId || item.id : '');
    await setIsModalVisible(true); // await 可以获取 addInputNode 节点
    setModalType('新增分类');
    addInputNode.current.focus();
  };

  const modalOnOk = async () => {
    if (!addTypeName) return message.error('请输入有效的分类名称');
    const res = await modifyTypeName[tabIndex]({ parentId, name: addTypeName });
    if (res) {
      await getTypeList[tabIndex]();
      message.success('添加成功');
      setIsModalVisible(false);
      setAddTypeName('');
    }
  };

  const modalOnCancelHandle = () => {
    setIsModalVisible(false);
    setAddTypeName('');
  };

  useEffect(() => {
    getTypeList[tabIndex]();
  }, []);

  return (
    <div className={style.wrap}>
      <Tabs tabs={tabs} fetchList={getTypeList} tabIndex={tabIndex} setTabIndex={setTabIndex} />
      <div className={style.content}>
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          {/* direction代表拖拽方向  默认垂直方向  水平方向:horizontal */}
          <Drop type={'ROW'} droppableId={'kanban'}>
            <DropChild>
              {typeList.map((item, index) => (
                <Drag index={index} draggableId={index + 'draggableId'} key={'draggableId' + index}>
                  <div
                    className={classNames(
                      style.typeItemWrap,
                      {
                        [style.active]:
                          isShowChildrenType === ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                      },
                      { [style.isOnDrag]: isOnDrag === 'ROW' + index }
                    )}
                  >
                    <div
                      className={classNames(style.typeItem)}
                      style={
                        editType !== ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                          ? {}
                          : { display: 'none' }
                      }
                    >
                      <div className={style.typeName}>{item.name}</div>
                      <div className={style.operation}>
                        <AuthBtn path="/edit">
                          {/* {(isMainCorp || tabIndex === 0) && item.name !== '其他' && item.name !== '产品海报' && ( */}
                          {/* {tabIndex === 0 && item.name !== '其他' && item.name !== '产品海报' && ( */}
                          {item.name !== '其他' && item.name !== '产品海报' && (
                            <span
                              data-edit={'edit'}
                              className={style.edit}
                              onClick={async () => handleEdit(item, null)}
                            >
                              编辑
                            </span>
                          )}
                        </AuthBtn>
                        <AuthBtn path="/delete">
                          {/* {(isMainCorp || tabIndex === 0) && item.name !== '其他' && item.name !== '产品海报' && ( */}
                          {/* {tabIndex === 0 && item.name !== '其他' && item.name !== '产品海报' && ( */}
                          {item.name !== '其他' && item.name !== '产品海报' && (
                            <Popconfirm
                              title={'删除分类后,素材将移至"其他"分类下'}
                              visible={
                                popconfirmVisible ===
                                ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                              }
                              onConfirm={() => onConfirmHandle(item)}
                              onCancel={() => setPopconfirmVisible('')}
                            >
                              <span className={style.delete} onClick={() => clickDeleteHandle(item)}>
                                删除
                              </span>
                            </Popconfirm>
                          )}
                        </AuthBtn>
                        {item.name !== '其他' && item.categoryList && (
                          <span className={style.more} onClick={() => showChildrenTypeHandle(item)}>
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
                        type={
                          editType !== ((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id)
                            ? 'none'
                            : 'text'
                        }
                        value={typeName ? typeName?.name : ''}
                        onChange={(e) => inputOnChangeHandle(e, item)}
                        onKeyDown={async (e) => inputOnKeyDownHandle(e, item)}
                        onBlur={() => inputOnBlurHandle(item)}
                      />
                      {typeName && <span className={style.icon} onClick={clearInputTextHandle} />}
                      {typeName && typeName?.name.length > 12 && (
                        <span className={style.check}>{'最多12个字符,不区分中英文'}</span>
                      )}
                    </div>

                    {!!item.categoryList?.length && isShowChildrenType === (item as IPosterTypeItem).id && (
                      <ChildrenCategory
                        parentIndex={index}
                        parentCategory={item}
                        typeName={typeName}
                        isOnDrag={isOnDrag}
                        editType={editType}
                        tabIndex={tabIndex}
                        popconfirmVisible={popconfirmVisible}
                        setPopconfirmVisible={setPopconfirmVisible}
                        handleEdit={handleEdit}
                        onConfirmHandle={onConfirmHandle}
                        inputOnChangeHandle={inputOnChangeHandle}
                        inputOnKeyDownHandle={inputOnKeyDownHandle}
                        inputOnBlurHandle={inputOnBlurHandle}
                        clearInputTextHandle={clearInputTextHandle}
                      />
                    )}
                    <AuthBtn path="/add">
                      {/* {item.name !== '产品海报' && (isMainCorp || tabIndex === 0) && ( */}
                      {/* {item.name !== '产品海报' && tabIndex === 0 && ( */}
                      {item.name !== '产品海报' && (
                        <Button
                          className={classNames(style.addChilrenType, {
                            [style.active]: !item.categoryList?.length
                          })}
                          icon={<Icon className={style.icon} name="icon_daohang_28_jiahaoyou" />}
                          type={'primary'}
                          onClick={() => addTypeHandle(item)}
                        >
                          新增
                        </Button>
                      )}
                    </AuthBtn>
                  </div>
                </Drag>
              ))}
            </DropChild>
          </Drop>
        </DragDropContext>
      </div>
      <AuthBtn path="/add">
        {/* {(isMainCorp || tabIndex === 0) && ( */}
        {/* {tabIndex === 0 && ( */}
        <Button
          className={style.addType}
          icon={<Icon className={style.icon} name="icon_daohang_28_jiahaoyou" />}
          type={'primary'}
          onClick={() => addTypeHandle()}
        >
          新增
        </Button>
        {/* )} */}
      </AuthBtn>
      <Modal
        wrapClassName={style.modalWrap}
        title={modalType}
        closeIcon={<span />}
        maskClosable={false}
        visible={isModalVisible}
        centered
        width={480}
        okText={'确认'}
        okButtonProps={{ disabled: addTypeName.length > 12 || addTypeName.length === 0 }}
        onOk={modalOnOk}
        onCancel={modalOnCancelHandle}
      >
        <div className={style.modalContent}>
          <p>请输入分类名称</p>
          <input
            ref={addInputNode}
            className={style.addTypeName}
            value={addTypeName}
            type="text"
            placeholder="请输入分类名称"
            onChange={(e) => setAddTypeName(e.target.value.trim())}
            onKeyDown={(e) => modalOnKeyDownHandle(e)}
          />
          {addTypeName.length > 12 && <span className={style.check}>{'最多12个字符,不区分中英文'}</span>}
        </div>
      </Modal>
    </div>
  );
};
export default CategoryManage;
