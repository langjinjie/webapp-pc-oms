import React, { useEffect, useState } from 'react';
import { Button, Card } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns } from './Config';
import { IPagination } from 'src/utils/interface';
import style from './style.module.less';
import { useHistory } from 'react-router-dom';

const PrizeCenter: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });

  const history = useHistory();

  // 库存管理
  const inventoryManage = (row: any) => {
    console.log('row', row);
    history.push('/prizeCenter/inventoryManage');
  };

  const getList = (values?: any) => {
    const { current = 1, pageSize = 10 } = values || {};
    console.log('values', values);
    setList([{}]);
    setPagination({ current, pageSize, total: 1 });
  };

  const onFinish = (values?: any) => {
    console.log('values', values);
  };

  const paginationChange = (current: number, pageSize?: number) => {
    // 如果修改pageSize,需要从第一
    const pageNum = pageSize === pagination.pageSize ? current : 1;
    getList({ current: pageNum, pageSize });
  };

  useEffect(() => {
    getList();
  }, []);
  return (
    <Card className={style.wrap} title="奖品中心">
      <Button type="primary" shape="round" onClick={() => history.push('/prizeCenter/add')}>
        新增奖品
      </Button>
      <NgFormSearch className="mt20" searchCols={searchCols} onSearch={onFinish} />
      <NgTable
        className="mt10"
        columns={TableColumns({ inventoryManage })}
        dataSource={list}
        pagination={pagination}
        paginationChange={paginationChange}
      />
    </Card>
  );
};
export default PrizeCenter;
