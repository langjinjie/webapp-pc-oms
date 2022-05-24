import { Button, Tag } from 'antd';
import React, { useState } from 'react';
import { NgModal } from 'src/components';
import UserGroup from 'src/pages/OrgManage/UserGroup/UserGroup';

interface UserGroupModalProps extends Omit<React.ComponentProps<typeof NgModal>, 'onOk'> {
  onChange?: (item: any) => void;
  value?: { groupType: number; [prop: string]: any };
}
const UserGroupModal: React.FC<UserGroupModalProps> = ({ onChange, value: propValue }) => {
  const [value, setValue] = useState<any>();
  const [visibleUserGroup, setVisibleUserGroup] = useState(false);

  const handleChange = (value: any) => {
    setValue(value);
  };
  const handleOnOK = async () => {
    onChange?.(value);
    setVisibleUserGroup(false);
  };

  const handleShowSelectModal = () => {
    setVisibleUserGroup(true);
  };
  return (
    <>
      {propValue?.groupName ? <Tag>{propValue.groupName}</Tag> : null}
      <NgModal
        width={'940px'}
        visible={visibleUserGroup}
        title="选择用户组"
        onCancel={() => setVisibleUserGroup(false)}
        onOk={() => handleOnOK()}
      >
        <UserGroup readonly={true} change={handleChange}></UserGroup>
      </NgModal>

      <Button shape="round" onClick={handleShowSelectModal}>
        修改可见范围
      </Button>
    </>
  );
};

export default UserGroupModal;
