import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';

import { NgFormSearch, NgTable } from 'src/components';
import style from './style.module.less';

import { columns, ProductProps, setSearchCols } from './Config';
import { PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router';
import { getProductList, productManage } from 'src/apis/marketing';
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

  const handleEdit = (record: ProductProps) => {
    history.push('/marketingProduct/edit', { id: record.productId, type: '2' });
  };
  const deleteItem = () => {
    console.log('deleteItem');
  };
  const viewItem = (record: ProductProps) => {
    history.push('/marketingProduct/edit', { id: record.productId, type: '1' });
  };
  const changeItemStatus = async (record: ProductProps, index: number) => {
    const res = await productManage({
      type: record.status === 1 ? 2 : 1,
      productId: record.productId
    });
    if (res) {
      message.success('下架成功');
      const copyData = [...dataSource];
      copyData[index].status = 3;
      copyData[index].offlineTime = moment().format();
      setDataSource(copyData);
    }
  };

  const myColumns = columns({ handleEdit, deleteItem, viewItem, changeItemStatus });

  // 添加商品
  const addProduct = () => {
    history.push('/marketingProduct/edit');
  };

  const addFeatureProduct = () => {
    history.push('/marketingProduct/edit-choiceness');
  };

  const getList = async (args: any) => {
    const res: any = await getProductList({ ...params, ...args });
    if (res) {
      setDataSource(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
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
            searchCols={setSearchCols([])}
            onValuesChange={onValuesChange}
          />
        </div>
      </header>
      {/* 表单查询 end */}
      <NgTable
        rowSelection={{
          hideSelectAll: true,
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRowKeys, selectedRows);
          },
          getCheckboxProps: (record: ProductProps) => {
            return {
              disabled: false,
              name: record.productName
            };
          }
        }}
        columns={myColumns}
        dataSource={dataSource}
        loading={false}
        pagination={pagination}
        paginationChange={paginationChange}
        setRowKey={(record: any) => {
          return record.productId;
        }}
      />
    </div>
  );
};

export default ProductList;
