import React from 'react';
import { Modal } from 'src/components';
import { Form, Input } from 'antd';
import style from './style.module.less';
import { SelectOrg } from 'src/pages/CustomerManage/components';

interface IAddModalProps {
  visible: boolean;
  onCancel: () => void;
}

const { Item } = Form;

const AddNotice: React.FC<IAddModalProps> = ({ visible, onCancel }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    onCancel?.();
  };

  const handleOk = async () => {
    const res = await form.validateFields();
    console.log('res', res);
  };

  return (
    <Modal className={style.wrap} title="添加通知人" visible={visible} onClose={handleCancel} onOk={handleOk}>
      <Form form={form}>
        <Item label="机构名称" className={style.item} name="机构名称">
          <Input className="width320" readOnly />
        </Item>
        <Item label="渠道代码" className={style.item} name="渠道代码">
          <Input className="width320" readOnly />
        </Item>
        <Item
          label="通知人1"
          className={style.item}
          name="通知人1"
          required
          rules={[{ required: true, message: '请选择通知人' }]}
        >
          <SelectOrg className="width320" type="staff" />
        </Item>
        <Item label="通知人2" className={style.item} name="通知人2">
          <SelectOrg className="width320" type="staff" />
        </Item>
      </Form>
    </Modal>
  );
};
export default AddNotice;
