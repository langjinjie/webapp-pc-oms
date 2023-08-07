import React from 'react';
import { Form, Input, DatePicker, Radio, Space } from 'antd';
import { ChooseMoment } from 'src/pages/LiveCode/MomentCode/components';
import style from './style.module.less';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const BasicSettings: React.FC = () => {
  const [form] = Form.useForm();

  const onValuesChange = (changedValues: any, values: any) => {
    console.log('changedValues', changedValues);
    console.log('values', values);
  };

  return (
    <div className={style.wrap}>
      <Form form={form} onValuesChange={onValuesChange}>
        <Item name="活动名称" label="活动名称" rules={[{ required: true, message: '请输入活动名称，20字以内' }]}>
          <Input className="width480" placeholder="请输入活动名称，20字以内" />
        </Item>
        <Item name="活动时间" label="活动时间" rules={[{ required: true, message: '请输入活动时间，20字以内' }]}>
          <RangePicker />
        </Item>
        <Item name="活动规则" label="活动规则">
          <TextArea className={style.textArea} placeholder="请输入内容，3000字以内" />
        </Item>
        <div className={style.panel}>规则控制</div>
        <Item className="mt20" label="在群要求" required>
          <Item noStyle name="groupRequire">
            <Radio.Group>
              <Space direction="vertical">
                <Radio value={1}>
                  达成调教即可奖励 <span className="color-text-placeholder">客户经理群内成员皆可</span>
                </Radio>
                <Radio value={2}>指定群成员</Radio>
              </Space>
            </Radio.Group>
          </Item>
          <Item name="groupId">
            <ChooseMoment />
          </Item>
        </Item>
      </Form>
    </div>
  );
};
export default BasicSettings;
