import { Form, Select } from 'antd';
import React, { useEffect } from 'react';
import DebounceSelect from '../DebounceSelect/DebounceSelect';
import { NgModal } from '../NgModal/NgModal';

interface AddStatisticsFreeModalProps {
  visible: boolean;
  onConfirm: (params: { userIds: string[]; freeType: string }) => void;
  onCancel: () => void;
}

interface UserValue {
  label: string;
  value: string;
}

export const AddStatisticsFreeModal: React.FC<AddStatisticsFreeModalProps> = ({ visible, onConfirm, onCancel }) => {
  const [addForm] = Form.useForm();
  async function fetchUserList (username: string): Promise<UserValue[]> {
    console.log('fetching user', username);

    return fetch('https://randomuser.me/api/?results=5')
      .then((response) => response.json())
      .then((body) =>
        body.results.map(
          (user: { name: { first: string; last: string }; login: { username: string } }, index: number) => ({
            label: `${user.name.first} (${user.name.last})`,
            value: user.login.username,
            key: index
          })
        )
      );
  }

  const handleOK = () => {
    addForm
      .validateFields()
      .then((values) => {
        const { userIds = [], freeType = [] } = values;
        onConfirm({
          userIds: userIds.map((item: any) => item.id),
          freeType: freeType.join(',')
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // 每次显示时清空form表单
    if (visible) {
      addForm.resetFields();
    }
  }, [visible]);

  return (
    <NgModal forceRender={true} visible={visible} title="新增免统计名单" onOk={handleOK} onCancel={onCancel}>
      <Form layout="vertical" form={addForm}>
        <Form.Item label="员工姓名" name={'userIds'} rules={[{ required: true }]}>
          <DebounceSelect
            placeholder="请输入员工姓名进行查询"
            mode="multiple"
            style={{ width: '100%' }}
            fetchOptions={fetchUserList}
          />
        </Form.Item>
        <Form.Item
          name={'freeType'}
          rules={[{ required: true }]}
          label="免统计模块"
          extra={'如当前员工已存在免统计模块，更新后会覆盖原有免统计模块'}
        >
          <Select mode="multiple" placeholder="请选择免统计模块">
            <Select.Option value={1}>排行榜</Select.Option>
            <Select.Option value={2}>战报</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </NgModal>
  );
};
