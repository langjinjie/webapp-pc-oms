import { Form, Input } from 'antd';
import React, { useEffect } from 'react';
import { NgModal } from 'src/components';
import NgUpload from 'src/pages/Marketing/Components/Upload/Upload';

interface TelDisplaySetModalProps {
  visible: boolean;
  onOk: (values: any) => void;
  onCancel: () => void;
  values?: {
    displayCoverImg: string;
    resultDesc: string;
    taskDesc: string;
    sceneDesc: string;
    [prop: string]: any;
  };
}

export const TelDisplaySetModal: React.FC<TelDisplaySetModalProps> = ({ visible, onOk, onCancel, values }) => {
  const [displayForm] = Form.useForm();

  const handleOk = () => {
    displayForm.validateFields().then((values) => {
      console.log(values);
      onOk(values);
    });
  };
  useEffect(() => {
    if (values) {
      const { displayCoverImg = '', resultDesc = '', taskDesc = '', sceneDesc = '' } = values;
      displayForm.setFieldsValue({
        displayCoverImg,
        resultDesc,
        taskDesc,
        sceneDesc
      });
    }
  }, [values, visible]);

  const handleCancel = () => {
    displayForm.resetFields();
    onCancel();
  };
  return (
    <NgModal title="配置展示信息" forceRender width={620} visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <Form layout="vertical" form={displayForm}>
        <Form.Item
          name={'displayCoverImg'}
          label="封面图片"
          extra="为确保最佳展示效果，请上传274*166像素高清图片，支持.png及.jpg格式的图片。若不上传，则会使用默认封面。"
        >
          <NgUpload></NgUpload>
        </Form.Item>
        <Form.Item
          label="效果"
          name={'resultDesc'}
          rules={[
            { required: true, message: '效果描述不可以为空' },
            {
              max: 50,
              message: '限定不超过50个字'
            }
          ]}
        >
          <Input placeholder="限定不超过50个字"></Input>
        </Form.Item>
        <Form.Item
          label="任务说明"
          name={'taskDesc'}
          rules={[
            { required: true, message: '任务说明不可以为空' },
            {
              max: 50,
              message: '限定不超过100个字'
            }
          ]}
        >
          <Input.TextArea placeholder="限定不超过100个字"></Input.TextArea>
        </Form.Item>
        <Form.Item
          label="任务场景"
          name={'sceneDesc'}
          rules={[
            { required: true, message: '任务场景不可以为空' },
            {
              max: 50,
              message: '限定不超过100个字'
            }
          ]}
        >
          <Input.TextArea placeholder="限定不超过100个字"></Input.TextArea>
        </Form.Item>
      </Form>
    </NgModal>
  );
};
