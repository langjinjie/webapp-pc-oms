import { Form, Input, InputNumber, Select, Space } from 'antd';
import classNames from 'classnames';
import React from 'react';
import { NgModal } from 'src/components';
import styles from './style.module.less';

type CreateNodeModalProps = React.ComponentProps<typeof NgModal>;

const CreateNodeModal: React.FC<CreateNodeModalProps> = (props) => {
  const [nodeForm] = Form.useForm();
  return (
    <NgModal {...props} width={720} title="新建节点规则">
      <Form form={nodeForm} labelAlign="right" labelCol={{ span: 4 }}>
        <Form.Item label="选择节点类别" labelAlign="right">
          <Select className="width240">
            <Select.Option value={1}>日期类</Select.Option>
            <Select.Option value={2}>标签类</Select.Option>
            <Select.Option value={3}>指标类</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="触发节点" labelAlign="right">
          <Select className="width320">
            <Select.Option value={2}>保险到期日</Select.Option>
            <Select.Option value={3}>客户生日</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="触发逻辑" labelAlign="right">
          <div className={classNames('flex', styles.lineWrap)}>
            <Space size={8}>
              <Form.Item>
                <Input className={styles.nodeName} value={'保险到期日'}></Input>
              </Form.Item>
              <Form.Item>
                <Select className={styles.smallInput}>
                  <Select.Option value={'1'}>前</Select.Option>
                  <Select.Option value={'2'}>后</Select.Option>
                  <Select.Option value={'3'}>当天</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <InputNumber className={styles.smallInput} controls={false}></InputNumber>
              </Form.Item>
              天
            </Space>
          </div>
        </Form.Item>
        <Form.Item label="节点规则名称" labelAlign="right">
          保险到期日前14天
        </Form.Item>
      </Form>
    </NgModal>
  );
};

export default CreateNodeModal;
