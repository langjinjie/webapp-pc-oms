import React from 'react';
import { Breadcrumb, Button, Form, Input, Radio, Select, Space } from 'antd';
import FormBlock from '../StrategyTask/components/FormBlock/FormBlock';
import { FormBlockPreview } from '../StrategyTask/components/ManuallyAddSpeech/FormBlockPreview/FormBlockPreview';

const StrategyTaskEdit: React.FC = () => {
  const navigatorToList = () => {
    console.log('a');
  };
  const [basicForm] = Form.useForm();
  return (
    <div className="edit container">
      <div className={'breadcrumbWrap'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>全部团队数据</Breadcrumb.Item>
          <Breadcrumb.Item>策略任务模板</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="content">
        <Form form={basicForm} labelCol={{ span: 3 }}>
          <div className="formListTitle mb20">基本信息</div>
          <Form.Item
            label="策略任务模板名称"
            name={'tplName'}
            rules={[{ required: true }, { max: 30, message: '最多30个字' }]}
          >
            <Input placeholder="待输入" className="width320"></Input>
          </Form.Item>
          <Form.Item label="任务类型" name={'taskType'}>
            <Select className="width320">
              <Select.Option value={1}>策略任务</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="策略执行周期" name={'runCycle'}>
            <Radio.Group>
              <Radio value={1}>长期有效</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="机构策略任务名称" name={'runCycle'}>
            <Input className="width320"></Input>
          </Form.Item>

          <Form.Item label="策略任务运营说明" name={'opDesc'}>
            <Input.TextArea placeholder="选填，如不填则默认抓取选定任务推荐话术" className="width400"></Input.TextArea>
          </Form.Item>
          <Form.Item label="策略任务覆盖范围">
            <Form.Item label="员工筛选" name={'staffScope'}>
              <Radio.Group>
                <Radio value={1}>全部员工</Radio>
                <Radio value={2}>部分员工</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="客户筛选" name={'clientScope'}>
              <Radio.Group>
                <Radio value={1}>全部员工</Radio>
                <Radio value={2}>部分员工</Radio>
              </Radio.Group>
            </Form.Item>
          </Form.Item>
          {/* <Form.Item> */}
        </Form>
        <div className="formListTitle">配置操作区</div>
        <FormBlock hideAdd />
        {/* </Form.Item> */}
        <div className="formListTitle">策略行事历预览</div>
        <FormBlockPreview value={[{}]} />
        <Form.Item>
          <div className="flex justify-center formFooter">
            <Space size={30}>
              <Button type="primary" shape="round" ghost>
                取消
              </Button>
              <Button type="primary" shape="round">
                确认
              </Button>
            </Space>
          </div>
        </Form.Item>
      </div>
    </div>
  );
};

export default StrategyTaskEdit;
