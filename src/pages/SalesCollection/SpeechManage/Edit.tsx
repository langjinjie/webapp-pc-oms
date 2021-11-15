import React from 'react';

import { Button, Card, Form, Input, Select, Space } from 'antd';
import styles from './style.module.less';
import CustomTextArea from './Components/CustomTextArea';
import { useForm } from 'antd/lib/form/Form';

const SpeechEdit: React.FC = () => {
  const [speechForm] = useForm();

  const onFinish = (values: any) => {
    console.log(values);
  };
  return (
    <Card title="新增话术" bordered={false} className="edit">
      <Form form={speechForm} onFinish={onFinish}>
        <Form.Item label="选择目录" name="key1" rules={[{ required: true }]}>
          <Select placeholder="请选择" className="width420">
            <Select.Option value="1">名片</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="话术格式" name="key1" rules={[{ required: true }]}>
          <Select placeholder="请选择" className="width240">
            <Select.Option value="1">名片</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="样式" name="key1" rules={[{ required: true }]} />
        <Form.Item label="话术内容" name="key2" rules={[{ required: true }]}>
          <CustomTextArea />
        </Form.Item>
        <Form.Item label="客户大类" name="key1" rules={[{ required: true }]} className={styles.formItem__selectGroup}>
          <Form.Item>
            <Select placeholder="请选择">
              <Select.Option value="1">名片</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Select placeholder="请选择">
              <Select.Option value="1">名片</Select.Option>
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item label="话术小贴士" name="key1" rules={[{ required: true }]}>
          <Input placeholder={'请输入'} className="width360" />
        </Form.Item>
        <Form.Item className={styles.formItem__footerBtnWrap}>
          <Space>
            <Button type="default" shape="round">
              返回
            </Button>
            <Button type="primary" htmlType="submit" shape="round">
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SpeechEdit;
