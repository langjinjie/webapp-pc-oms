import { Button, Tag } from 'antd';
import React, { useState } from 'react';
import { createSingleGroup } from 'src/apis/marketing';
import { NgModal } from 'src/components';
import { OrganizationalTree } from 'src/pages/RoleManage/components';

interface UserGroupModalProps extends Omit<React.ComponentProps<typeof NgModal>, 'onOk'> {
  onChange?: (item: any) => void;
  value?: { groupType: number; [prop: string]: any };
}
const UserOrgModal: React.FC<UserGroupModalProps> = ({ onChange, value: propValue }) => {
  const [visibleUserGroup, setVisibleUserGroup] = useState(false);

  const handleOnOK = async (values?: any[]) => {
    if (values) {
      const staffList: any[] = [];
      const deptList: any[] = [];
      values.forEach((item: any) => {
        if (item.staffId) {
          staffList.push({ staffId: item.staffId });
        } else {
          deptList.push({ deptId: item.deptId });
        }
      });
      const res = await createSingleGroup({ staffList, deptList });
      setVisibleUserGroup(false);
      return onChange?.({
        staffList,
        deptList,
        ...res
      });
    }
    setVisibleUserGroup(false);
  };

  const handleShowSelectModal = () => {
    setVisibleUserGroup(true);
  };
  return (
    <>
      {propValue?.deptList || propValue?.staffList
        ? (
        <>
          {propValue?.deptList?.map((item: any, index: number) => {
            return <Tag key={index}>{item.staffName || item.deptName}</Tag>;
          })}
          {propValue?.staffList?.map((item: any, index: number) => {
            return <Tag key={index}>{item.staffName || item.deptName}</Tag>;
          })}
        </>
          )
        : null}

      <OrganizationalTree
        showStaff
        params={{
          visible: visibleUserGroup
        }}
        onCancel={() => setVisibleUserGroup(false)}
        onOk={handleOnOK}
      />

      <Button shape="round" onClick={handleShowSelectModal}>
        修改可见范围
      </Button>
    </>
  );
};

export default UserOrgModal;
