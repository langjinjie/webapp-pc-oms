import React, { useEffect, useState } from 'react';
import { Button, Input, PaginationProps, Space } from 'antd';
import { NgTable } from 'src/components';
import { activityList } from 'src/apis/marketing';
import { ActivityProps } from 'src/pages/Marketing/Activity/Config';

import style from './style.module.less';
interface ProductSelectComponentProps {
  selectedRowKeys: React.Key[];
  onChange: (keys: React.Key[], rows: any[]) => void;
}

export const ActivitySelectComponent: React.FC<ProductSelectComponentProps> = ({ onChange, selectedRowKeys }) => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [formValues, setFormValues] = useState({
    activityName: ''
  });
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
    <div className="pa20">
      <div className={style.panelWrap}>
        <div className={style.searchWrap}>
          <div className={style.searchItem}>
            <label htmlFor="">
              <span>活动名称：</span>
              <Input
                name="title"
                placeholder="请输入"
                allowClear
                value={formValues.activityName}
                onChange={(e) => setFormValues({ activityName: e.target.value })}
                className={style.nameInput}
              ></Input>
            </label>
          </div>

          <div className={style.searchItem}>
            <Space size={10}>
              <Button
                type="primary"
                shape="round"
                style={{ width: '70px' }}
                onClick={() => onSearch(formValues)}
                className={style.searchBtn}
              >
                查询
              </Button>
              <Button
                type="default"
                shape="round"
                onClick={() => onSearch({ title: '' })}
                style={{ width: '70px' }}
                className={style.searchBtn}
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
            type: 'checkbox',
            selectedRowKeys: selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: (selectedRowKeys: React.Key[], selectedRows: ActivityProps[]) => {
              const rows = selectedRows.map((item) => ({
                ...item,
                itemId: item?.activityId,
                itemName: item?.activityName
              }));
              onSelectChange(selectedRowKeys, rows);
            }
          }}
          rowKey="activityId"
          paginationChange={paginationChange}
          columns={[{ title: '活动名称', dataIndex: 'activityName', key: 'activityName' }]}
        ></NgTable>
      </div>
    </div>
  );
};
