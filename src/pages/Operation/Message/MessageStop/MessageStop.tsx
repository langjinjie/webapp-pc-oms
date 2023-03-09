import { Button } from 'antd';
import React, { Key, useState } from 'react';
import { NgFormSearch } from 'src/components';
import NewTableComponent, { MyPaginationProps } from 'src/components/TableComponent/NewTableComponent';
import { tableColumnsFun, searchColsFun, MessageStopColumn } from './ListConfig';

const MessageStop: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Partial<MessageStopColumn>[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [dataSource, setDataSource] = useState<Partial<MessageStopColumn>[]>([]);
  const [pagination, setPagination] = useState<MyPaginationProps>({
    total: 0,
    pageNum: 1
  });
  const onOperate = () => {
    console.log('onOperate');
  };
  const getList = (params: any) => {
    console.log(params);
    return new Promise((resolve) => {
      setTimeout(() => {
        setDataSource([{}]);
        resolve(1000);
      }, 3000);
    });
  };
  const onSearch = async (values: any) => {
    console.log(values);
    setLoading(true);
    await getList({ pageNum: 1 });
    setLoading(false);
    setPagination((pagination) => ({ ...pagination, total: 1000, pageNum: 1 }));
  };
  return (
    <div className="container">
      <NgFormSearch searchCols={searchColsFun()} onSearch={onSearch} />
      <div className="pt15">
        <NewTableComponent<Partial<MessageStopColumn>>
          pagination={pagination}
          loading={loading}
          loadData={getList}
          dataSource={dataSource}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
              setSelectedRows(selectedRows);
            }
          }}
          columns={tableColumnsFun(onOperate)}
        ></NewTableComponent>
        {selectedRowKeys.length > 0 && (
          <div className={'operationWrap'}>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={selectedRows.length === 0}
              onClick={() => {
                console.log('批量停用');
              }}
            >
              批量停用
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageStop;
