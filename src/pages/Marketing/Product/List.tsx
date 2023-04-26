import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Space } from 'antd';

import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import style from './style.module.less';

import { columns, ProductProps, setSearchCols } from './Config';
import { PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import {
  batchOperateProduct,
  getProductList,
  productConfig,
  productManage,
  setUserRightWithProduct,
  sortCancelTopAtProduct,
  sortTopAtProduct
} from 'src/apis/marketing';
import { MyPaginationProps as PaginationProps } from 'src/components/TableComponent/TableComponent';
import moment from 'moment';
import { useDocumentTitle } from 'src/utils/base';
import { SetUserRight } from '../Components/ModalSetUserRight/SetUserRight';

const ProductList: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('营销素材-产品库');
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
  // 批量设置权限的状态
  const [currentItem, setCurrentItem] = useState<ProductProps | null>();
  const [selectRows, setSelectRows] = useState<ProductProps[]>();
  const [visibleSetUserRight, setVisibleSetUserRight] = useState(false);
  const [isBatchSetRight, setIsBatchSetRight] = useState(false);
  const [currentGroupIds, setCurrentGroupIds] = useState<any[]>([]);

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
    history.push('/marketingProduct/edit' + '?isView=' + true, { id: record.productId, type: '1' });
  };
  const copyItem = (record: ProductProps) => {
    history.push('/marketingProduct/edit' + '?isCopy=' + true, { id: record.productId });
  };
  const changeItemStatus = async (record: ProductProps, index: number) => {
    const res = await productManage({
      type: record.status === 2 ? 2 : 1,
      productId: record.productId
    });
    if (res) {
      message.success(record.status === 2 ? '下架成功' : '上架成功');
      const copyData = [...dataSource];
      copyData[index][record.status === 2 ? 'offlineTime' : 'onlineTime'] = moment().format();
      copyData[index].status = record.status === 2 ? 3 : 2;
      setDataSource(copyData);
    }
  };

  const onSearch = async (fieldsValue: any) => {
    setParams(fieldsValue);

    setPagination({
      ...pagination,
      current: 1
    });
    getList({ pageNum: 1, ...fieldsValue });
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

  // 显示配置可见范围模块
  const setRight = (record?: ProductProps) => {
    if (record) {
      setIsBatchSetRight(false);
      setCurrentItem(record);
    } else {
      const mySet = new Set();
      selectRows?.forEach((item) => {
        mySet.add(item.groupId);
      });
      setCurrentGroupIds(Array.from(mySet));
      setIsBatchSetRight(true);
    }
    setVisibleSetUserRight(true);
  };

  const myColumns = columns({ handleEdit, deleteItem, viewItem, changeItemStatus, handleSort, setRight, copyItem });

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
    setParams(values);
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
    setSelectRows(selectedRows);
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

  // 确认设置权限
  const confirmSetRight = async (values: any) => {
    setVisibleSetUserRight(false);
    const { isSet, groupId, isBatch } = values;
    // [adminId];
    // groupId: 93201136316088326
    const list: any[] = [];
    if (isBatch) {
      selectRows?.forEach((item) => {
        list.push({ productId: item.productId, groupId: isSet ? groupId : null });
      });
    } else {
      list.push({ productId: currentItem?.productId, groupId: isSet ? groupId : null });
    }
    const res = await setUserRightWithProduct({ list });
    if (res) {
      message.success('设置成功');
      getList({ pageNum: 1 });
      setPagination((pagination) => ({ ...pagination, current: 1 }));
    }
  };
  return (
    <div className="container">
      {/* 表单查询 start */}
      <header>
        <div className={style.addBtnWrap}>
          <AuthBtn path="/add">
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
          </AuthBtn>
          <AuthBtn path="/viewSelected">
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
          </AuthBtn>
        </div>
        <div className="pt20">
          <AuthBtn path="/query">
            <NgFormSearch
              isInline={false}
              onSearch={onSearch}
              searchCols={setSearchCols(productOptions)}
              onValuesChange={onValuesChange}
            />
          </AuthBtn>
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
            <AuthBtn path="/operateBatch">
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
                className="ml20"
                type="primary"
                shape={'round'}
                ghost
                disabled={operationType !== 2}
                onClick={() => handleToggleOnlineState(2)}
              >
                批量下架
              </Button>
            </AuthBtn>
            <AuthBtn path="/setBatch">
              <Button
                type="primary"
                shape={'round'}
                ghost
                disabled={!(selectRows && selectRows.length > 0)}
                onClick={() => setRight()}
              >
                批量添加可见范围
              </Button>
            </AuthBtn>
          </Space>
        </div>
      )}

      <SetUserRight
        isBatch={isBatchSetRight}
        groupId={isBatchSetRight ? currentGroupIds : currentItem?.groupId}
        visible={visibleSetUserRight}
        onOk={confirmSetRight}
        onCancel={() => setVisibleSetUserRight(false)}
      />
    </div>
  );
};

export default ProductList;
