import React, { useEffect, useState } from 'react';
import { Modal } from 'src/components';
import { Form, Input, InputNumber } from 'antd';
import { IColumn } from './config';
import style from './style.module.less';

export interface IAddModalValues {
  channelId?: string; // 否 渠道id，编辑时必填
  channelName: string; // 是 渠道名称
  channelCode?: string; // 否 渠道代码，不传则后端自动生成
  articleCnt: number; // 是 文章总访问次数
}

interface IAddModalProps {
  value?: IColumn;
  visible: boolean;
  title?: string;
  onClose: () => void;
  onOk?: (values: IAddModalValues) => Promise<any>;
}

const { Item } = Form;

const AddModal: React.FC<IAddModalProps> = ({ value, visible, title, onClose, onOk }) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    const res = await form.validateFields();
    setLoading(true);
    await onOk?.({ ...res, channelId: value?.channelId });
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      value ? form.setFieldsValue(value) : form.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      title={title || '新增机构渠道'}
      onClose={handleCancel}
      centered
      visible={visible}
      onOk={handleOk}
      okButtonProps={{ loading }}
    >
      <Form form={form}>
        <Item
          label="机构名称"
          className={style.item}
          name="channelName"
          required
          rules={[{ required: true, message: '请输入机构名称' }]}
        >
          <Input placeholder="请输入" className="width320" />
        </Item>
        <Item
          label="渠道代码"
          className={style.item}
          name="channelCode"
          required
          rules={[{ required: true, message: '请输入机构代码' }]}
        >
          <Input placeholder="请输入" className="width320" />
        </Item>
        <Item
          label="访问总次数"
          className={style.item}
          name="articleCnt"
          required
          rules={[{ required: true, message: '请输入访问总次数' }]}
        >
          <InputNumber placeholder="请输入" className="width320" min={0} />
        </Item>
      </Form>
    </Modal>
  );
};
export default AddModal;
