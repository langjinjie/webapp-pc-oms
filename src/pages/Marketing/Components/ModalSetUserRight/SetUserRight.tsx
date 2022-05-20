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

export const SetUserRight: React.FC<SetUserRightProps> = ({ title, groupId, visible, onOk, ...props }) => {
  const [rightForm] = Form.useForm();
  const [visibleUserGroup, setVisibleUserGroup] = useState(true);
  const [groupInfo, setGroupInfo] = useState<any>({
    groupInfo: {},
    orgInfo: {}
  });

  const [formValues, setFormValues] = useState<{ isSet: number; groupType: number; group: any }>({
    isSet: 0,
    groupType: 1,
    group: ''
  });
  const handleSubmit = () => {
    rightForm.validateFields().then((values) => {
      const { group, isSet } = values;
      console.log({ group, isSet });
      onOk?.({ groupId: group?.groupId, isSet });
    });
  };
  const getGroup = async () => {
    if (groupId) {
      const res = await getUserGroup({ groupId });
      console.log(res);
      const { groupType } = res;
      rightForm.setFieldsValue({ groupType, isSet: 1, group: res.groupInfo });
      setFormValues((formValues) => ({ ...formValues, isSet: 1 }));
      setGroupInfo(res);
    }
  };
  useEffect(() => {
    getGroup();
  }, [groupId]);
  const onValuesChange = (values: any) => {
    const { isSet } = values;
    setFormValues((formValues) => ({ ...formValues, isSet }));
  };
  // const changeGroup = () => {
  //   console.log('修改分组');
  //   setVisibleUserGroup(true);
  // };
  const onUserGroupChange = (value: any) => {
    console.log(value);
  };
  return (
    <>
      <NgModal
        forceRender
        visible={visible}
        title={title || '修改可见范围'}
        width="570px"
        onOk={handleSubmit}
        {...props}
      >
        <Form
          form={rightForm}
          initialValues={formValues}
          onValuesChange={(_, values) => {
            onValuesChange(values);
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
                    <Radio value={2}>按照组织架构选择</Radio>
                    <Radio value={1}>按照用户组选择</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name={'group'}>
                  <UserGroupModal
                    onCancel={() => setVisibleUserGroup(false)}
                    onOk={() => setVisibleUserGroup(false)}
                    visible={visibleUserGroup}
                    onChange={onUserGroupChange}
                  />
                </Form.Item>
                <Form.Item>
                  上次选择的可见范围为：
                  {formValues.groupType === 1 ? groupInfo.groupInfo.groupName : groupInfo.orgInfo.staffNum}
                </Form.Item>
                <Form.Item>
                  <span>
                    截止目前时间：此用户组共计人数：
                    {formValues.groupType === 1 ? groupInfo.groupInfo.staffNum : groupInfo.orgInfo.staffNum}人
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
