import React, { useEffect, useState } from 'react';
import { Button, Input, PaginationProps, Select, Space } from 'antd';
import { NgTable } from 'src/components';
import { getProductList, productConfig } from 'src/apis/marketing';
import { ProductProps } from 'src/pages/Marketing/Product/Config';
import styles from './style.module.less';
interface ProductSelectComponentProps {
  onChange: (keys: React.Key[], rows: any[]) => void;
  selectedRowKeys: React.Key[];
}

export const ProductSelectComponent: React.FC<ProductSelectComponentProps> = ({ onChange, selectedRowKeys }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<{ productName: string; category: string | undefined }>();
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
  const onFormValueChange = (values: any) => {
    setFormValues((formValues) => ({ ...formValues, ...values }));
  };
  const onResetSearch = () => {
    setFormValues({ productName: '', category: undefined });
    getList({ productName: '', category: undefined });
  };
  return (
    <div className="pa20">
      <div className={styles.panelWrap}>
        <div className={styles.searchWrap}>
          <div className={styles.searchItem}>
            <label htmlFor="">
              <span>产品名称：</span>
              <Input
                name="title"
                placeholder="请输入"
                allowClear
                value={formValues?.productName}
                onChange={(e) => onFormValueChange({ productName: e.target.value })}
                className={styles.nameInput}
              ></Input>
            </label>
          </div>
          <div className={styles.searchItem}>
            <label>
              <span>产品分类：</span>
              <Select
                placeholder="请选择"
                allowClear
                className={styles.selectWrap}
                value={formValues?.category}
                onChange={(value) => onFormValueChange({ category: value })}
              >
                {options.map((item: any) => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </label>
          </div>
          <div className={styles.searchItem}>
            <Space size={10}>
              <Button
                type="primary"
                shape="round"
                style={{ width: '70px' }}
                onClick={() => onSearch(formValues)}
                className={styles.searchBtn}
              >
                查询
              </Button>
              <Button
                type="default"
                shape="round"
                onClick={() => onResetSearch()}
                style={{ width: '70px' }}
                className={styles.searchBtn}
              >
                重置
              </Button>
            </Space>
          </div>
        </div>

        <NgTable
          className="mt20"
          size="small"
          scroll={{ x: 600 }}
          dataSource={dataSource}
          bordered
          pagination={pagination}
          rowSelection={{
            hideSelectAll: true,
            type: 'checkbox',
            preserveSelectedRowKeys: true,
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys: React.Key[], selectedRows: ProductProps[]) => {
              const rows = selectedRows.map((item) => ({
                ...item,
                itemId: item?.productId,
                itemName: item?.productName
              }));
              onSelectChange(selectedRowKeys, rows);
            },
            getCheckboxProps: (record: any) => {
              return {
                disabled: selectedRowKeys.length >= 5 && !selectedRowKeys.includes(record.productId),
                name: record.productName
              };
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
