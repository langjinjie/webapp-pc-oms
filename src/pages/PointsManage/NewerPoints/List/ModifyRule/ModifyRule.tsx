import { Form, Input, message, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
// import { Modal } from 'src/components';
import { requestModifyNewcomerPoints, requestQueryNewcomerPoints } from 'src/apis/pointsMall';
import style from './style.module.less';

interface IModifyRuleProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
}

const ModifyRule: React.FC<IModifyRuleProps> = ({ visible, title, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onCloseHanele = () => {
    onClose();
  };

  const onOkHandle = async () => {
    const { newcomerPoints, newcomerDay } = form.getFieldsValue();
    await form.validateFields();
    setLoading(true);
    const res = await requestModifyNewcomerPoints({ newcomerPoints: +newcomerPoints, newcomerDay: +newcomerDay });
    setLoading(false);
    if (res) {
      message.success('新人积分规则修改成功');
      onCloseHanele();
    }
  };

  // 获取新人规则详情
  const getNewcomerPoints = async () => {
    const res = await requestQueryNewcomerPoints();
    if (res) {
      form.setFieldsValue(res);
    }
  };
  useEffect(() => {
    if (visible) {
      getNewcomerPoints();
    }
  }, [visible]);
  return (
    <Modal
      width={360}
      title={title || '修改新人规则'}
      className={style.wrap}
      visible={visible}
      onCancel={onCloseHanele}
      onOk={onOkHandle}
      centered
      okButtonProps={{
        loading: loading
      }}
    >
      <Form form={form}>
        <Form.Item>
          每天需完成
          <Form.Item name="newcomerPoints" rules={[{ required: true, message: '积分不能为空' }]} noStyle>
            <Input className={style.input} placeholder="请输入" type="number" />
          </Form.Item>
          积分
        </Form.Item>
        <Form.Item>
          需累计完成
          <Form.Item name="newcomerDay" rules={[{ required: true, message: '天数不能为空' }]} noStyle>
            <Input className={style.input} placeholder="请输入" type="number" />
          </Form.Item>
          天
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModifyRule;
