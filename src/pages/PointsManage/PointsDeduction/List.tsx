import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Button, message, PaginationProps } from 'antd';
import { AuthBtn, Icon, NgFormSearch, NgTable } from 'src/components';
import { searchCols, DeductProps, tableColumns } from './Config';
import { RouteComponentProps } from 'react-router-dom';
import { batchDeductIntegral, getWaitDeductPointsList } from 'src/apis/integral';
import classNames from 'classnames';
import styles from './style.module.less';
import { NgModal } from 'src/components/NgModal/NgModal';

const PointsDeduction: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('积分管理-积分扣减');
  const [selectedRowKeys, setSelectRowKeys] = useState<React.Key[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<DeductProps[]>([]);
  const [visible, setVisible] = useState(false);
  const [formParams, setFormParams] = useState<{
    staffName: string;
    type: number;
    beginTime: null | string;
    endTime: null | string;
  }>({
    type: 1,
    staffName: '',
    beginTime: null,
    endTime: null
  });
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: 10,
    showTotal: (total: number) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    setSelectRowKeys([]);
    setIsLoading(true);
    const res = await getWaitDeductPointsList({
      ...formParams,
      pageSize: pagination.pageSize,
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

  const handleSearch = (values: any) => {
    setFormParams((formParams) => ({ ...formParams, ...values }));
    setPagination((pagination) => ({ ...pagination, current: 1 }));
    getList({ pageNum: 1, ...values });
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

  const batchDeduct = async (record?: DeductProps) => {
    if (record) {
      const [...copyData] = [...dataSource];
      const res = await batchDeductIntegral({ deductId: [record.deductId] });
      if (res) {
        message.success('扣减成功');
        const index = dataSource.indexOf(record);
        copyData.splice(index, 1);
        if (copyData.length === 0) {
          getList({ pageNum: pagination.current! - 1 || 1 });
        }
        setPagination((pagination) => ({ ...pagination, total: pagination.total! - 1 || 0 }));
        setDataSource(copyData);
      }
    } else {
      const res = await batchDeductIntegral({ deductId: selectedRowKeys });
      if (res) {
        message.success('扣减成功');
        const data = dataSource.filter((item) => !selectedRowKeys.includes(item.deductId));
        setDataSource(data);
        if (data.length === 0) {
          getList({ pageNum: pagination.current! - 1 || 1 });
        }
        setPagination((pagination) => ({ ...pagination, total: pagination.total! - selectedRowKeys.length }));
      }
    }
  };

  return (
    <div className="container">
      <div className="header flex justify-between">
        <AuthBtn path="/query">
          <NgFormSearch searchCols={searchCols} onSearch={handleSearch} />
        </AuthBtn>
        <AuthBtn path="/view">
          <div
            className={classNames('flex fixed color-text-regular pointer', styles.rightLink)}
            onClick={navigateToRecord}
          >
            <Icon className={styles.iconList} name="jifenshuoming" />
            <span>积分扣减记录</span>
          </div>
        </AuthBtn>
      </div>
      <div className="pt20">
        <NgTable
          columns={tableColumns(batchDeduct)}
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
          <AuthBtn path="/editBatch">
            <div className={'operationWrap'}>
              <Button
                type="primary"
                shape={'round'}
                ghost
                disabled={selectedRowKeys.length === 0}
                onClick={() => setVisible(true)}
              >
                批量扣减
              </Button>
            </div>
          </AuthBtn>
            )
          : null}
      </div>
      <NgModal
        visible={visible}
        title="扣减提醒"
        onCancel={() => setVisible(false)}
        onOk={() => {
          batchDeduct();
          setVisible(false);
        }}
      >
        <p className="text-center">积分扣减提醒，是否确定扣减选中的积分？</p>
      </NgModal>
    </div>
  );
};
export default PointsDeduction;
