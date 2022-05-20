import { Button, Tag } from 'antd';
import React, { useState } from 'react';
import { NgModal } from 'src/components';
import UserGroup from 'src/pages/OrgManage/UserGroup/UserGroup';

interface UserGroupModalProps extends Omit<React.ComponentProps<typeof NgModal>, 'onOk'> {
  onOk: () => void;
  onChange?: (item: any) => void;
}
const UserGroupModal: React.FC<UserGroupModalProps> = ({ onOk, onChange }) => {
  const [value, setValue] = useState<any>();
  const [visibleUserGroup, setVisibleUserGroup] = useState(false);
  const handleChange = (value: any) => {
    console.log(value);
    setValue(value);
  };
  const handleOnOK = () => {
    onChange?.(value);
    setVisibleUserGroup(false);
    onOk();
  };
  return (
    <>
      {value ? <Tag>{value.groupName}</Tag> : null}
      <NgModal width={'940px'} visible={visibleUserGroup} title="选择用户组" onOk={handleOnOK}>
        <UserGroup change={handleChange}></UserGroup>
      </NgModal>
      <Button shape="round" onClick={() => setVisibleUserGroup(true)}>
        修改可见范围
      </Button>
    </>
  );
};

export default UserGroupModal;
