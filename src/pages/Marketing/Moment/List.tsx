import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import React, { useState } from 'react';
import { NgFormSearch, NgTable } from 'src/components';
import { NodeColumns, searchColsFun, tableColumnsFun } from './ListConfig';

type QueryParamsType = Partial<{
  nodeCode: string;
  nodeName: string;
  nodeName1?: string;
  nodeTypeCode: string;
}>;
const MomentList: React.FC = () => {
  const [queryParams, setQueryParams] = useState<QueryParamsType>({});
  const [tableSource, setTableSource] = useState<Partial<NodeColumns>[]>([{}, {}]);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 100,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = (params?: any) => {
    console.log(params, queryParams);
    setTableSource([]);
    setPagination(pagination);
    setSelectRowKeys([]);
  };

  const onSearch = ({ nodeName1: nodeName, ...values }: QueryParamsType) => {
    setQueryParams({ ...values, nodeName });
    getList({ ...values, nodeName, pageNum: 1 });
  };
  const onValuesChange = (changeValue: any, values: any) => {
    setQueryParams(values);
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    console.log(pageNum, pageSize);
    getList({ pageNum, pageSize });
  };

  const deleteNodeItem = () => {
    console.log('operate');
  };

  // 表格RowSelection配置项
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: NodeColumns[]) => {
      setSelectRowKeys(selectedRowKeys);
      console.log(selectedRows);
    },
    getCheckboxProps: (record: NodeColumns) => {
      return {
        disabled: false,
        name: record.nodeName
      };
    }
  };

  return (
    <div className="container">
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        onClick={() => {
          console.log('add');
        }}
        size="large"
      >
        新建节点
      </Button>
      <NgFormSearch
        className="mt20"
        searchCols={searchColsFun([{}])}
        onSearch={onSearch}
        onValuesChange={onValuesChange}
      />

      <div className="mt20">
        <NgTable
          rowSelection={rowSelection}
          columns={tableColumnsFun({
            onOperate: deleteNodeItem
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: NodeColumns) => {
            return record.nodeId;
          }}
        />
      </div>
      <div className={'operationWrap'}>
        <Button type="primary" shape={'round'} ghost onClick={() => console.log('ssa')}>
          批量删除
        </Button>
      </div>
    </div>
  );
};

export default MomentList;
