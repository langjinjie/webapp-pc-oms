import React from 'react';
import { Breadcrumb, Button, Form, Input, Radio, Space } from 'antd';
import FormBlock from './components/FormBlock/FormBlock';
import { FormBlockPreview } from './components/FormBlockPreview/FormBlockPreview';

const StrategyTaskEdit: React.FC = () => {
  const navigatorToList = () => {
    console.log('a');
  };
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
        <Form>
          <div className="formListTitle mb20">基本信息</div>
          <Form.Item label="策略任务模板名称">
            <Input placeholder="待输入"></Input>
          </Form.Item>
          <Form.Item label="任务类型">
            <Input placeholder="系统类型"></Input>
          </Form.Item>
          <Form.Item label="策略任务运营说明">
            <Input.TextArea placeholder="选填，如不填则默认抓取选定任务推荐话术"></Input.TextArea>
          </Form.Item>
          <Form.Item label="策略任务覆盖范围">
            <Form.Item label="员工筛选">
              <Radio.Group>
                <Radio value={1}>全部员工</Radio>
                <Radio value={2}>部分员工</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="客户筛选">
              <Radio.Group>
                <Radio value={1}>全部员工</Radio>
                <Radio value={2}>部分员工</Radio>
              </Radio.Group>
            </Form.Item>
          </Form.Item>
          <div className="formListTitle">配置操作区</div>
          <Form.Item>
            <FormBlock />
          </Form.Item>
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
        </Form>
      </div>
    </div>
  );
};

export default StrategyTaskEdit;
