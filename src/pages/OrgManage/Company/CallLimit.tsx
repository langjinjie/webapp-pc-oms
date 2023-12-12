import React, { useState } from 'react';
import { Modal, SelectOrg } from 'src/components';
import { Button, Form, Input, Radio, RadioChangeEvent } from 'antd';
import style from './style.module.less';

interface ICallLimitProps {
  value?: any;
  visible: boolean;
  onOk?: (values?: any) => void;
  onCancel: () => void;
}

const { Item, List } = Form;

const CallLimit: React.FC<ICallLimitProps> = ({ value, visible, onCancel, onOk }) => {
  const [radioValue, setRadioValue] = useState<0 | 1>();
  const [form] = Form.useForm();

  const handleCancel = () => {
    onCancel();
  };

  const handleOk = async () => {
    const res = await form.validateFields();
    onOk?.(res);
  };

  const radioOnChange = async (event: RadioChangeEvent) => {
    console.log('event', event);
    setRadioValue(event.target.value);
  };
  return (
    <Modal
      title="公有云调用次数设置"
      width={600}
      visible={visible}
      centered
      className={style.modalWrap}
      onClose={handleCancel}
      onOk={handleOk}
    >
      <Form form={form}>
        <Item label="调用次数设置" name="isLimit">
          <Radio.Group onChange={radioOnChange}>
            <Radio value={1}>开启</Radio>
            <Radio value={0}>关闭</Radio>
          </Radio.Group>
        </Item>
        {radioValue === 1 && (
          <>
            <Item label="每年调用次数限制">
              <Item name="count" className="mr5" noStyle>
                <Input type="number" className="width240" placeholder="请输入" />
              </Item>
              <span className="inline-block ml5">万次</span>
            </Item>
            <List name="notice" initialValue={[{ staff: undefined }]}>
              {(fields, { add, remove }) => (
                <Item label="调用次数通知人" required>
                  {fields.map((field, index) => (
                    <div className="flex" key={field.key}>
                      <Item name={[field.name, 'staff']} rules={[{ required: true, message: '请选择人员' }]}>
                        <SelectOrg singleChoice className="width240" type="staff" />
                      </Item>
                      <Button className="ml10" shape="round" onClick={() => remove(index)}>
                        删除
                      </Button>
                      {fields.length - 1 === index && (
                        <Button className="ml10" shape="round" onClick={add}>
                          添加
                        </Button>
                      )}
                    </div>
                  ))}
                </Item>
              )}
            </List>
          </>
        )}
      </Form>
      {value && <span>{`截至到10月30日访问次数：${value.accessCount ?? 0}`}</span>}
    </Modal>
  );
};
export default CallLimit;
