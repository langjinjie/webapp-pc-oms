import React, { useState } from 'react';
import { useDocumentTitle } from 'src/utils/base';
import { Icon, NgFormSearch, NgTable } from 'src/components';
import { searchCols, StaffProps, tableColumns } from './Config';
import { RouteComponentProps } from 'react-router-dom';
import ModalUpdatePoints from './Components/ModalUpdatePonits';

import styles from './style.module.less';
import classNames from 'classnames';
import { updateStaffPoints, searchStaffWithPointsUpdate } from 'src/apis/integral';
import { message } from 'antd';

const PointsDeduction: React.FC<RouteComponentProps> = ({ history }) => {
  useDocumentTitle('积分商城-积分扣减');
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState<StaffProps[]>([]);
  const [adjustType, setAdjustType] = useState(1);
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [currentStaff, setCurrentStaff] = useState<StaffProps | null>();

  const handleSearch = async ({ staffName = '' }: { staffName: string }) => {
    setIsLoading(true);
    const res = await searchStaffWithPointsUpdate({
      staffName
    });
    setIsLoading(false);
    if (res) {
      setDataSource(res || []);
    }
  };

  const navigateToRecord = () => {
    history.push('/addSubPoints/record');
  };

  const addPoints = (staff: StaffProps) => {
    setModalTitle(`给${staff.staffName}增加积分`);
    setVisible(true);
    setAdjustType(1);
    setCurrentStaff(staff);
  };

  const minusPoints = (staff: StaffProps) => {
    setModalTitle(`给${staff.staffName}扣减积分`);
    setAdjustType(2);
    setVisible(true);
    setCurrentStaff(staff);
  };

  const confirmChangeStaffPoints = async (values: any) => {
    setVisible(false);
    const res = await updateStaffPoints({
      ...values,
      adjustType,
      staffId: currentStaff?.staffId
    });
    if (res) {
      message.success(adjustType === 1 ? '增加成功' : '扣减成功');
    }
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
          pagination={undefined}
          dataSource={dataSource}
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
