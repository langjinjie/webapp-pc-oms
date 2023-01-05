import React, { useEffect, useState } from 'react';
import { BreadCrumbs, NgFormSearch, NgTable } from 'src/components';
import { searchCols, tableColumnsFun } from './Config';
import { requestGetPointsConfigLogList } from 'src/apis/pointsMall';
import { IRecord } from 'src/pages/PointsManage/PointsConfig/Record/Config';
import style from './style.module.less';

interface IFormValue {
  taskType?: number;
  beginTime?: string;
  endTime?: string;
  taskName?: string;
}

const Record: React.FC = () => {
  const [list, setList] = useState<IRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState<IFormValue>({});
  const [pagination, setPagination] = useState<{ total: number; current: number; pageSize: number }>({
    total: 0,
    current: 1,
    pageSize: 10
  });
  const getList = async (values: any) => {
    setLoading(true);
    const res = await requestGetPointsConfigLogList({ ...values, configType: 3 });
    if (res) {
      const { total, list } = res;
      setList(list);
      setPagination((param) => ({ ...param, total }));
    }
    setLoading(false);
  };
  const onSearchHandle = async (values: any) => {
    const { taskName, taskType, taskTime } = values;
    let beginTime = '';
    let endTime = '';
    // 处理时间参数
    if (taskTime) {
      beginTime = taskTime[0].startOf('days').format('YYYY-MM-DD HH:mm:ss');
      endTime = taskTime[1].endOf('days').format('YYYY-MM-DD HH:mm:ss');
    }
    setPagination((param) => ({ ...param, current: 1 }));
    getList({ taskName, taskType, beginTime, endTime });
    setFormValue({ taskName, taskType, beginTime, endTime });
  };
  // 分页修改
  const paginationOnChange = (current: number, pageSize?: number) => {
    setPagination((param) => ({ ...param, current, pageSize: pageSize as number }));
    getList({ ...formValue, pageNum: current, pageSize });
  };
  useEffect(() => {
    getList({});
  }, []);
  return (
    <div className={style.wrap}>
      <div className={style.breadCrumbsWrap}>
        <BreadCrumbs
          navList={[
            { path: '/newerPoints', name: '新人任务' },
            { path: '', name: '操作记录' }
          ]}
        />
      </div>
      <NgFormSearch searchCols={searchCols} onSearch={onSearchHandle} />
      <NgTable
        loading={loading}
        dataSource={list}
        columns={tableColumnsFun()}
        scroll={{ x: 'max-content' }}
        rowKey={(record: IRecord) => record.logId}
        pagination={pagination}
        paginationChange={paginationOnChange}
      />
    </div>
  );
};
export default Record;
