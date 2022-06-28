import React from 'react';
import { Form } from 'antd';
import { NgModal } from 'src/components';

const CreateNodeModal: React.FC = () => {
  const [nodeForm] = Form.useForm();
  return (
    <NgModal visible={true} width={720} title="新建节点规则">
      <Form form={nodeForm}></Form>
    </NgModal>
  );
};

export default CreateNodeModal;
