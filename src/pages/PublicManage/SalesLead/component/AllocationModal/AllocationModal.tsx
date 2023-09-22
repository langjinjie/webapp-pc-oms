import React from 'react';
import { Modal } from 'src/components';
import { Form, Input } from 'antd';
import style from './style.module.less';
import { SelectOrg } from 'src/pages/CustomerManage/components';

interface IAllocationModalProps {
  value?: any;
  visible: boolean;
  onChange?: (value?: any) => void;
  title?: string;
  onClose: () => void;
  onOk: (val: { staffId: any; remark: string }) => Promise<any>;
}

const { Item } = Form;

const AllocationModal: React.FC<IAllocationModalProps> = ({ visible, title, onClose, onOk }) => {
  const [form] = Form.useForm();

  const onOkHandle = async () => {
    await form.validateFields();
    await onOk(form.getFieldsValue());
    form.resetFields();
  };

  console.log('销售线索分配渲染了');
  return (
    <Modal title={title || '销售线索分配'} visible={visible} className={style.wrap} onClose={onClose} onOk={onOkHandle}>
      <Form form={form}>
        <Item name="staffId" label="分配人员">
          <SelectOrg type="staff" singleChoice />
        </Item>
        <Item name="remark" label="分配备注">
          <Input placeholder="请输入" />
        </Item>
      </Form>
    </Modal>
  );
};
export default AllocationModal;
