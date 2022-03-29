import { Form, InputNumber, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { NgModal } from 'src/pages/OrgManage/StatisticsFree/Components/NgModal/NgModal';

interface ModalUpdatePointsProps {
  title: string;
  onCancel: () => void;
  onOk: (values: any) => void;
  visible: boolean;
}
const ModalUpdatePoints: React.FC<ModalUpdatePointsProps> = ({ title, onCancel, onOk, visible }) => {
  const [myForm] = useForm();

  const handleOnOk = () => {
    myForm.validateFields().then((values) => {
      onOk(values);
    });
  };
  const formatter = (value: any) => {
    return value ? parseInt(value) + '' : '';
  };

  useEffect(() => {
    if (!visible) {
      myForm.resetFields();
    }
  }, [visible]);
  return (
    <NgModal title={title} onCancel={onCancel} onOk={handleOnOk} visible={visible}>
      <Form form={myForm} layout="vertical">
        <Form.Item label={'积分数量'} name={'adjustPoints'} rules={[{ required: true }]}>
          <InputNumber
            formatter={formatter}
            step="1"
            min={1}
            controls={false}
            placeholder="请输入积分数量"
            maxLength={8}
          />
        </Form.Item>
        <Form.Item label="备注" name={'remark'} rules={[{ max: 20, message: '最多20个字符' }]}>
          <Input.TextArea placeholder="请输入备注说明" maxLength={20} />
        </Form.Item>
      </Form>
    </NgModal>
  );
};

export default ModalUpdatePoints;
