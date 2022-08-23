import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, message, Space } from 'antd';
import NgUpload from '../../Components/Upload/Upload';
import { NgEditor } from 'src/components';
import { setHotConfig } from 'src/apis/marketing';
import { HotColumns } from '../ListConfig';
interface CreateSpecialProps {
  visible: boolean;
  onClose: () => void;
  value?: HotColumns;
}
const CreateSpecial: React.FC<CreateSpecialProps> = ({ visible, onClose, value }) => {
  const [topForm] = Form.useForm();
  const [formValues, setFormValues] = useState<Partial<HotColumns>>({
    topicName: '',
    topicImg: '',
    topicDesc: '',
    descChanged: ''
  });
  useEffect(() => {
    if (visible && value) {
      setFormValues(value);
    }
  }, [visible]);

  const onConfirm = () => {
    topForm.validateFields().then(async (values) => {
      const desc = formValues.descChanged || formValues.topicDesc;
      if (!desc) return;
      const res = await setHotConfig({ ...values, desc: desc, topicId: formValues.topicId });
      if (res) {
        message.success(value ? '编辑成功' : '新增成功');
        onClose();
      }
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
      <Form form={topForm} initialValues={formValues}>
        <Form.Item label="专题名称" name={'topicName'} rules={[{ required: true, message: '请输入专题名称' }]}>
          <Input type="text" placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="topicImg"
          label="专题图片"
          rules={[{ required: true, message: '请上传专题图片' }]}
          extra="请上传750*360像素高清图片，大小不超过1M，仅支持.jpg格式"
        >
          <NgUpload />
        </Form.Item>
        <Form.Item label="专题描述" required>
          <NgEditor value={formValues.topicDesc} onChange={editorChange} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateSpecial;
