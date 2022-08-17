/**
 * @desc 在职分配
 */
import React, { useEffect, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Card, PaginationProps, Popover, Button } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffColumns, tableColumnsFun } from './Config';
import { RouteComponentProps } from 'react-router-dom';
import style from './style.module.less';
import classNames from 'classnames';

const OnJob: React.FC<RouteComponentProps> = ({ history }) => {
  const [tableSource, setTableSource] = useState<Partial<StaffColumns>[]>([]);

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
    history.push('/onjob/client');
  };

  const paginationChange = (pageSize: number) => {
    console.log();
    setPagination((pagination) => ({ ...pagination, pageSize }));
  };

  // 选择框配置对象
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Partial<StaffColumns>[]) => {
      console.log('selectedRowKeys', selectedRowKeys);
      console.log('selectedRows', selectedRows);
    }
  };

  const CardTitle = () => {
    const content = (
      <>
        <p>1.客户继承成功后原员工无法再与客户间发起会话</p>
        <p>2.客户继承成功后90天内最多可支持二次继承</p>
      </>
    );
    return (
      <div>
        在职继承
        <Popover content={content}>
          <QuestionCircleOutlined className="color-text-secondary f16 pointer" />
        </Popover>
      </div>
    );
  };
  useEffect(() => {
    setTableSource([
      {
        key1: '李思思',
        key2: '非车险拓客组',
        key3: '12',
        key4: '是'
      },
      {
        key1: '颜武晨',
        key2: '非车险拓客组',
        key3: '10',
        key4: '是'
      },
      {
        key1: '陶黛晓',
        key2: '非车险拓客组',
        key3: '3',
        key4: '是'
      }
    ]);
  }, []);
  return (
    <Card className="container" title={<CardTitle />} bordered={false}>
      <NgFormSearch searchCols={searchCols} isInline={false} firstRowChildCount={4} onSearch={onSearch}></NgFormSearch>
      <div className={'mt20'}>
        <Button className={style.distribution} type="primary">
          分配客户
        </Button>
        <Button className={classNames(style.distributeLog, 'ml20')}>分配记录</Button>
        <span className={classNames(style.selectNum, 'inline-block')}>
          *共计5000位待分配客户，<span className={style.selected}>已选择54位</span>
        </span>
      </div>
      <div className="mt20">
        <NgTable
          columns={tableColumnsFun({
            onOperate: () => jumpToDetail()
          })}
          dataSource={tableSource}
          pagination={pagination}
          paginationChange={paginationChange}
          rowSelection={rowSelection}
          setRowKey={(record: StaffColumns) => {
            return record.key1;
          }}
        />
      </div>
    </Card>
  );
};

export default OnJob;
