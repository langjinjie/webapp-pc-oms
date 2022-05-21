import { Button, Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { createSingleGroup } from 'src/apis/marketing';
import { NgModal } from 'src/components';
import UserGroup from 'src/pages/OrgManage/UserGroup/UserGroup';
import { OrganizationalTree } from 'src/pages/RoleManage/components';

interface UserGroupModalProps extends Omit<React.ComponentProps<typeof NgModal>, 'onOk'> {
  onChange?: (item: any) => void;
  value?: { groupType: number; [prop: string]: any };
}
const UserGroupModal: React.FC<UserGroupModalProps> = ({ onChange, value: propValue }) => {
  console.log({ propValue });
  const [value, setValue] = useState<any>();
  const [visibleUserGroup, setVisibleUserGroup] = useState(false);
  useMemo(() => {
    setValue(null);
  }, [propValue?.groupType]);

  const handleChange = (value: any) => {
    setValue({
      groupType: propValue?.groupType,
      info: value
    });
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
      setVisibleUserGroup(false);
      return onChange?.({
        groupType: propValue?.groupType,
        info: { orgInfo: values, ...res }
      });
    }
    onChange?.(value);
    setVisibleUserGroup(false);
  };

  const handleShowSelectModal = () => {
    setVisibleUserGroup(true);
  };
  return (
    <>
      {propValue?.groupType === 1 && value?.info?.groupName ? <Tag>{value.info.groupName}</Tag> : null}
      {propValue?.groupType === 2 && value?.info && value.info.length > 0
        ? (
        <>
          {value?.info?.map((item: any, index: number) => {
            return <Tag key={index}>{item.staffName || item.deptName}</Tag>;
          })}
        </>
          )
        : null}
      {propValue?.groupType === 1
        ? (
        <NgModal
          width={'940px'}
          visible={visibleUserGroup}
          title="选择用户组"
          onCancel={() => setVisibleUserGroup(false)}
          onOk={() => handleOnOK()}
        >
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
      <Button shape="round" onClick={handleShowSelectModal}>
        修改可见范围
      </Button>
    </>
  );
};

export default UserGroupModal;
