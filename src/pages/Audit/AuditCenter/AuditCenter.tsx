/**
 * @desc 审核列表
 */
import { message } from 'antd';
import { PaginationProps } from 'antd/es/pagination';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { cancelApplyAudit, getAuditApplyList } from 'src/apis/audit';
import { AuthBtn, NgFormSearch, NgTable } from 'src/components';
import OffLineModal from 'src/pages/Task/StrategyTask/components/OffLineModal/OffLineModal';
import { OperateType } from 'src/utils/interface';
import { AuditColumnsProp } from '../AuditList/AuditListConfig';
import { searchCols, TableColsFun } from './AuditCenterConfig';

const AuditList: React.FC<RouteComponentProps> = ({ history }) => {
  const [visible, setVisible] = useState(false);
  const [formValues, setFormValues] = useState<any>({});
  const [dataSource, setDataSource] = useState<AuditColumnsProp[]>([]);
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });
  const [current, setCurrent] = useState<AuditColumnsProp>();
  const getList = async (params?: any) => {
    const pageNum = params?.pageNum || pagination.current;
    const pageSize = params?.pageSize || pagination.pageSize;
    const res = await getAuditApplyList({
      ...formValues,
      ...params,
      pageNum,
      pageSize
    });
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, total, pageSize, current: pageNum }));
      setDataSource(list);
    }
    console.log(res);
  };
  useEffect(() => {
    getList();
  }, []);

  const onOperation = (operateType: OperateType, record: AuditColumnsProp) => {
    console.log(operateType);
    setCurrent(record);
    if (operateType === 'outline') {
      setVisible(true);
    } else if (operateType === 'view') {
      history.push('/audit/center/detail?applyId=' + record.applyId + '&isApply=1');
    }
  };

  const cancelApply = async () => {
    const res = await cancelApplyAudit({ applyId: current?.applyId as string });
    setVisible(false);
    if (res) {
      const currentIndex = dataSource.findIndex((item) => item.applyId === current?.applyId);
      const copyData = [...dataSource];
      copyData[currentIndex].status = 3;
      setDataSource(copyData);
      message.success('撤销成功！');
    }
  };

  const onSearch = (values: any) => {
    const {
      beginTime: applyBeginTime,
      endTime: applyEndTime,
      applyList,
      curHandlerList,
      applyType,
      approvalNo
    } = values;
    const params = {
      applyBeginTime,
      applyEndTime,
      applyType,
      approvalNo,
      applyList: applyList?.map((item: any) => ({ userid: item.userId })),
      curHandlerList: curHandlerList?.map((item: any) => ({ userid: item.userId }))
    };
    setFormValues(params);
    getList({ ...params, pageNum: 1 });
  };

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    getList({
      pageNum,
      pageSize
    });
  };
  return (
    <div className="container">
      <div>
        <AuthBtn path="/query">
          <NgFormSearch isInline={false} firstRowChildCount={3} searchCols={searchCols} onSearch={onSearch} />
        </AuthBtn>
      </div>
      <div className="mt15">
        <p className="color-danger">备注：如上级审批不通过后。需要重新发起申请，不可在原来的申请表进行修改</p>
        <NgTable
          columns={TableColsFun(onOperation)}
          dataSource={dataSource}
          pagination={pagination}
          rowKey={'applyId'}
          paginationChange={onPaginationChange}
        ></NgTable>
      </div>

      <OffLineModal visible={visible} content="确定撤销申请？" onCancel={() => setVisible(false)} onOK={cancelApply} />
    </div>
  );
};

export default AuditList;
