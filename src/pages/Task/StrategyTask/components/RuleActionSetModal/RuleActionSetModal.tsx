import { Form, Radio, Select } from 'antd';
import React, { useState } from 'react';
import { NgModal } from 'src/components';

import styles from './style.module.less';
const RuleActionSetModal: React.FC = () => {
  const [values, setValues] = useState<any>({});
  const [actionForm] = Form.useForm();
  const handleOk = () => {
    actionForm.validateFields();
  };

  const onValuesChange = (changedValues: any, values: any) => {
    setValues(values);
  };
  return (
    <NgModal width={808} visible={false} title="内容选择" onOk={handleOk}>
      <Form form={actionForm} onValuesChange={onValuesChange}>
        <Form.Item label="内容来源" name={'contentSource'}>
          <Select className="width320">
            <Select.Option value={1}>公有库</Select.Option>
            <Select.Option value={2}>机构库</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="动作类型" name={'contentType'}>
          <Radio.Group>
            <Radio value={1}>文章</Radio>
            <Radio value={2}>海报</Radio>
            {/* <Radio value={3}>产品</Radio>
            <Radio value={4}>活动</Radio> */}
            <Radio value={5}>话术</Radio>
          </Radio.Group>
        </Form.Item>
        {values.contentSource === 2 && (
          <Form.Item label="选择内容">
            <Form.Item name={'contentCategory'}>
              <Radio.Group>
                <Radio value={1}>机构自定义配置</Radio>
                <Radio value={2}>按照规则配置</Radio>
              </Radio.Group>
            </Form.Item>
            {values.contentCategory === 2 && (
              <div className={styles.categoryWrap}>
                <div className={styles.tipText}>按照</div>
                <Form.Item className={styles.categoryItem} rules={[{ required: true }]} name="categoryId">
                  <Select placeholder="请选择类目">
                    <Select.Option value={1}>公有库</Select.Option>
                    <Select.Option value={2}>机构库</Select.Option>
                  </Select>
                </Form.Item>
                <div className={styles.tipText}>最新发布的类型</div>
              </div>
            )}
          </Form.Item>
        )}
      </Form>
    </NgModal>
  );
};

export default RuleActionSetModal;
