import React, { useEffect, useState } from 'react';
import { PaginationProps } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { activityList } from 'src/apis/marketing';
import { ActivityProps } from 'src/pages/Marketing/Activity/Config';

interface ProductSelectComponentProps {
  onChange: (keys: React.Key[], rows: any[]) => void;
}

export const ActivitySelectComponent: React.FC<ProductSelectComponentProps> = ({ onChange }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>();
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 9,
    total: 0,
    simple: true
  });
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const res = await activityList({
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

  const paginationChange = (pageNum: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum }));
    getList({ pageNum });
  };

  useEffect(() => {
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
    <>
      <NgFormSearch
        onSearch={onSearch}
        onValuesChange={(changeValue, values) => setFormValues(values)}
        searchCols={[
          {
            name: 'activityName',
            type: 'input',
            label: '活动名称',
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
          type: 'radio',
          onChange: (selectedRowKeys: React.Key[], selectedRows: ActivityProps[]) => {
            const rows = selectedRows.map((item) => ({
              ...item,
              itemId: item.activityId,
              itemName: item.activityName
            }));
            onSelectChange(selectedRowKeys, rows);
          }
        }}
        rowKey="activityId"
        paginationChange={paginationChange}
        columns={[{ title: '活动名称', dataIndex: 'activityName', key: 'activityName' }]}
      ></NgTable>
    </>
  );
};
