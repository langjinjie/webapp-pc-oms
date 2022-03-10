import React, { useEffect, useState } from 'react';
import { TableColumns, TablePagination } from './Config';
import { IPointsProvideList } from 'src/utils/interface';
import { NgTable } from 'src/components';
import { requestGetLotteryScopeRecord } from 'src/apis/pointsMall';
import style from './style.module.less';

interface IPonitsList {
  total: number;
  list: IPointsProvideList[];
}

const List: React.FC = () => {
  const [provideList, setProvideList] = useState<IPonitsList>({ total: 0, list: [] });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [isLoading, setIsloading] = useState(true);

  const getPointsList = async () => {
    setIsloading(true);
    const res = await requestGetLotteryScopeRecord(paginationParam);
    if (res) {
      setProvideList({ total: res.total, list: res.list });
    }
    setIsloading(false);
  };
  useEffect(() => {
    getPointsList();
  }, [paginationParam]);
  return (
    <div className={style.wrap}>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.sendTime}
        dataSource={provideList.list}
        columns={TableColumns()}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          dataSource: provideList,
          paginationParam,
          setPaginationParam
        })}
      />
    </div>
  );
};
export default List;
