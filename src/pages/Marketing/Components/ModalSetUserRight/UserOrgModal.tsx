import { Button, Tag } from 'antd';
import React, { useState, useMemo } from 'react';
import { createSingleGroup } from 'src/apis/marketing';
import { NgModal, OrgTree } from 'src/components';
// import { OrganizationalTree } from 'src/pages/RoleManage/components';
import styles from './style.module.less';
interface UserGroupModalProps extends Omit<React.ComponentProps<typeof NgModal>, 'onOk'> {
  onChange?: (item: any) => void;
  value?: { groupType: number; [prop: string]: any };
  disabled?: boolean;
}
const UserOrgModal: React.FC<UserGroupModalProps> = ({ onChange, value: propValue, disabled }) => {
  const [visibleUserGroup, setVisibleUserGroup] = useState(false);
  const handleOnOK = async (values?: any[]) => {
    if (values) {
      const staffList: any[] = [];
      const deptList: any[] = [];
      values.forEach((item: any) => {
        if (item.staffId) {
          staffList.push({ staffId: item.staffId, staffName: item.staffName });
        } else {
          deptList.push({ deptId: item.deptId, deptName: item.deptName });
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

  const tagList = useMemo(() => {
    if (propValue) {
      return [...(propValue.staffList || []), ...(propValue?.deptList || [])];
    } else {
      return [];
    }
  }, [propValue]);

  return (
    <>
      {tagList.map((item: any, index: number) => {
        return (
          index < 3 && (
            <Tag className={styles.tag} key={index}>
              {item.staffName || item.deptName}
            </Tag>
          )
        );
      })}
      {tagList.length > 3 && <Tag title="点击修改可见范围可以查看全部人员">...</Tag>}

      <OrgTree
        showStaff
        visible={visibleUserGroup}
        value={tagList}
        onCancel={() => setVisibleUserGroup(false)}
        onOk={handleOnOK}
      />

      <Button shape="round" onClick={handleShowSelectModal} disabled={disabled}>
        修改可见范围
      </Button>
    </>
  );
};

export default UserOrgModal;
