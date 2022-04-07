import React, { useEffect, useState } from 'react';
import { Modal, NgTable } from 'src/components';

import { TableColumns, TablePagination } from './Config';
import style from './style.module.less';

interface ITaskDetailProps {
  visible: boolean;
  onClose: () => void;
}

interface IDetail {
  total: number;
  list: any[];
}

const TaskDetail: React.FC<ITaskDetailProps> = ({ visible, onClose }) => {
  const [detail, setDetail] = useState<IDetail>({ total: 0, list: [] });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 10 });
  const [isLoading, setIsloading] = useState(false);
  const getDetail = () => {
    setIsloading(true);
    const list = [
      { index: '01', staffName: '李斯', status: 0 },
      { index: '02', staffName: '李斯', status: 1 },
      { index: '03', staffName: '李斯', status: 0 },
      { index: '04', staffName: '李斯', status: 1 },
      { index: '05', staffName: '李斯', status: 0 },
      { index: '06', staffName: '李斯', status: 1 },
      { index: '07', staffName: '李斯', status: 0 },
      { index: '08', staffName: '李斯', status: 1 },
      { index: '09', staffName: '李斯', status: 0 }
    ];
    setTimeout(() => {
      setDetail({ total: 99, list });
      setIsloading(false);
    }, 1000);
  };
  const onCloseHandle = () => {
    onClose();
  };
  useEffect(() => {
    visible && getDetail();
  }, [visible]);
  return (
    <Modal centered width={680} visible={visible} title="查看明细" className={style.wrap} onClose={onCloseHandle}>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.summaryId}
        dataSource={detail.list}
        columns={TableColumns()}
        loading={isLoading}
        scroll={{ x: 'max-content' }}
        {...TablePagination({
          dataSource: detail,
          paginationParam,
          setPaginationParam
        })}
      />
    </Modal>
  );
};
export default TaskDetail;
