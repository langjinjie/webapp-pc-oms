import React, { useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { NgFormSearch, NgTable } from 'src/components';
import { searchCols, TableColumns, IPrizeItem } from './Config';
import { IPagination } from 'src/utils/interface';
import { useHistory } from 'react-router-dom';
import { requestActivityPrizeList, requestPpDownActivityPrize } from 'src/apis/marketingActivity';
import style from './style.module.less';

const PrizeCenter: React.FC = () => {
  const [list, setList] = useState<IPrizeItem[]>([]);
  const [formVal, setFormVal] = useState<{ [key: string]: string }>({});
  const [pagination, setPagination] = useState<IPagination>({ current: 1, pageSize: 10, total: 0 });

  const history = useHistory();

  // 库存管理
  const inventoryManage = (row: IPrizeItem) => {
    history.push(`/prizeCenter/inventoryManage?goodsId=${row.goodsId}`);
  };

  // 上下架
  const upOrDown = async (row: IPrizeItem) => {
    const { status } = row;
    const res = await requestPpDownActivityPrize({ status: status ? 0 : 1 });
    if (res) {
      message.success(`奖品${status ? '下架' : '上架'}成功`);
    }
  };

  // 修改奖品
  const edit = (row: IPrizeItem) => {
    history.push(`/prizeCenter/add?goodsId=${row.goodsId}`);
  };

  const getList = async (values?: any) => {
    const { current = 1, pageSize = 10 } = values || {};
    const res = await requestActivityPrizeList({ ...values });
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination({ current, pageSize, total });
    }
    setList([{}]);
  };

  const onFinish = async (values?: any) => {
    console.log('values', values);
    await getList(values);
    setFormVal(values);
  };

  const paginationChange = (current: number, pageSize?: number) => {
    // 如果修改pageSize,需要从第一页重新获取
    const pageNum = pageSize === pagination.pageSize ? current : 1;
    getList({ ...formVal, current: pageNum, pageSize });
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
        columns={TableColumns({ inventoryManage, upOrDown, edit })}
        dataSource={list}
        pagination={pagination}
        paginationChange={paginationChange}
      />
    </Card>
  );
};
export default PrizeCenter;
