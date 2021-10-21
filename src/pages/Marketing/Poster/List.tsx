import React, { useState } from 'react';
import style from './style.modules.less';

import FormSearch from 'src/components/SearchComponent/SearchComponent';
import NgTable from 'src/components/TableComponent/TableComponent';
import { setSearchCols } from './Config';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { columns } from '../Product/Config';
import { PaginationProps } from '../types';
import { RouteComponentProps } from 'react-router';

const ProductList: React.FC<RouteComponentProps> = ({ history }) => {
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const paginationChange = (page: number, pageSize?: number) => {
    setPagination((pagination) => {
      return {
        ...pagination,
        current: page,
        pageSize: pageSize || 10
      };
    });
    // getList({ pageNum: page, pageSize });
  };
  // 新增海报
  const handleAdd = () => {
    history.push('/marketing/poster/edit');
  };
  const handleEdit = () => {
    console.log('handleEdit');
  };
  const deleteItem = () => {
    console.log('deleteItem');
  };
  const viewItem = () => {
    console.log('viewItem');
  };
  const changeItemStatus = () => {
    console.log('changeItemStatus');
  };

  const columnList = columns({ handleEdit, deleteItem, viewItem, changeItemStatus });
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
          searchCols={setSearchCols()}
          onSearch={() => {
            console.log('onsearch');
          }}
          onValuesChange={() => {
            console.log('onValuesChange');
          }}
        />
      </div>
      <div className={style.main}>
        {/* 表单查询 end */}
        <NgTable
          rowSelection={{
            hideSelectAll: true,
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(selectedRowKeys, selectedRows);
            },
            getCheckboxProps: (record) => {
              return {
                disabled: false,
                name: record.productName
              };
            }
          }}
          columns={columnList}
          dataSource={[
            {
              productId: '1408736559292760068',
              productName: '超级玛丽27号重疾险',
              categoryId: 1,
              categoryName: '车险',
              createBy: '刘俊杰',
              createTime: '2021-06-26 18:39',
              onlineTime: '2021-07-06 20:59',
              offlineTime: '2021-07-16 17:45',
              status: 3,
              isOwner: '0'
            },
            {
              productId: '1417413752600436740',
              productName: '测试新增商品列表刷新功能11',
              categoryId: 1,
              categoryName: '车险',
              createBy: '余亚东',
              createTime: '2021-07-20 17:19',
              onlineTime: null,
              offlineTime: null,
              status: 1,
              isOwner: '1'
            },
            {
              productId: '1422468409857208408',
              productName: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
              categoryId: 1,
              categoryName: '车险',
              createBy: '刘俊杰',
              createTime: '2021-08-03 16:04',
              onlineTime: null,
              offlineTime: null,
              status: 1,
              isOwner: '0'
            },
            {
              productId: '1409394188528656389',
              productName: '测试编辑去',
              categoryId: 2,
              categoryName: '重疾险',
              createBy: '余亚东',
              createTime: '2021-06-28 14:12',
              onlineTime: '2021-07-09 16:32',
              offlineTime: '2021-07-09 16:53',
              status: 3,
              isOwner: '1'
            },
            {
              productId: '1415969300061134869',
              productName: '百万医疗2021家庭版',
              categoryId: 3,
              categoryName: '医疗险',
              createBy: '韦斯多',
              createTime: '2021-07-16 17:39',
              onlineTime: '2021-07-16 17:39',
              offlineTime: null,
              status: 2,
              isOwner: '0'
            },
            {
              productId: '1410443354138779707',
              productName: '测试产品三',
              categoryId: 4,
              categoryName: '意外险',
              createBy: '孙广东',
              createTime: '2021-07-01 11:41',
              onlineTime: '2021-07-07 14:32',
              offlineTime: '2021-07-09 16:12',
              status: 3,
              isOwner: '0'
            },
            {
              productId: '1412317046464618582',
              productName: '雇主责任险',
              categoryId: 5,
              categoryName: '其他',
              createBy: '孙广东',
              createTime: '2021-07-06 15:46',
              onlineTime: '2021-07-06 15:47',
              offlineTime: '2021-07-07 14:31',
              status: 3,
              isOwner: '0'
            },
            {
              productId: '1417684219697602651',
              productName: '救救我',
              categoryId: 3,
              categoryName: '医疗险',
              createBy: '林堞雅',
              createTime: '2021-07-21 11:13',
              onlineTime: '2021-07-21 11:14',
              offlineTime: null,
              status: 2,
              isOwner: '0'
            },
            {
              productId: '1415966804949377069',
              productName: '账户安全险',
              categoryId: 5,
              categoryName: '其他',
              createBy: '韦斯多',
              createTime: '2021-07-16 17:29',
              onlineTime: '2021-07-16 17:29',
              offlineTime: null,
              status: 2,
              isOwner: '0'
            },
            {
              productId: '1412309624782102589',
              productName: '百万家财险',
              categoryId: 5,
              categoryName: '其他',
              createBy: '韦斯多',
              createTime: '2021-07-06 15:17',
              onlineTime: '2021-07-06 15:17',
              offlineTime: null,
              status: 2,
              isOwner: '0'
            }
          ]}
          loading={false}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: any) => {
            return record.productId;
          }}
        />
      </div>
      <div className={style.footer}></div>
    </div>
  );
};

export default ProductList;
