import { Form, Select } from 'antd';
import React, { useEffect } from 'react';
import { searchStaffList } from 'src/apis/orgManage';
import DebounceSelect from '../DebounceSelect/DebounceSelect';
import { NgModal } from '../NgModal/NgModal';

interface AddStatisticsFreeModalProps {
  visible: boolean;
  onConfirm: (params: { staffIds: string[]; freeType: string }) => void;
  onCancel: () => void;
}

interface UserValue {
  label: string;
  value: string;
}

export const AddStatisticsFreeModal: React.FC<AddStatisticsFreeModalProps> = ({ visible, onConfirm, onCancel }) => {
  const [addForm] = Form.useForm();
  async function fetchUserList (username: string): Promise<UserValue[]> {
    const res = await searchStaffList({ keyWords: username, searchType: 2, isDeleted: false });
    if (res) {
      const { staffList } = res;
      return staffList.map((staff: { staffName: string; staffId: string; userId: string }) => ({
        label: staff.staffName + `(${staff.userId})`,
        value: staff.staffId,
        key: staff.staffId
      }));
    } else {
      return [];
    }
  }

  const handleOK = () => {
    addForm
      .validateFields()
      .then((values) => {
        console.log(values);
        const { userIds = [], freeType = [] } = values;
        onConfirm({
          staffIds: userIds.map((item: any) => item.value),
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
      <Form layout="vertical" form={addForm} style={{ marginBottom: '40px' }}>
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
            <Select.Option value={3}>抽奖黑名单</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </NgModal>
  );
};
