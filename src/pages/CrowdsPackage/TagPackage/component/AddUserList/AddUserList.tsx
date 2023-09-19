import React, { useMemo, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import { OrgTree } from 'src/components';
import { ClientListModal } from 'src/pages/CrowdsPackage/TagPackage/component';
import classNames from 'classnames';
import style from './style.module.less';

interface IAddUser {
  userId: string;
  userName: string;
  userType: number;
  deptName?: string;
}

interface ISelectStaffProps {
  value?: IAddUser[];
  onChange?: (value?: IAddUser[]) => void;
  readOnly?: boolean;
}

const AddUserList: React.FC<ISelectStaffProps> = ({ value, onChange, readOnly }) => {
  const [staffVisible, setStaffVisible] = useState(false); // 客户经理
  const [clientVisible, setClientVisible] = useState(false); // 客户经理
  const [userType, setUserType] = useState<number>(); // 用户类型（1-客户id；2-坐席）
  // 添加客户经理
  const addStaffHandle = () => {
    setStaffVisible(true);
    setUserType(2);
  };

  // 添加客户
  /* const addClientHandle = () => {
    setClientVisible(true);
    setUserType(1);
  }; */

  // onChange
  const staffOnChangeHandle = (staffValue?: any) => {
    onChange?.([
      ...(value?.filter(({ userType: valueUserType }) => userType !== valueUserType) || []),
      ...staffValue?.map(
        ({ staffId, staffName, deptName }: { staffId: string; staffName: string; deptName?: string }) => ({
          userId: staffId,
          userName: staffName,
          // deptName 方便查找该员工所在部门
          deptName,
          userType
        })
      )
    ]);
  };
  const clientOnChangeHandle = (clientValue?: any) => {
    onChange?.([
      ...(value?.filter(({ userType: valueUserType }) => userType !== valueUserType) || []),
      ...clientValue?.map(
        ({ detailId, externalUserid, nickName }: { detailId: string; externalUserid: string; nickName: string }) => ({
          userId: externalUserid,
          userName: nickName,
          userType,
          detailId
        })
      )
    ]);
  };

  const onCloseHandle = (user: IAddUser) => {
    onChange?.(value?.filter((valueItem) => valueItem.userId !== user.userId));
  };

  const formatValue = useMemo(() => {
    let newValue: any[] | undefined;
    // userType: 2-客户经理 1-客户
    if (userType === 2) {
      newValue = value
        ?.filter((filterItem) => filterItem.userType === userType)
        .map(({ userId, userName, deptName }) => ({ staffId: userId, staffName: userName, deptName }));
    } else {
      newValue = value
        ?.filter((filterItem) => filterItem.userType === userType)
        .map(({ userId, userName }) => ({ externalUserid: userId, nickName: userName }));
    }
    return newValue;
  }, [value, userType]);
  return (
    <div className={style.wrap}>
      <Space size={10}>
        {/* <Button
          ghost
          type="primary"
          shape="round"
          style={{ height: '32px' }}
          icon={<PlusOutlined />}
          // onClick={addHandle}
        >
          添加人群包
        </Button> */}
        <Button
          ghost
          type="primary"
          shape="round"
          disabled={readOnly}
          style={{ height: '32px' }}
          icon={<PlusOutlined />}
          onClick={addStaffHandle}
        >
          添加客户经理
        </Button>
        {/* <Button
          ghost
          type="primary"
          shape="round"
          disabled={readOnly}
          style={{ height: '32px' }}
          icon={<PlusOutlined />}
          onClick={addClientHandle}
        >
          新增客户
        </Button> */}
      </Space>

      <div className={classNames(style.selectedWrap, 'mt8')}>
        {value?.map((mapItem) => (
          <Tag
            className={style.tag}
            key={mapItem.userId}
            visible
            {...(readOnly ? { closable: false } : { closable: true })}
            onClose={() => onCloseHandle(mapItem)}
          >
            {mapItem.userName}
          </Tag>
        ))}
      </div>
      {/* 人群包列表 */}

      {/* 客户经理选择框 */}
      <OrgTree
        value={formatValue}
        visible={staffVisible}
        onCancel={() => setStaffVisible(false)}
        onChange={staffOnChangeHandle}
        selectedType="staff"
        isDeleted={0}
      />
      {/* 客户列表选择框 */}
      <ClientListModal
        value={formatValue}
        visible={clientVisible}
        onCancel={() => setClientVisible(false)}
        onChange={clientOnChangeHandle}
      />
    </div>
  );
};
export default AddUserList;
