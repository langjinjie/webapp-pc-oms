import React, { useEffect } from 'react';
import { Breadcrumb, Button, Form, Input, Radio, Select, Space } from 'antd';
import FormBlock from './components/FormBlock/FormBlock';
import { FormBlockPreview } from './components/ManuallyAddSpeech/FormBlockPreview/FormBlockPreview';
import { getTaskStrategyTplDetail } from 'src/apis/task';

import styles from './style.module.less';
import { RouteComponentProps } from 'react-router-dom';
import { URLSearchParams } from 'src/utils/base';

const StrategyTaskEdit: React.FC<RouteComponentProps> = ({ location }) => {
  const [basicForm] = Form.useForm();
  const navigatorToList = () => {
    console.log('a');
  };

  const getDetail = async () => {
    const { tplId } = URLSearchParams(location.search) as { tplId: string };
    if (tplId) {
      const res = await getTaskStrategyTplDetail({ tplId });
      console.log(res);
      if (res) {
        basicForm.setFieldsValue({
          ...res
        });
      }
    } else {
      basicForm.setFieldsValue({
        staffScope: 1,
        clientScope: 1,
        runCycle: 1,
        taskType: 1
      });
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  const onFormChange = (formName: string, forms: any) => {
    console.log(formName, forms);
  };
  const onFinish = (values: any) => {
    console.log(values);
  };
  const onBasicSubmit = () => {
    console.log('Finish:');
    basicForm.submit();
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
        <Form.Provider
          onFormFinish={(name, { values, forms }) => {
            console.log(name, forms, values);
          }}
          onFormChange={(formName, { forms }) => onFormChange(formName, forms)}
        >
          <Form form={basicForm} name="basicForm" labelCol={{ span: 3 }} onFinish={onFinish}>
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
            <Form.Item label="策略任务运营说明" name={'opDesc'}>
              <Input.TextArea
                placeholder="选填，如不填则默认抓取选定任务推荐话术"
                className="width400"
              ></Input.TextArea>
            </Form.Item>
            <Form.Item label="策略任务覆盖范围">
              <Form.Item label="员工筛选" name={'staffScope'} className={styles.interiorItem}>
                <Radio.Group disabled>
                  <Radio value={1}>全部员工</Radio>
                  <Radio value={2}>部分员工</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="客户筛选" name={'clientScope'} className={styles.interiorItem}>
                <Radio.Group disabled>
                  <Radio value={1}>全部员工</Radio>
                  <Radio value={2}>部分员工</Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>
            {/* <Form.Item> */}
          </Form>
          <div className="formListTitle">配置操作区</div>
          <FormBlock />
          {/* </Form.Item> */}
          <div className="formListTitle">策略行事历预览</div>
          <FormBlockPreview value={[{}]} />
          <Form.Item>
            <div className="flex justify-center formFooter">
              <Space size={30}>
                <Button type="primary" shape="round" ghost>
                  取消
                </Button>
                <Button type="primary" shape="round" onClick={onBasicSubmit}>
                  确认
                </Button>
              </Space>
            </div>
          </Form.Item>
        </Form.Provider>
      </div>
    </div>
  );
};

export default StrategyTaskEdit;
