import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Form, Input, Radio, Select, Space, FormInstance, message, InputNumber } from 'antd';
import FormBlock from 'src/pages/Task/StrategyTask/components/FormBlock/FormBlock';
import { FormBlockPreview } from 'src/pages/Task/StrategyTask/components/ManuallyAddSpeech/FormBlockPreview/FormBlockPreview';
import { getTaskStrategyTplDetail, applyTpl } from 'src/apis/task';

import styles from './style.module.less';
import { RouteComponentProps } from 'react-router-dom';
import { URLSearchParams } from 'src/utils/base';
import moment from 'moment';

const StrategyTaskEdit: React.FC<RouteComponentProps> = ({ location, history }) => {
  const [basicForm] = Form.useForm();
  const [tplDetail, setTplDetail] = useState<any>();
  const [isReadonly, setIsReadonly] = useState(false);
  const navigatorToList = () => {
    history.push('/strategyTask');
  };

  const getDetail = async () => {
    const { tplId, view } = URLSearchParams(location.search) as { tplId: string; view: string };
    if (view) setIsReadonly(true);
    if (tplId) {
      const res = await getTaskStrategyTplDetail({ tplId });
      if (res) {
        setTplDetail(res);
        basicForm.setFieldsValue({
          ...res,
          corpTplName: res.corpTplName || res.tplName
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

  const onFormFinish = async (forms: { basicForm: FormInstance; blockForm: FormInstance }) => {
    const { blockForm, basicForm } = forms;
    blockForm.validateFields().then((values) => {
      const basicValues = basicForm.getFieldsValue();
      const { sceneList } = values;
      const copySceneList = JSON.parse(JSON.stringify(sceneList));
      if (sceneList.length < 1) {
        return false;
      } else {
        copySceneList.map((scene: any) => {
          delete scene.nodeTypeId;
          scene.sceneId = scene.sceneId || '';
          scene.nodeRuleList.map((rule: any) => {
            if (rule.actionRule.contentType === 2 && rule.actionRule.contentCategory === 2) {
              rule.actionRule.categoryId = rule.actionRule.categoryId.join(';');
            }
            rule.pushTime = moment(rule.pushTime)?.format('HH:mm') || '';
            return rule;
          });
          return scene;
        });

        console.log({ ...basicValues, copySceneList });
        applyTpl({
          tplId: tplDetail?.tplId,
          corpTplId: tplDetail?.corpTplId || '',
          baseInfo: {
            corpTplName: basicValues.corpTplName
          },
          sceneList: copySceneList
        }).then((res) => {
          if (res) {
            message.success('保存成功');
            history.push('/strategyTask');
          }
        });
      }
    });
  };

  const onBasicSubmit = () => {
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
          onFormFinish={(formName, { forms }) => {
            if (formName === 'basicForm') {
              onFormFinish(forms as any);
            }
          }}
        >
          <Form form={basicForm} name="basicForm" labelCol={{ span: 3 }}>
            <div className="formListTitle mb20">基本信息</div>
            <Form.Item
              label="策略任务模板名称"
              name={'tplName'}
              rules={[{ required: true }, { max: 30, message: '最多30个字' }]}
            >
              <Input placeholder="待输入" readOnly className="width320"></Input>
            </Form.Item>
            <Form.Item label="任务类型" name={'taskType'}>
              <Select className="width320">
                <Select.Option value={1}>策略任务</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="策略执行周期">
              <Form.Item name={'runCycle'}>
                <Radio.Group>
                  <Radio value={1}>长期有效</Radio> <br />
                  <Radio value={2}>
                    <div className="flex mt20">
                      <span className="lh30 mr10">填写执行周期天数 </span>
                      <Form.Item name={'taskType'}>
                        <InputNumber controls={false}></InputNumber>
                      </Form.Item>
                      <span className="lh30 ml10">天</span>
                    </div>
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>
            <Form.Item
              label="策略任务运营说明"
              name={'opDesc'}
              rules={[{ required: true, message: '请输入任务运营说明' }]}
            >
              <Input.TextArea
                readOnly={isReadonly}
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
            <Form.Item
              name={'corpTplName'}
              label="机构策略任务名称"
              rules={[{ required: true, message: '请输入机构策略任务名称' }]}
            >
              <Input placeholder="默认与策略任务模板一致，可以修改" className="width320"></Input>
            </Form.Item>
            {/* <Form.Item> */}
          </Form>
          <div className="formListTitle">配置操作区</div>
          <FormBlock value={tplDetail?.sceneList} />
          {/* </Form.Item> */}
          <div className="formListTitle">策略行事历预览</div>
          <FormBlockPreview value={tplDetail?.sceneList || []} />
          {!isReadonly && (
            <Form.Item>
              <div className="flex justify-center formFooter">
                <Space size={30}>
                  <Button type="primary" shape="round" ghost onClick={() => history.goBack()}>
                    取消
                  </Button>
                  <Button type="primary" shape="round" onClick={onBasicSubmit}>
                    确认
                  </Button>
                </Space>
              </div>
            </Form.Item>
          )}
        </Form.Provider>
      </div>
    </div>
  );
};

export default StrategyTaskEdit;
