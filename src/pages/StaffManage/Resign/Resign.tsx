/**
 * @desc 在职分配
 */
import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, PaginationProps, Popover } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffColumns, tableColumnsFun } from './Config';
import { RouteComponentProps } from 'react-router-dom';

const OnJob: React.FC<RouteComponentProps> = ({ history }) => {
  const [tableSource, setTableSource] = useState<Partial<StaffColumns>[]>([]);

  useEffect(() => {
    setTableSource([
      {
        key1: '张汇思',
        key2: '非车险拓客组',
        key3: '10',
        key4: '2022-04-11 11:40'
      },
      {
        key1: '齐向亮',
        key2: '非车险拓客组',
        key3: '10',
        key4: '2022-04-11 11:40'
      },
      {
        key1: '马力',
        key2: '非车险拓客组',
        key3: '3',
        key4: '2022-04-11 11:40'
      }
    ]);
  }, []);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const onSearch = () => {
    console.log('onSearch');
  };

  const jumpToDetail = () => {
    history.push('/resign/client');
  };

  const paginationChange = (pageSize: number) => {
    console.log();
    setPagination((pagination) => ({ ...pagination, pageSize }));
  };

  const CardTitle = () => {
    const content = (
      <>
        <p>客户拒绝分配后可进行二次分配</p>
      </>
    );
    return (
      <div>
        离职分配{' '}
        <Popover content={content}>
          <QuestionCircleOutlined className="color-text-secondary f16 pointer" />
        </Popover>
      </div>
    );
  };
  return (
    <Card className="container" title={<CardTitle />} bordered={false}>
      <NgFormSearch searchCols={searchCols} isInline onSearch={onSearch}></NgFormSearch>

      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: () => jumpToDetail()
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          setRowKey={(record: StaffColumns) => {
            return record.key1;
          }}
        />
      </div>
    </Card>
  );
};

export default OnJob;
