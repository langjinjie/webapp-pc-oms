import { Button, Tag } from 'antd';
import React, { useState } from 'react';
import { createSingleGroup } from 'src/apis/marketing';
import { NgModal } from 'src/components';
import UserGroup from 'src/pages/OrgManage/UserGroup/UserGroup';
import { OrganizationalTree } from 'src/pages/RoleManage/components';

interface UserGroupModalProps extends Omit<React.ComponentProps<typeof NgModal>, 'onOk'> {
  onOk: () => void;
  onChange?: (item: any) => void;
  groupType: number;
}
const UserGroupModal: React.FC<UserGroupModalProps> = ({ onOk, onChange, groupType }) => {
  const [value, setValue] = useState<any>();
  const [visibleUserGroup, setVisibleUserGroup] = useState(false);
  const handleChange = (value: any) => {
    console.log(value);
    setValue(value);
  };
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
      console.log(res);
      setVisibleUserGroup(false);
      onOk();
      return onChange?.(res);
    }

    onChange?.(value);
    setVisibleUserGroup(false);
    onOk();
  };
  return (
    <>
      {value ? <Tag>{value.groupName}</Tag> : null}
      {groupType === 1
        ? (
        <NgModal width={'940px'} visible={visibleUserGroup} title="选择用户组" onOk={() => handleOnOK()}>
          <UserGroup change={handleChange}></UserGroup>
        </NgModal>
          )
        : (
        <OrganizationalTree
          showStaff
          params={{
            visible: visibleUserGroup
          }}
          onCancel={() => setVisibleUserGroup(false)}
          onOk={handleOnOK}
          onChange={handleChange}
        />
          )}
      <Button shape="round" onClick={() => setVisibleUserGroup(true)}>
        修改可见范围
      </Button>
    </>
  );
};

export default UserGroupModal;
