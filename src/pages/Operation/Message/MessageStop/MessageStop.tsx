import { Button, message } from 'antd';
import React, { Key, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getMassList, stopMass } from 'src/apis/marquee';
import { NgFormSearch, NgModal } from 'src/components';
import NewTableComponent, { MyPaginationProps } from 'src/components/TableComponent/NewTableComponent';
import { OperateType } from 'src/utils/interface';
import { tableColumnsFun, searchColsFun, MessageStopColumn } from './ListConfig';

const MessageStop: React.FC<RouteComponentProps> = ({ history }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Partial<MessageStopColumn>[]>([]);
  const [formValues, setFormValues] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [dataSource, setDataSource] = useState<Partial<MessageStopColumn>[]>([]);
  const [pagination, setPagination] = useState<MyPaginationProps>({
    total: 0,
    pageNum: 1
  });
  const getList = async (params?: any) => {
    const res = await getMassList({
      ...formValues,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      ...params
    });
    console.log(res);
    if (res) {
      const { list, total } = res;
      setDataSource(list);
      setPagination((pagination) => ({ ...pagination, total }));
    }
  };
  const onConfirmStop = async (list?: string[]) => {
    console.log(list);
    const res = await stopMass({
      list: list || selectedRowKeys
    });
    if (res) {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      message.success('操作成功');
      getList({ pageNum: 1 });
    }
  };
  const onOperate = (operateType: OperateType, record: MessageStopColumn) => {
    console.log('onOperate', operateType);
    if (operateType === 'view') {
      history.push('/messagestop/detail?id=' + record.batchId);
    } else if (operateType === 'outline') {
      onConfirmStop([record.batchId]);
    }
  };

  useEffect(() => {
    getList();
  }, []);
  const onSearch = async (values: any) => {
    setLoading(true);
    setFormValues(values);
    await getList({ pageNum: 1, ...values });
    setLoading(false);
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
          rowKey={'batchId'}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
              setSelectedRows(selectedRows);
            },
            getCheckboxProps: (record) => {
              return {
                disabled: record.status !== 1,
                name: record.batchNo!
              };
            }
          }}
          columns={tableColumnsFun(onOperate)}
        ></NewTableComponent>
        {dataSource.length > 0 && (
          <div className={'operationWrap'}>
            <Button
              type="primary"
              shape={'round'}
              ghost
              disabled={selectedRows.length === 0}
              onClick={() => {
                setVisible(true);
              }}
            >
              批量停用
            </Button>
          </div>
        )}
      </div>

      <NgModal title="批量停用" visible={visible} onCancel={() => setVisible(false)} onOk={() => onConfirmStop}>
        <p className="pa20">确定停用选中的群发任务？</p>
      </NgModal>
    </div>
  );
};

export default MessageStop;
