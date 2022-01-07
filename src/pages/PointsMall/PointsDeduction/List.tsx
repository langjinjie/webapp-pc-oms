import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Button, PaginationProps } from 'antd';
import { Icon, NgFormSearch, NgTable } from 'src/components';
import { searchCols, DeductProps, tableColumns } from './Config';
import { RouteComponentProps } from 'react-router-dom';
import { batchDeductIntegral, getWaitDeductPointsList } from 'src/apis/integral';
import { Moment } from 'moment';
import classNames from 'classnames';
import styles from './style.module.less';

const PointsDeduction: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('积分管理-积分扣减');
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<DeductProps[]>([]);
  const [formParams, setFormParams] = useState<{
    staffName: string;
    beginTime: null | number;
    endTime: null | number;
  }>({
    staffName: '',
    beginTime: null,
    endTime: null
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    setSelectRowKeys([]);
    setIsLoading(true);
    const res = await getWaitDeductPointsList({
      ...formParams,
      pageSize: 10,
      pageNum: 1,
      ...params
    });
    setIsLoading(false);
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, total }));
      setDataSource(list || []);
    }
  };

  const handleSearch = ({ staffName = '', time }: { staffName: string; time: [Moment, Moment] }) => {
    let beginTime!: number;
    let endTime!: number;
    if (time) {
      beginTime = time[0].startOf('day').valueOf();
      endTime = time[1].endOf('day').valueOf();
    }

    setFormParams({ staffName, beginTime, endTime });
    setPagination({ current: 1 });
    getList({ pageNum: 1, staffName, beginTime, endTime });
  };

  const onSelectChange = (selectedRowKeys: React.Key[], selectedRows: DeductProps[]) => {
    setSelectRowKeys(selectedRowKeys);
    console.log(selectedRows);
  };
  // 表格RowSelection配置项
  const rowSelection = {
    hideSelectAll: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DeductProps[]) => {
      onSelectChange(selectedRowKeys, selectedRows);
    },
    getCheckboxProps: (record: DeductProps) => {
      return {
        disabled: false,
        name: record.name
      };
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
    getList({ pageNum, pageSize });
  };

  const navigateToRecord = () => {
    history.push('/pointsDeduction/record');
  };

  const batchDeduct = async () => {
    console.log('扣减了呀');
    const res = await batchDeductIntegral({});
    console.log(res);
  };

  return (
    <div className="container">
      <div className="header flex justify-between">
        <NgFormSearch searchCols={searchCols} onSearch={handleSearch} />
        <div
          className={classNames('flex fixed color-text-regular pointer', styles.rightLink)}
          onClick={navigateToRecord}
        >
          <Icon className={styles.iconList} name="jifenshuoming" />
          <span>积分扣减记录</span>
        </div>
      </div>
      <div className="pt20">
        <NgTable
          columns={tableColumns()}
          loading={isLoading}
          rowSelection={rowSelection}
          pagination={pagination}
          dataSource={dataSource}
          paginationChange={onPaginationChange}
          setRowKey={(record: DeductProps) => {
            return record.deductId;
          }}
        />
        {dataSource.length > 0
          ? (
          <div className={'operationWrap'}>
            <Button type="primary" shape={'round'} ghost disabled={selectedRowKeys.length === 0} onClick={batchDeduct}>
              批量扣减
            </Button>
          </div>
            )
          : null}
      </div>
    </div>
  );
};
export default PointsDeduction;
