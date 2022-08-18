import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Space } from 'antd';
import NgUpload from '../../Components/Upload/Upload';
import { NgEditor } from 'src/components';
interface CreateSpecialProps {
  visible: boolean;
  onClose: () => void;
}
const CreateSpecial: React.FC<CreateSpecialProps> = ({ visible, onClose }) => {
  const [topForm] = Form.useForm();
  const [formValues, setFormValues] = useState({
    topicName: '',
    topicImg: '',
    desc: '',
    descChanged: ''
  });

  const onConfirm = () => {
    topForm.validateFields().then((values) => {
      console.log(values);
    });
  };

  const editorChange = (content: string) => {
    setFormValues((formValues) => ({ ...formValues, descChanged: content }));
  };
  return (
    <Drawer
      title="创建热门专题"
      placement="right"
      width={800}
      onClose={onClose}
      visible={visible}
      footer={
        <div className="flex justify-end">
          <Space size={20}>
            <Button onClick={onClose} shape="round">
              取消
            </Button>
            <Button type="primary" onClick={onConfirm} shape="round">
              确定
            </Button>
          </Space>
        </div>
      }
    >
      <Form form={topForm}>
        <Form.Item label="专题名称" name={'topicName'}>
          <Input type="text" placeholder="请输入" />
        </Form.Item>
        <Form.Item name="topicImg" label="专题图片" extra="请上传750*360像素高清图片，大小不超过1M，仅支持.jpg格式">
          <NgUpload />
        </Form.Item>
        <Form.Item label="专题描述" required>
          <NgEditor value={formValues.desc} onChange={editorChange} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateSpecial;
