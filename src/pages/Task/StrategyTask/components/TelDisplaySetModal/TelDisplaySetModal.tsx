import { Form, Input } from 'antd';
import React from 'react';
import { NgModal } from 'src/components';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';

interface TelDisplaySetModalProps {
  visible: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
}

export const TelDisplaySetModal: React.FC<TelDisplaySetModalProps> = ({ visible, onOk, onCancel }) => {
  const [displayForm] = Form.useForm();
  const handleOk = () => {
    displayForm.validateFields().then((values) => {
      console.log(values);
      onOk(values);
    });
  };

  const handleCancel = () => {
    displayForm.resetFields();
    onCancel();
  };
  return (
    <NgModal title="配置展示信息" width={620} visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <Form layout="vertical" form={displayForm}>
        <Form.Item
          name={'displayCoverImg'}
          label="封面图片"
          extra="为确保最佳展示效果，请上传274*166像素高清图片，支持.png及.jpg格式的图片。若不上传，则默认为链接对应文章的自带封面。"
        >
          <NgUpload></NgUpload>
        </Form.Item>
        <Form.Item label="效果" name={'resultDesc'}>
          <Input placeholder="限定不超过50个字"></Input>
        </Form.Item>
        <Form.Item label="任务说明" name={'taskDesc'}>
          <Input.TextArea placeholder="限定不超过100个字"></Input.TextArea>
        </Form.Item>
        <Form.Item label="任务场景" name={'sceneDesc'}>
          <Input.TextArea placeholder="限定不超过100个字"></Input.TextArea>
        </Form.Item>
      </Form>
    </NgModal>
  );
};
