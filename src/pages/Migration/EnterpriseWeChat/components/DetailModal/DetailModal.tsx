import Modal from 'src/components/Modal/Modal';
import React, { useEffect, useState } from 'react';
import { requestGetTaskStaffDetail } from 'src/apis/migration';
import styles from './style.module.less';
import classNames from 'classnames';
import { Pagination } from 'antd';

interface DetailModalProps {
  taskId: string;
  visible: boolean;
  onClose: () => void;
}

interface IStaffList {
  deptName: string;
  execStatus: number;
  staffName: string;
}
const DetailModal: React.FC<DetailModalProps> = ({ taskId, visible, onClose }) => {
  const [staffList, setStaffList] = useState<IStaffList[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 8,
    current: 1
  });
  // 查询群发任务员工明细
  const getStaffList = async () => {
    const res = await requestGetTaskStaffDetail({ taskId, pageNum: pagination.current, pageSize: pagination.pageSize });
    if (res) {
      setStaffList(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
  };
  const handlePaginationChange = (page: number) => {
    setPagination((pagination) => ({ ...pagination, current: page }));
  };
  useEffect(() => {
    if (visible) {
      getStaffList();
    }
  }, [pagination.current, visible]);
  return (
    <Modal centered visible={visible} width={680} title="查看明细" className={styles.taskDetail} onClose={onClose}>
      <div className="listWrap  pb20">
        <ul className={classNames(styles.listTitle, 'flex align-center')}>
          <li className={classNames(styles.taskNo)}>序号</li>
          <li className={classNames(styles.name)}>客户经理姓名</li>
          <li className={classNames(styles.taskRes)}>执行结果</li>
        </ul>
        <div className={styles.listContent}>
          {staffList.map((item, index) => (
            <ul key={item.staffName + index} className={classNames('flex align-center', styles.item)}>
              <li className={classNames(styles.taskNo)}>{index + 1 < 10 ? '0' + (index + 1) : index + 1}</li>
              <li className={classNames(styles.name)}>{item.staffName}</li>
              <li className={classNames(styles.taskRes)}>{item.execStatus ? '已群发' : '未群发'}</li>
            </ul>
          ))}
        </div>
      </div>
      <Pagination
        className={'flex justify-center'}
        simple
        defaultCurrent={2}
        {...pagination}
        onChange={(page) => handlePaginationChange(page)}
      />
    </Modal>
  );
};

export default DetailModal;
