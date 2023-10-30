import React, { useEffect } from 'react';
import { Modal } from 'src/components';
import { Form, Input } from 'antd';
import style from './style.module.less';

interface IAddModalProps {
  value?: any;
  visible: boolean;
  title?: string;
  onClose: () => void;
  onOk?: (values?: { [key: string]: any }) => Promise<any>;
}

const { Item } = Form;

const AddModal: React.FC<IAddModalProps> = ({ value, visible, title, onClose, onOk }) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    const res = await form.validateFields();
    console.log('res', res);
    await onOk?.(res);
    handleCancel();
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(value);
    }
  }, [visible]);

  return (
    <Modal
      title={title || '新增机构渠道'}
      onClose={handleCancel}
      centered
      visible={visible}
      className={style.modalWrap}
      onOk={handleOk}
    >
      <Form form={form}>
        <Item
          label="机构名称"
          className={style.item}
          name="机构名称"
          required
          rules={[{ required: true, message: '请输入机构名称' }]}
        >
          <Input className="width320" />
        </Item>
        <Item
          label="渠道代码"
          className={style.item}
          name="渠道代码"
          required
          rules={[{ required: true, message: '请输入机构代码' }]}
        >
          <Input className="width320" />
        </Item>
        <Item
          label="访问总次数"
          className={style.item}
          name="访问总次数"
          required
          rules={[{ required: true, message: '请输入访问总次数' }]}
        >
          <Input className="width320" />
        </Item>
      </Form>
    </Modal>
  );
};
export default AddModal;
