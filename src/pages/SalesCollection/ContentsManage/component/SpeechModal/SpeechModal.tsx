import React, { useEffect, useState } from 'react';
import { Modal, NgTable } from 'src/components';
import { getSpeechList } from 'src/apis/salesCollection';
import { columns, SpeechProps } from './Config';
import style from './style.module.less';

interface ISpeechModalProps {
  visible: boolean;
  title?: string;
  catalogId?: string;
  onClose?: () => void;
}

const SpeechModal: React.FC<ISpeechModalProps> = ({ visible, title, catalogId, onClose }) => {
  const [dataSource, setDataSource] = useState<SpeechProps[]>([]);
  const [pagination, setPagination] = useState<{ current: number; pageSize: number; total: number; simple: boolean }>({
    current: 1,
    pageSize: 10,
    total: 0,
    simple: true
  });

  // 重置
  const onResetHandle = () => {
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0,
      simple: true
    });
    setDataSource([]);
  };

  // 获取话术列表
  const getSpeechListHandle = async (param?: { pageNum: number; pageSize: number }) => {
    const { pageNum = pagination.current, pageSize = pagination.pageSize } = param || {};
    const res = await getSpeechList({ catalogId, queryMain: 1, pageNum, pageSize });
    if (res) {
      setDataSource(res.list);
      setPagination((pagination) => ({ ...pagination, total: res.total }));
    }
  };

  // 分页操作
  const paginationChangeHandle = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize: pageSize as number }));
    getSpeechListHandle({ pageNum, pageSize: pageSize as number });
  };

  const onCloseHandle = () => {
    onClose?.();
  };
  useEffect(() => {
    if (visible) {
      getSpeechListHandle();
    } else {
      onResetHandle();
    }
  }, [visible]);
  return (
    <Modal
      centered
      title={title || '查看话术'}
      visible={visible}
      width={808}
      onClose={onCloseHandle}
      className={style.wrap}
    >
      <NgTable
        scroll={{ x: 'max-content' }}
        dataSource={dataSource}
        columns={columns()}
        paginationChange={paginationChangeHandle}
        pagination={pagination}
      />
    </Modal>
  );
};
export default SpeechModal;
