import { Button, Form, FormInstance, Radio, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { getUserGroup } from 'src/apis/marketing';
import UserGroupModal from '../ModalSetUserRight/UserGroupModal';
import UserOrgModal from '../ModalSetUserRight/UserOrgModal';

import { ViewStaffModal } from 'src/pages/OrgManage/UserGroup/components';
interface SetUserRightProps {
  onChange?: (groupId: string | undefined) => void;
  value?: string;
  form: FormInstance<any>;
}

export const SetUserRightFormItem: React.FC<SetUserRightProps> = ({ onChange, value, form }) => {
  const [originValues, setOriginValues] = useState<any>();
  const [visibleStaffList, setVisibleStaffList] = useState({
    visible: false,
    add: false
  });
  const [formValues, setFormValues] = useState<{ isSet: number; groupType: number; group1: any; group2: any }>({
    isSet: 0,
    groupType: 1,
    group1: undefined,
    group2: undefined
  });

  const getGroupDetail = async () => {
    if (!value) {
      return form.setFieldsValue({
        groupType: 1,
        isSet: 0,
        group1: undefined,
        group2: undefined
      });
    }
    const res = await getUserGroup({ groupId: value });
    const { groupType } = res;
    form.setFieldsValue({
      groupType,
      isSet: 1,
      group1: groupType === 1 ? { ...res.groupInfo, groupId: value } : undefined,
      group2: groupType === 2 ? { ...res.orgInfo, groupId: value } : undefined
    });
    setFormValues((formValues) => ({
      ...formValues,
      isSet: 1,
      groupType,
      group1: groupType === 1 ? { ...res.groupInfo, groupId: value } : undefined,
      group2: groupType === 2 ? { ...res.orgInfo, groupId: value } : undefined
    }));
    // 第一次的时候存储origin数据
    !originValues && setOriginValues({ ...res.groupInfo, groupId: value, ...res.orgInfo, groupType });
  };

  useEffect(() => {
    getGroupDetail();
  }, [value]);

  const onChangeWithGroupType = (groupType: number) => {
    setFormValues((formValues) => ({
      ...formValues,
      groupType
    }));
  };

  const staffCount = useMemo(() => {
    return formValues?.groupType === 1 ? formValues.group1?.staffNum || 0 : formValues.group2?.staffNum || 0;
  }, [formValues]);

  const handleModalChange = (value: any) => {
    onChange?.(value.groupId);
  };

  const onOpenChange = (isOpen: number) => {
    form.setFieldsValue({
      groupType: 1,
      group1: undefined,
      group12: undefined,
      groupId: undefined
    });
    setFormValues((formValues) => ({
      ...formValues,
      isSet: isOpen,
      groupType: 1
    }));
  };

  return (
    <>
      <Form.Item name={'isSet'}>
        <Radio.Group onChange={(e) => onOpenChange(e.target.value)}>
          <Radio value={0}>关闭</Radio>
          <Radio value={1}>开启</Radio>
        </Radio.Group>
      </Form.Item>
      {formValues.isSet
        ? (
        <>
          <Form.Item name={'groupType'}>
            <Radio.Group onChange={(e) => onChangeWithGroupType(e.target.value)}>
              <Radio value={1}>按照用户组选择</Radio>
              <Radio value={2}>按照组织架构选择</Radio>
            </Radio.Group>
          </Form.Item>
          {formValues.groupType === 1
            ? (
            <Form.Item name={'group1'} key="groupModal">
              <UserGroupModal onChange={handleModalChange} />
            </Form.Item>
              )
            : (
            <Form.Item name={'group2'} key="orgModal">
              <UserOrgModal onChange={handleModalChange} />
            </Form.Item>
              )}
          <Form.Item>
            上次选择的可见范围为：
            {originValues?.groupType === 1
              ? (
                  originValues?.groupName || '全部人员'
                )
              : (
              <>
                {originValues?.deptList?.map((item: any) => (
                  <Tag className="mb5" key={item.deptId}>
                    {item.deptName}
                  </Tag>
                ))}
                {originValues?.staffList?.map((item: any) => (
                  <Tag className="mb5" key={item.staffId}>
                    {item.staffName}
                  </Tag>
                ))}
                {!originValues?.deptList && !originValues?.staffList && '全部人员'}
              </>
                )}
          </Form.Item>
          <Form.Item>
            <span>
              截止目前时间：此用户组共计人数：
              {staffCount}人
            </span>
            {staffCount > 0 && (
              <Button
                type="link"
                onClick={() => setVisibleStaffList((visibleStaffList) => ({ ...visibleStaffList, visible: true }))}
              >
                查看人员
              </Button>
            )}
          </Form.Item>
        </>
          )
        : null}
      <ViewStaffModal
        modalParam={{
          visible: visibleStaffList.visible,
          add: false,
          filterId: value
        }}
        setModalParam={setVisibleStaffList}
      ></ViewStaffModal>
    </>
  );
};
