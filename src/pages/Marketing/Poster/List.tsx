import React, { useState, useEffect, useContext } from 'react';
import style from './style.module.less';

import FormSearch from 'src/components/SearchComponent/SearchComponent';
import NgTable from 'src/components/TableComponent/TableComponent';
import { setSearchCols, columns, Poster } from './Config';
import { Button, message, Modal, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { PaginationProps } from '../types';
import { RouteComponentProps } from 'react-router';
import { getPosterList, toggleOnlineState, posterOperation, getPosterCategoryList } from 'src/apis/marketing';
import { useAsync } from 'src/utils/use-async';
import { Context } from 'src/store';
import { OnlineModal } from '../Components/OnlineModal/OnlineModal';
import { useDocumentTitle } from 'src/utils/base';

interface PostPosterData {
  total: number;
  list: Poster[];
}
const ProductList: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('海报列表页');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,

    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  // operationType 1=上架;2=下架;
  const [operationType, setOperationType] = useState<number | null>(null);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const { currentCorpId, isMainCorp } = useContext(Context);
  const [visible, setVisible] = useState(false);
  const [categoryList, setCategoryList] = useState<any[]>([]);

  const [params, setParams] = useState<{
    name: string | null;
    corpId: string | null;
    status: string | null;
    typeIds: string[] | any;
  }>({
    name: null,
    corpId: null,
    status: null,
    typeIds: []
  });

  const { isLoading, run, data: posterData } = useAsync<PostPosterData>();
  const [currentItem, setCurrentItem] = useState<Poster | null>();

  const getCategoryList = async () => {
    const res = (await getPosterCategoryList({})) || [];
    setCategoryList(res);
  };

  const getList = (autoParams?: {
    pageNum?: number;
    pageSize?: number;
    name?: string;
    corpId?: string;
    status?: string;
    typeId?: string;
    fatherTypeId?: string;
  }) => {
    // 列表数据跟新前，先清空操作状态和选中项
    setOperationType(null);
    setSelectRowKeys([]);
    const postParams = {
      pageSize: pagination.pageSize,
      pageNum: pagination.current,
      name: params.name?.trim(),
      corpId: params.corpId,
      status: params.status,
      fatherTypeId: params.typeIds[0] || null,
      typeId: params.typeIds[1] || null,
      ...autoParams
    };
    run(getPosterList(postParams));
  };

  useEffect(() => {
    getList();
    getCategoryList();
  }, []);
  const paginationChange = (page: number, pageSize?: number) => {
    setPagination((pagination) => {
      return {
        ...pagination,
        current: page,
        pageSize: pageSize || 10
      };
    });
    getList({ pageNum: page, pageSize });
  };

  // 查询条件切换
  const handleSearchValueChange = (changesValue: any, values: any) => {
    const { name = null, status = null, typeIds = [] } = values;
    setParams((params) => ({ ...params, name, status, typeIds }));
  };

  /**
   * 点击查询
   */
  const handleSearch = (values: any) => {
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    const { name = null, status = null, typeIds = [] } = values;

    setParams((params) => ({ ...params, name, status, typeIds }));
    getList({ pageNum: 1, name: name?.trim(), status, typeId: typeIds[1], fatherTypeId: typeIds[0] });
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: Poster[]) => {
    setSelectRowKeys(selectedRowKeys);
    const current = selectedRows[0];
    if (current) {
      if (current.status === 1 || current.status === 3) {
        setOperationType(1);
      } else {
        setOperationType(2);
      }
    } else {
      setOperationType(null);
    }
  };

  const onSubmitToggleOnline = async ({
    type,
    corpIds,
    record
  }: {
    type: number;
    corpIds?: string[];
    record?: Poster;
  }) => {
    const res = await toggleOnlineState({
      opType: type,
      posterIds: operationType ? selectedRowKeys : [record?.posterId || currentItem?.posterId], // 判断是否是批量操作
      corpIds: corpIds || [currentCorpId]
    });
    if (res) {
      const msg = type === 1 ? '上架成功！' : '下架成功！';
      message.success(msg);
      handleSearch({});
    }
  };

  /**
   * 确认上架
   */
  const submitOnline = (corpIds: any[]) => {
    onSubmitToggleOnline({ type: 1, corpIds });
    setVisible(false);
  };

  const handleToggleOnlineState = async (type: number, record?: Poster) => {
    if (type === 2) {
      if (operationType && !record) {
        Modal.confirm({
          content: isMainCorp ? '下架后会影响所有机构' : '确定下架',
          cancelText: '取消',
          okText: '确定',
          onOk: () => {
            onSubmitToggleOnline({ type, record });
          }
        });
      } else {
        onSubmitToggleOnline({ type, record });
      }
    } else {
      if (isMainCorp) {
        setVisible(true);
      } else {
        Modal.confirm({
          content: '确认上架？',
          cancelText: '取消',
          okText: '确定',
          onOk: () => {
            onSubmitToggleOnline({ type, record });
          }
        });
      }
    }
  };

  // 新增海报
  const handleAdd = () => {
    history.push('/marketingPoster/edit');
  };
  const handleEdit = (poster: Poster) => {
    history.push('/marketingPoster/edit?id=' + poster.posterId);
  };
  // 删除
  const deleteItem = async (record: Poster) => {
    const res = await posterOperation({
      corpIds: null,
      opType: 0,
      posterId: record.posterId
    });
    if (res) {
      message.success('删除成功');
      // 置顶成功之后，刷新列表
      handleSearch({});
    }
  };
  // 查看详情
  const viewItem = (poster: Poster) => {
    history.push('/marketingPoster/edit?id=' + poster.posterId + '&viewport=1');
  };
  // 上下架
  const changeItemStatus = (type: number, record: Poster) => {
    setCurrentItem(record);
    handleToggleOnlineState(type, record);
  };
  // 置顶
  const handleTop = async (record: Poster) => {
    const res = await posterOperation({
      corpIds: null,
      opType: record.weightRecommend ? -3 : 3,
      posterId: record.posterId
    });
    if (res) {
      message.success(record.weightRecommend ? '取消置顶成功' : '置顶成功');
      // 置顶成功之后，刷新列表
      handleSearch({});
    }
  };

  const columnList = columns({ handleEdit, deleteItem, viewItem, changeItemStatus, handleTop });

  const isDisabled = (operationType: number | null, status: number, record: Poster) => {
    let _isDisabled = false;
    if (record.productId) {
      return true;
    }
    if (operationType) {
      if (operationType === 1 && status === 2) {
        _isDisabled = true;
      } else if (operationType === 2 && (status === 1 || status === 3)) {
        _isDisabled = true;
      }
    }
    return _isDisabled;
  };

  // 表格RowSelection配置项
  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: Poster[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: Poster) => {
      return {
        disabled: isDisabled(operationType, record.status, record),
        name: record.name
      };
    }
  };

  return (
    <div className="container">
      <div className={style.header}>
        <Button
          className={style.btnAdd}
          type="primary"
          onClick={handleAdd}
          shape="round"
          icon={<PlusOutlined />}
          size="large"
          style={{ width: 128 }}
        >
          添加
        </Button>
        <FormSearch
          searchCols={setSearchCols(categoryList)}
          onSearch={handleSearch}
          onValuesChange={(changesValue, values) => {
            handleSearchValueChange(changesValue, values);
          }}
        />
      </div>
      <div className={style.main}>
        {/* 表单查询 end */}
        <NgTable
          rowSelection={rowSelection}
          columns={columnList}
          dataSource={posterData?.list || []}
          loading={isLoading}
          pagination={{ ...pagination, total: posterData?.total || 0 }}
          paginationChange={paginationChange}
          setRowKey={(record: any) => {
            return record.posterId;
          }}
        />
        {posterData && posterData.total > 0 && (
          <div className={'operationWrap'}>
            <Space size={20}>
              <Button
                type="primary"
                shape={'round'}
                ghost
                disabled={operationType !== 1}
                onClick={() => handleToggleOnlineState(1)}
              >
                批量上架
              </Button>
              <Button
                type="primary"
                shape={'round'}
                ghost
                disabled={operationType !== 2}
                onClick={() => handleToggleOnlineState(2)}
              >
                批量下架
              </Button>
            </Space>
          </div>
        )}
      </div>
      <div className={style.footer}></div>
      <OnlineModal visible={visible} onCancel={() => setVisible(false)} onOk={submitOnline}></OnlineModal>
    </div>
  );
};

export default ProductList;
