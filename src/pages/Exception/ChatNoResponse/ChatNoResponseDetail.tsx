import { Button, DatePicker, Form, Input, InputNumber, Radio } from 'antd';
import React from 'react';
import { BreadCrumbs } from 'src/components';
import { SelectOrg } from 'src/pages/CustomerManage/components';

const ChatNoResponseDetail: React.FC = () => {
  const [editForm] = Form.useForm();
  return (
    <div className="container">
      <BreadCrumbs
        navList={[
          {
            name: '超时未回复'
          },
          { name: '新建规则' }
        ]}
      />

      <Form form={editForm} className="edit mt40">
        <Form.Item label="规则名称">
          <Input className="width480"></Input>
        </Form.Item>
        <Form.Item label="超时提醒时间段">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item label="超时时间" style={{ marginBottom: 0 }}>
          <div className="flex">
            <Form.Item extra="分钟" className="customExtra">
              <InputNumber
                placeholder="请输入"
                // onPressEnter={onPressEnter}
                controls={false}
                style={{ width: '140px' }}
              />
            </Form.Item>
            <Form.Item extra="秒" className="customExtra ml20">
              <InputNumber
                placeholder="请输入"
                max={59}
                // onPressEnter={onPressEnter}
                controls={false}
                style={{ width: '140px' }}
              />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item label="超时提醒接收人" style={{ width: '780px' }}>
          <SelectOrg key={1} />
        </Form.Item>
        <Form.Item label="管理范围" style={{ width: '780px' }} name="dept">
          <SelectOrg key={2} type="dept" />
        </Form.Item>
        <Form.Item label="工作日提醒升级">
          <Radio.Group>
            <Radio value={1}>否</Radio>
            <Radio value={2}>是</Radio>
          </Radio.Group>
        </Form.Item>
        {true && (
          <>
            <Form.Item label="升级提醒时间" style={{ marginBottom: 0 }}>
              <div className="flex">
                <Form.Item extra="分钟" className="customExtra">
                  <InputNumber
                    placeholder="请输入"
                    // onPressEnter={onPressEnter}
                    controls={false}
                    style={{ width: '140px' }}
                  />
                </Form.Item>
                <Form.Item extra="秒" className="customExtra ml20">
                  <InputNumber
                    placeholder="请输入"
                    max={59}
                    // onPressEnter={onPressEnter}
                    controls={false}
                    style={{ width: '140px' }}
                  />
                </Form.Item>
              </div>
            </Form.Item>
            <Form.Item label="升级提醒接收人" style={{ width: '780px' }}>
              <SelectOrg key={1} />
            </Form.Item>
          </>
        )}

        <Form.Item className="formFooter text-center" style={{ width: '1000px' }}>
          <Button type="primary" shape="round">
            创建规则
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChatNoResponseDetail;
