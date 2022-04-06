import Modal from 'src/components/Modal/Modal';
import React, { useState } from 'react';

import styles from './style.module.less';
import classNames from 'classnames';
import { Pagination } from 'antd';

interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
}
const DetailModal: React.FC<DetailModalProps> = ({ visible, onClose }) => {
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 8,
    current: 1
  });
  const handlePaginationChange = (page: number) => {
    setPagination((pagination) => ({ ...pagination, current: page }));
  };
  return (
    <Modal visible={visible} width={680} title="查看明细" className={styles.taskDetail} onClose={onClose}>
      <div className="listWrap  pb20">
        <ul className={classNames(styles.listTitle, 'flex align-center')}>
          <li className={classNames(styles.taskNo)}>序号</li>
          <li className={classNames(styles.name)}>客户经理姓名</li>
          <li className={classNames(styles.taskRes)}>执行结果</li>
        </ul>
        <div className={styles.listContent}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <ul key={item} className={classNames('flex align-center', styles.item)}>
              <li className={classNames(styles.taskNo)}>0{item}</li>
              <li className={classNames(styles.name)}>李斯（产研中心-研发部）</li>
              <li className={classNames(styles.taskRes)}>未群发</li>
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
