import React, { useEffect, useState, MutableRefObject, useRef } from 'react';
import { Button, Modal } from 'antd';
import { requestGetProductTypeList, requestGetNewTypeList, requestGetPosterTypeList } from 'src/apis/SystemSettings';
import { IProductTypeItem } from 'src/utils/interface';
import classNames from 'classnames';
import style from './style.module.less';
import { Icon } from 'src/components';

const categoryManage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [editType, setEditType] = useState('');
  const [childrenEditType, setChildrenEditType] = useState('');
  const [productTypeList, setProductTypeList] = useState<IProductTypeItem[]>();
  const [articleTypeList, setArticleTypeList] = useState<[]>();
  const [posterTypeList, setPosterTypeList] = useState<[]>();
  const [typeName, setTypeName] = useState('');
  const [modalType, setModalType] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addTypeName, setAddTypeName] = useState('');
  const [isShowChildrenType, setIsShowChildrenType] = useState('');

  const tabs = ['产品库', '文章库', '海报库', '活动库'];
  const requestList = [productTypeList, articleTypeList, posterTypeList];
  const typeWrap: MutableRefObject<any> = useRef();

  // 获取产品分类列表
  const getProductTypeList = async () => {
    const res = await requestGetProductTypeList();
    console.log(res);
    res && setProductTypeList(res.typeList);
  };

  // 获取文章分类
  const getArticleTypeList = async () => {
    const res = await requestGetNewTypeList();
    setArticleTypeList(res.typeList);
  };

  // 获取海报分类
  const getPosterTypeList = async () => {
    const res = await requestGetPosterTypeList();
    console.log(res);
    setPosterTypeList(res.categoryList);
  };
  useEffect(() => {
    getProductTypeList();
    getArticleTypeList();
    getPosterTypeList();
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
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <div className={style.content} ref={typeWrap}>
        {requestList[tabIndex]?.map((item, index) => (
          <div
            key={item.typeId}
            className={classNames(style.typeItemWrap, { [style.active]: isShowChildrenType === item.typeId })}
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
                    onClick={() => setIsShowChildrenType(isShowChildrenType === item.typeId ? '' : item.typeId)}
                  >
                    <Icon name={isShowChildrenType === item.typeId ? 'icon_common_16_Line_Down' : 'shangjiantou'} />
                  </span>
                )}
              </div>
            </div>
            <div className={style.inputTypeItem} style={editType !== item.typeId ? { display: 'none' } : {}}>
              <input data-edit={'edit'} type="text" value={typeName} onChange={(e) => setTypeName(e.target.value)} />
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
                <div className={style.childrenWrap}>
                  {item.children?.map((childrenItem, childrenIndex) => (
                    <div key={childrenItem.typeId} className={style.childrenItemWrap}>
                      <div
                        className={style.childrenItem}
                        style={childrenEditType === childrenItem.typeId ? { display: 'none' } : {}}
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
                        style={childrenEditType === childrenItem.typeId ? {} : { display: 'none' }}
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
                    </div>
                  ))}
                </div>
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
          </div>
        ))}
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
