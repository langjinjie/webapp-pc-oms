import React /* , { useContext } */ from 'react';
import { Drag, Drop, DropChild } from 'src/components/drag-and-drop';
import { IProductTypeItem, IPosterTypeItem } from 'src/utils/interface';
import { Popconfirm /* , message */ } from 'antd';
// import { Context } from 'src/store';
import classNames from 'classnames';
import style from './style.module.less';
import { AuthBtn } from 'src/components';

interface IChildrenCategoryProps {
  parentIndex: number;
  parentCategory: IProductTypeItem | IPosterTypeItem;
  typeName: IProductTypeItem | IPosterTypeItem | undefined;
  isOnDrag: string;
  editType: string;
  tabIndex: number;
  popconfirmVisible: string;
  setPopconfirmVisible: (param: string) => void;
  handleEdit: (parentCategory: IProductTypeItem | IPosterTypeItem, childrenItem: any) => void;
  onConfirmHandle: (childrenItem: IProductTypeItem | IPosterTypeItem) => void;
  inputOnChangeHandle: (
    e: React.ChangeEvent<HTMLInputElement>,
    childrenItem: IProductTypeItem | IPosterTypeItem
  ) => void;
  inputOnKeyDownHandle: (
    e: React.KeyboardEvent<HTMLInputElement>,
    childrenItem: IProductTypeItem | IPosterTypeItem
  ) => void;
  inputOnBlurHandle: (childrenItem: IProductTypeItem | IPosterTypeItem) => void;
  clearInputTextHandle: () => void;
}

const ChildrenCategory: React.FC<IChildrenCategoryProps> = ({
  parentIndex,
  parentCategory,
  typeName,
  isOnDrag,
  editType,
  // tabIndex,
  popconfirmVisible,
  setPopconfirmVisible,
  handleEdit,
  onConfirmHandle,
  inputOnChangeHandle,
  inputOnKeyDownHandle,
  inputOnBlurHandle,
  clearInputTextHandle
}) => {
  // const { isMainCorp } = useContext(Context);
  // 点击删除
  const clickDeleteHandle = (item: IProductTypeItem | IPosterTypeItem) => {
    // if (!isMainCorp && tabIndex !== 0) return message.error('非主机构不能操作');
    setPopconfirmVisible((item as IProductTypeItem).typeId || (item as IPosterTypeItem).id);
  };
  return (
    <div className={style.childrenWrap}>
      <Drop type={'COLUMN'} direction={'vertical'} droppableId={String('kanbank-' + parentIndex)}>
        <DropChild>
          {parentCategory.categoryList?.map((childrenItem: any, childIndex) => (
            <Drag
              key={(childrenItem as IProductTypeItem).typeId || (childrenItem as IPosterTypeItem).id}
              index={childIndex}
              draggableId={String(childrenItem.id)}
            >
              <div
                className={classNames(
                  style.childrenItemWrap,
                  {
                    [style.active]:
                      typeName &&
                      // @ts-ignore
                      (childrenItem.typeId || childrenItem.id) === (typeName.typeId || typeName.id)
                  },
                  { [style.isOnDrag]: isOnDrag === 'COLUMN' + childIndex }
                )}
              >
                <div
                  className={style.childrenItem}
                  style={
                    editType === ((childrenItem as IProductTypeItem).typeId || (childrenItem as IPosterTypeItem).id)
                      ? { display: 'none' }
                      : {}
                  }
                >
                  {childrenItem.name}
                  <div className={style.childrenOperation}>
                    <AuthBtn path="/edit">
                      {/* {parentCategory.name !== '产品海报' && (isMainCorp || tabIndex === 0) && ( */}
                      {parentCategory.name !== '产品海报' && (
                        <span data-edit={'edit'} onClick={() => handleEdit(parentCategory, childrenItem)}>
                          编辑
                        </span>
                      )}
                    </AuthBtn>
                    <AuthBtn path="/delete">
                      <Popconfirm
                        title={'删除分类后,素材将移至"其他"分类下'}
                        visible={
                          popconfirmVisible ===
                          ((childrenItem as IProductTypeItem).typeId || (childrenItem as IPosterTypeItem).id)
                        }
                        onConfirm={async () => onConfirmHandle(childrenItem)}
                        onCancel={() => setPopconfirmVisible('')}
                      >
                        {/* {parentCategory.name !== '产品海报' && (isMainCorp || tabIndex === 0) && ( */}
                        {parentCategory.name !== '产品海报' && (
                          <span onClick={() => clickDeleteHandle(childrenItem)}>删除</span>
                        )}
                      </Popconfirm>
                    </AuthBtn>
                  </div>
                </div>
                <div
                  className={style.inputChildrenItem}
                  style={
                    editType === ((childrenItem as IProductTypeItem).typeId || (childrenItem as IPosterTypeItem).id)
                      ? {}
                      : { display: 'none' }
                  }
                >
                  <input
                    type={
                      editType === ((childrenItem as IProductTypeItem).typeId || (childrenItem as IPosterTypeItem).id)
                        ? 'text'
                        : 'none'
                    }
                    value={typeName ? typeName?.name : ''}
                    onChange={(e) => inputOnChangeHandle(e, childrenItem)}
                    onKeyDown={async (e) => inputOnKeyDownHandle(e, childrenItem)}
                    onBlur={() => inputOnBlurHandle(childrenItem)}
                  />
                  {typeName && <span className={style.icon} onClick={clearInputTextHandle} />}
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
  );
};
export default ChildrenCategory;
