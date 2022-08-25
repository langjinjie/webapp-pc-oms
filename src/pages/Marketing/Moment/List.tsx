import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { batchDeleteMoment, getMomentList } from 'src/apis/marketing';
import { NgFormSearch, NgTable } from 'src/components';
import OffLineModal from 'src/pages/Task/StrategyTask/components/OffLineModal/OffLineModal';
import { MomentColumns, searchColsFun, tableColumnsFun } from './ListConfig';

type QueryParamsType = Partial<{
  name: string;
  tplType: string;
}>;
const MomentList: React.FC<RouteComponentProps> = ({ history }) => {
  const [queryParams, setQueryParams] = useState<QueryParamsType>({});
  const [visibleOfflineModal, setVisibleOfflineModal] = useState(false);
  const [tableSource, setTableSource] = useState<MomentColumns[]>([]);
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 100,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getMomentList({
      ...queryParams,
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      setTableSource(list);

      setPagination((pagination) => ({ ...pagination, total, pageSize, current: pageNum }));
    }
    setSelectRowKeys([]);
  };

  useEffect(() => {
    getList();
  }, []);

  const onSearch = (values: QueryParamsType) => {
    setQueryParams({ ...values });
    getList({ ...values, pageNum: 1 });
  };
  const onValuesChange = (changeValue: any, values: any) => {
    setQueryParams(values);
  };

  const paginationChange = (pageNum: number, pageSize?: number) => {
    getList({ pageNum, pageSize });
  };

  const navigatorToEdit = (query?: string) => {
    history.push('/marketingMoment/edit' + (query ? '?feedId=' + query : ''));
  };

  const editItem = (feedId: string) => {
    console.log('editItem');

    navigatorToEdit(feedId);
  };

  // 表格RowSelection配置项
  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: MomentColumns[]) => {
      setSelectRowKeys(selectedRowKeys);
      console.log(selectedRows);
    },
    getCheckboxProps: (record: MomentColumns) => {
      return {
        disabled: false,
        name: record.nodeName
      };
    }
  };

  const batchDelete = async () => {
    console.log('delete');
    const res = await batchDeleteMoment({ list: selectedRowKeys });
    if (res) {
      message.success('删除成功！');
      const filterData = tableSource.filter((item) => !selectedRowKeys.includes(item.feedId));
      setTableSource(filterData);
      setSelectRowKeys([]);
      setVisibleOfflineModal(false);
    }
  };

  return (
    <div className="container">
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        onClick={() => {
          navigatorToEdit();
        }}
        size="large"
      >
        创建
      </Button>
      <NgFormSearch className="mt20" searchCols={searchColsFun()} onSearch={onSearch} onValuesChange={onValuesChange} />

      <div className="mt20">
        <NgTable
          rowSelection={rowSelection}
          columns={tableColumnsFun({
            onOperate: editItem
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: MomentColumns) => {
            return record.feedId;
          }}
        />
      </div>
      <div className={'operationWrap'}>
        <Button
          type="primary"
          shape={'round'}
          ghost
          onClick={() => {
            if (selectedRowKeys.length > 0) {
              setVisibleOfflineModal(true);
            }
          }}
        >
          批量删除
        </Button>
      </div>

      <OffLineModal
        content="确定删除选中的内容？"
        visible={visibleOfflineModal}
        onCancel={() => setVisibleOfflineModal(false)}
        onOK={batchDelete}
      />
    </div>
  );
};

export default MomentList;
