import React, { useState, useEffect } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { PaginationProps } from 'antd';
import { Icon, NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffProps, tableColumns } from './Config';
import { getFreeStaffList } from 'src/apis/orgManage';
import { RouteComponentProps } from 'react-router-dom';
import ModalUpdatePoints from './Components/ModalUpdatePonits';

import styles from './style.module.less';
import classNames from 'classnames';
import { updateStaffPoints } from 'src/apis/integral';

const PointsDeduction: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('积分商城-积分扣减');
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<StaffProps[]>([]);
  const [adjustType, setAdjustType] = useState(1);
  const [formParams, setFormParams] = useState({
    staffName: ''
  });
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    showTotal: (total) => {
      return `共 ${total} 条记录`;
    }
  });

  const getList = async (params?: any) => {
    setIsLoading(true);
    const res = await getFreeStaffList({
      ...formParams,
      pageSize: 10,
      pageNum: 1,
      ...params
    });
    setIsLoading(false);
    if (res) {
      const { list, total } = res;
      setPagination((pagination) => ({ ...pagination, total }));
      setDataSource(list || []);
    }
  };

  const handleSearch = ({ staffName = '' }: { staffName: string }) => {
    setFormParams({ staffName });
    getList({ pageNum: 1, staffName });
  };

  useEffect(() => {
    getList();
  }, []);

  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    setPagination((pagination) => ({ ...pagination, current: pageNum, pageSize }));
    getList({ pageNum, pageSize });
  };

  const navigateToRecord = () => {
    history.push('/addSubPoints/record');
  };

  const addPoints = (staff: StaffProps) => {
    setModalTitle(`给${staff.staffName}增加积分`);
    setVisible(true);
    setAdjustType(1);

    console.log(staff);
  };

  const minusPoints = (staff: StaffProps) => {
    setModalTitle(`给${staff.staffName}扣减积分`);
    console.log(staff);
    setAdjustType(2);
    setVisible(true);
  };

  const confirmChangeStaffPoints = async (values: any) => {
    setVisible(false);
    const res = await updateStaffPoints({
      ...values,
      adjustType
    });
    console.log(res);
  };
  return (
    <div className="container">
      <div className="header flex justify-between">
        <NgFormSearch searchCols={searchCols} onSearch={handleSearch} />
        <div
          className={classNames('flex fixed color-text-regular pointer', styles.rightLink)}
          onClick={navigateToRecord}
        >
          <Icon className={styles.iconList} name="jifenshuoming" />
          <span>积分加减记录</span>
        </div>
      </div>
      <div className="pt20">
        <NgTable
          columns={tableColumns(addPoints, minusPoints)}
          loading={isLoading}
          pagination={pagination}
          dataSource={dataSource}
          paginationChange={onPaginationChange}
          setRowKey={(record: StaffProps) => {
            return record.staffId;
          }}
        />
      </div>

      <ModalUpdatePoints
        title={modalTitle}
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={(values) => confirmChangeStaffPoints(values)}
      />
    </div>
  );
};
export default PointsDeduction;
