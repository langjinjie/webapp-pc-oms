import React, { useEffect, useState } from 'react';
import { PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { getProductList, productConfig } from 'src/apis/marketing';
import { ProductProps } from 'src/pages/Marketing/Product/Config';
import styles from './style.module.less';
interface ProductSelectComponentProps {
  onChange: (keys: React.Key[], rows: any[]) => void;
  selectedRowKeys: React.Key[];
}

export const ProductSelectComponent: React.FC<ProductSelectComponentProps> = ({ onChange }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 9,
    total: 0,
    simple: true
  });
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const res = await getProductList({
      status: 2,
      pageSize: pagination.pageSize,
      ...formValues,
      ...params,
      pageNum
    });
    if (res) {
      const { list, total } = res;
      setDataSource(list || []);
      setPagination((pagination) => ({ ...pagination, total, current: pageNum }));
    }
  };
  const asyncGetTagsOrCategory = async () => {
    try {
      const res = await productConfig({ type: [1] });
      if (res) {
        setOptions(res.productTypeList || []);
      }
    } catch (err) {
      // throw Error(err);
    }
  };

  const paginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getList({ pageNum });
  };

  useEffect(() => {
    asyncGetTagsOrCategory();
    getList();
  }, []);
  const onSearch = async (values: any) => {
    setFormValues(values);
    getList({ ...values, pageNum: 1 });
  };
  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    onChange(selectedRowKeys, selectedRows);
  };
  return (
    <div className="pa20">
      <div className={styles.panelWrap}>
        <NgFormSearch
          onSearch={onSearch}
          onValuesChange={(changeValue, values) => setFormValues(values)}
          searchCols={[
            {
              name: 'title',
              type: 'input',
              label: '文章名称',
              width: '200px',
              placeholder: '待输入'
            },
            {
              name: 'categoryId',
              type: 'select',
              label: '文章分类',
              options: options,
              width: '200px',
              placeholder: '待输入'
            }
          ]}
          hideReset
        />
        <NgTable
          className="mt20"
          size="small"
          scroll={{ x: 600 }}
          dataSource={dataSource}
          bordered
          pagination={pagination}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys: React.Key[], selectedRows: ProductProps[]) => {
              const rows = selectedRows.map((item) => ({
                ...item,
                itemId: item.productId,
                itemName: item.productName
              }));
              onSelectChange(selectedRowKeys, rows);
            }
          }}
          rowKey="productId"
          paginationChange={paginationChange}
          columns={[
            { title: '产品名称', dataIndex: 'productName', key: 'productName', width: 300 },
            {
              title: '分类',
              dataIndex: 'categoryName',
              key: 'categoryName',
              width: 160
            }
          ]}
        ></NgTable>
      </div>
    </div>
  );
};
