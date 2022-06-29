import React from 'react';
import { Form, Input, Select } from 'antd';
import { NgModal } from 'src/components';

type CreateNodeModalProps = React.ComponentProps<typeof NgModal>;
export const CreateNodeModal: React.FC<CreateNodeModalProps> = (props) => {
  const [nodeForm] = Form.useForm();
  return (
    <NgModal {...props} width={520} title="新建节点规则">
      <Form form={nodeForm} labelAlign="right" labelCol={{ span: 6 }}>
        <Form.Item label="选择节点类别">
          <Select className="width180">
            <Select.Option value={1}>标签类</Select.Option>
            <Select.Option value={2}>日期类</Select.Option>
            <Select.Option value={3}>指标类</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="节点名称">
          <Select className="width320">
            <Select.Option value={1}>标签类</Select.Option>
            <Select.Option value={2}>日期类</Select.Option>
            <Select.Option value={3}>指标类</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="节点名称">
          <Select className="width320">
            <Select.Option value={1}>标签类</Select.Option>
            <Select.Option value={2}>日期类</Select.Option>
            <Select.Option value={3}>指标类</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="节点名称">
          <Select className="width320">
            <Select.Option value={1}>标签类</Select.Option>
            <Select.Option value={2}>日期类</Select.Option>
            <Select.Option value={3}>指标类</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="节点说明">
          <Input.TextArea className="width320"></Input.TextArea>
        </Form.Item>
      </Form>
    </NgModal>
  );
};
