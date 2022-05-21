import { Button, Form, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { getUserGroup } from 'src/apis/marketing';
import { NgModal } from 'src/components';
import UserGroupModal from './UserGroupModal';

interface SetUserRightProps extends Omit<React.ComponentProps<typeof NgModal>, 'onOk'> {
  title?: string;
  onOk: (values: any) => void;
  groupId?: string;
}

export const SetUserRight: React.FC<SetUserRightProps> = ({ title, groupId, visible, onOk, onCancel, ...props }) => {
  const [rightForm] = Form.useForm();

  const [formValues, setFormValues] = useState<{ isSet: number; groupType: number; group: any }>({
    isSet: 0,
    groupType: 1,
    group: {
      groupType: 1,
      info: {}
    }
  });
  const handleSubmit = () => {
    rightForm.validateFields().then((values) => {
      const { group, isSet } = values;
      console.log({ group, isSet });
      onOk?.({ groupId: group?.info.groupId, isSet });
    });
  };
  const getGroup = async () => {
    if (groupId) {
      const res = await getUserGroup({ groupId });
      const { groupType } = res;
      rightForm.setFieldsValue({
        groupType,
        isSet: 1,
        group: {
          groupType: groupType,
          info: { ...res.groupInfo, groupId, ...res.orgInfo }
        }
      });
      setFormValues((formValues) => ({
        ...formValues,
        isSet: 1,
        groupType,
        group: { groupType, info: { ...res.groupInfo, groupId, ...res.orgInfo } }
      }));
    }
  };
  useEffect(() => {
    getGroup();
  }, [groupId]);
  const onValuesChange = (changeValues: any, values: any) => {
    const { groupType = 1, isSet, group } = values;
    const groupRes = changeValues.groupType ? { info: {}, groupType } : { ...group, groupType };
    console.log('group: ', groupRes);
    setFormValues((formValues) => ({ ...formValues, isSet, group: groupRes }));
    rightForm.setFieldsValue({
      group: groupRes
    });
  };

  const handleCancel = (e: any) => {
    rightForm.resetFields();
    setFormValues({
      isSet: 0,
      groupType: 1,
      group: {
        groupType: 1
      }
    });
    onCancel?.(e);
  };

  return (
    <>
      <NgModal
        forceRender
        visible={visible}
        title={title || '修改可见范围'}
        width="570px"
        onOk={handleSubmit}
        onCancel={handleCancel}
        {...props}
      >
        <Form
          form={rightForm}
          initialValues={formValues}
          onValuesChange={(changeValues, values) => {
            onValuesChange(changeValues, values);
          }}
        >
          <Form.Item label="可见范围设置：" required>
            <Form.Item name={'isSet'}>
              <Radio.Group>
                <Radio value={0}>关闭</Radio>
                <Radio value={1}>开启</Radio>
              </Radio.Group>
            </Form.Item>
            {formValues.isSet
              ? (
              <>
                <Form.Item name={'groupType'}>
                  <Radio.Group>
                    <Radio value={1}>按照用户组选择</Radio>
                    <Radio value={2}>按照组织架构选择</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={'group'}>
                  <UserGroupModal />
                </Form.Item>
                <Form.Item>
                  上次选择的可见范围为：
                  {formValues.groupType === 1
                    ? formValues.group?.info?.groupInfo?.groupName
                    : formValues.group?.info?.orgInfo?.staffNum}
                </Form.Item>
                <Form.Item>
                  <span>
                    截止目前时间：此用户组共计人数：
                    {formValues.group?.info?.staffNum || 0}人
                  </span>
                  <Button type="link">查看人员</Button>
                </Form.Item>
              </>
                )
              : null}
          </Form.Item>
        </Form>
      </NgModal>
    </>
  );
};
