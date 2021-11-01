import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Space } from 'antd';

import { NgFormSearch, NgTable } from 'src/components';
import style from './style.module.less';

import { columns, ProductProps, setSearchCols } from './Config';
import { PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import {
  batchOperateProduct,
  getProductList,
  productConfig,
  productManage,
  sortCancelTopAtProduct,
  sortTopAtProduct
} from 'src/apis/marketing';
import { PaginationProps } from 'src/components/TableComponent/TableComponent';
import moment from 'moment';

const ProductList: React.FC<RouteComponentProps> = ({ history }) => {
  const [params, setParams] = useState({
    productName: '',
    category: '',
    status: '',
    onlineTimeBegin: '',
    onlineTimeEnd: ''
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [dataSource, setDataSource] = useState<ProductProps[]>([]);
  const [operationType, setOperationType] = useState<number | null>(null);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(true);
  const [productOptions, setProductOptions] = useState<any>([]);
  const handleEdit = (record: ProductProps) => {
    history.push('/marketingProduct/edit', { id: record.productId, type: '2' });
  };

  // 获取配置列表
  const getProductConfig = async () => {
    const res = await productConfig({ type: [1] });
    if (res) {
      setProductOptions(res.productTypeList || []);
    }
  };

  const getList = async (args: any) => {
    setOperationType(null);
    setSelectRowKeys([]);
    setLoading(true);
    const res: any = await getProductList({
      ...params,
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...args
    });
    setLoading(false);
    if (res) {
      setDataSource(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
  };
  const deleteItem = async (record: ProductProps, index: number) => {
    const res = await productManage({
      type: 3,
      productId: record.productId
    });
    if (res) {
      message.success('删除成功');
      const copyData = [...dataSource];
      copyData.splice(index, 1);
      setDataSource(copyData);
      if (copyData.length === 0) {
        getList({ pageNum: 1 });
      } else {
        setPagination((pagination) => ({ ...pagination, total: pagination.total - 1 }));
      }
    }
  };
  const viewItem = (record: ProductProps) => {
    history.push('/marketingProduct/edit', { id: record.productId, type: '1' });
  };
  const changeItemStatus = async (record: ProductProps, index: number) => {
    const res = await productManage({
      type: record.status === 2 ? 2 : 1,
      productId: record.productId
    });
    if (res) {
      message.success(record.status === 2 ? '下架成功' : '上架成功');
      const copyData = [...dataSource];
      copyData[index].status = record.status === 2 ? 3 : 2;
      copyData[index].offlineTime = moment().format();
      setDataSource(copyData);
    }
  };

  const onSearch = async (fieldsValue: any) => {
    const { category, productName, status, rangePicker } = fieldsValue;

    let onlineTimeBegin = '';
    let onlineTimeEnd = '';
    if (rangePicker && rangePicker.length > 0) {
      onlineTimeBegin = rangePicker[0].format('YYYY-MM-DD');
      onlineTimeEnd = rangePicker[1].format('YYYY-MM-DD');
    }
    setParams((params) => ({ ...params, category, productName, status, onlineTimeBegin, onlineTimeEnd }));

    setPagination({
      ...pagination,
      current: 1
    });
    getList({ pageNum: 1, category, productName, status, onlineTimeBegin, onlineTimeEnd });
  };
  const handleSort = async (record: ProductProps) => {
    let res: any;
    if (record.isTop === '1') {
      res = await sortCancelTopAtProduct({ productId: record.productId });
    } else {
      res = await sortTopAtProduct({ productId: record.productId });
    }
    if (res) {
      message.success(record.isTop === '1' ? '取消置顶成功' : '置顶成功');
      onSearch({});
    }
  };

  const myColumns = columns({ handleEdit, deleteItem, viewItem, changeItemStatus, handleSort });

  // 添加商品
  const addProduct = () => {
    history.push('/marketingProduct/edit');
  };

  const addFeatureProduct = () => {
    history.push('/marketingProduct/edit-choiceness');
  };

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
  useEffect(() => {
    onSearch({});
    getProductConfig();
  }, []);

  const onValuesChange = (changeValues: any, values: any) => {
    const { category, productName, status, rangePicker } = values;

    let onlineTimeBegin = '';
    let onlineTimeEnd = '';
    if (rangePicker && rangePicker.length > 0) {
      onlineTimeBegin = rangePicker[0].format('YYYY-MM-DD');
      onlineTimeEnd = rangePicker[1].format('YYYY-MM-DD');
    }
    setParams((params) => ({ ...params, category, productName, status, onlineTimeBegin, onlineTimeEnd }));
  };
  const isDisabled = (operationType: number | null, status: number) => {
    let _isDisabled = false;
    if (operationType) {
      if (operationType === 1 && status === 2) {
        _isDisabled = true;
      } else if (operationType === 2 && (status === 1 || status === 3)) {
        _isDisabled = true;
      }
    }
    return _isDisabled;
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: ProductProps[]) => {
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
  const rowSelection = {
    hideSelectAll: true,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: ProductProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: ProductProps) => {
      return {
        disabled: isDisabled(operationType, record.status),
        name: record.productName
      };
    }
  };

  const handleToggleOnlineState = (type: number) => {
    Modal.confirm({
      content: type === 1 ? '确认上架？' : '确认下架？',
      cancelText: '取消',
      okText: '确定',
      onOk: async () => {
        const res = await batchOperateProduct({
          type,
          productIds: selectedRowKeys
        });
        if (res) {
          message.success(type === 1 ? '上架成功' : '下架成功');

          onSearch({});
        }
      }
    });
  };
  return (
    <div className="container">
      {/* 表单查询 start */}
      <header>
        <div className={style.addBtnWrap}>
          <Button
            type="primary"
            onClick={addProduct}
            shape="round"
            icon={<PlusOutlined />}
            size="large"
            style={{ width: 128 }}
          >
            添加
          </Button>
          <Button
            type="primary"
            onClick={addFeatureProduct}
            shape="round"
            icon={<PlusOutlined />}
            size="large"
            style={{ width: 128, marginLeft: 40 }}
          >
            当月精选
          </Button>
        </div>
        <div className="pt20">
          <NgFormSearch
            isInline={false}
            onSearch={onSearch}
            searchCols={setSearchCols(productOptions)}
            onValuesChange={onValuesChange}
          />
        </div>
      </header>
      {/* 表单查询 end */}
      <NgTable
        rowSelection={rowSelection}
        columns={myColumns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        paginationChange={paginationChange}
        setRowKey={(record: any) => {
          return record.productId;
        }}
      />
      {dataSource.length > 0 && (
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
  );
};

export default ProductList;
