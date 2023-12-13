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
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const getList = async (values?: any) => {
    setLoading(true);
    const { pageNum = 1, pageSize = 10 } = values || {};
    const res = await requestActivityPrizeList({ ...values }).finally(() => setLoading(false));
    if (res) {
      const { list, total } = res;
      setList(list || []);
      setPagination({ current: pageNum, pageSize, total });
    }
  };

  // 库存管理
  const inventoryManage = ({ goodsId, goodsName }: IPrizeItem) => {
    history.push(`/prizeCenter/inventoryManage?goodsId=${goodsId}&goodsName=${goodsName}`);
  };

  // 上下架
  const upOrDown = async (row: IPrizeItem) => {
    const { status, goodsId } = row;
    const res = await requestPpDownActivityPrize({ status: status ? 0 : 1, goodsId });
    if (res) {
      getList({ ...formVal, pageNum: pagination.current, pageSize: pagination.pageSize });
      message.success(`奖品${status ? '下架' : '上架'}成功`);
    }
  };

  // 修改奖品
  const edit = ({ goodsId }: IPrizeItem) => {
    history.push(`/prizeCenter/add?goodsId=${goodsId}`);
  };

  const onFinish = async (values?: any) => {
    console.log('values', values);
    await getList(values);
    setFormVal(values);
  };

  const paginationChange = (current: number, pageSize?: number) => {
    // 如果修改pageSize,需要从第一页重新获取
    const pageNum = pageSize === pagination.pageSize ? current : 1;
    getList({ ...formVal, pageNum, pageSize });
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
        rowKey="goodsId"
        columns={TableColumns({ inventoryManage, upOrDown, edit })}
        loading={loading}
        dataSource={list}
        scroll={{ x: 'max-content' }}
        pagination={pagination}
        paginationChange={paginationChange}
      />
    </Card>
  );
};
export default PrizeCenter;
