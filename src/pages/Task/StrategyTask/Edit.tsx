import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Form, Input, Radio, Select, FormInstance, message } from 'antd';
import FormBlock from './components/FormBlock/FormBlock';
import { getTaskStrategyTplDetail, saveScene } from 'src/apis/task';

import styles from './style.module.less';
import { RouteComponentProps } from 'react-router-dom';
import { throttle, urlSearchParams } from 'src/utils/base';
import moment from 'moment';
import { FormBlockPreview } from './components/ManuallyAddSpeech/FormBlockPreview/FormBlockPreview';
import { isArray } from 'src/utils/tools';

const StrategyTaskEdit: React.FC<RouteComponentProps> = ({ location, history }) => {
  const [basicForm] = Form.useForm();
  const [tplDetail, setTplDetail] = useState<any>();
  const [isReadonly, setIsReadonly] = useState(false);
  const navigatorToList = () => {
    history.push('/strategyTask');
  };

  const getDetail = async () => {
    const { tplId, view } = urlSearchParams(location.search) as { tplId: string; view: string };
    if (view) setIsReadonly(true);
    if (tplId) {
      const res = await getTaskStrategyTplDetail({ tplId });
      if (res) {
        setTplDetail(res);
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
              if (isArray(rule.actionRule.categoryId)) {
                rule.actionRule.categoryId = rule.actionRule.categoryId.join(';');
              }
            }
            if (isArray(rule.actionRule.itemIds)) {
              rule.actionRule.itemIds = rule.actionRule.itemIds.map((item: any) => ({
                itemId: item.itemId
              }));
            }
            rule.pushTime = moment(rule.pushTime)?.format('HH:mm') || '';
            rule.speechcraft = rule.speechcraft || '';
            return rule;
          });
          return scene;
        });

        saveScene({
          tplId: tplDetail?.tplId || '',
          baseInfo: {
            ...basicValues,
            sceneList: copySceneList
          }
        }).then((res) => {
          if (res) {
            message.success('保存成功');
            const pathUrl =
              tplDetail?.tplId && !isReadonly
                ? '/strategyTask?refresh=1'
                : !tplDetail?.tplId
                    ? '/strategyTask?pageNum=1'
                    : '/strategyTask';

            history.push(pathUrl);
          }
        });
      }
    });
  };

  const onBasicSubmit = throttle(() => {
    basicForm.submit();
  }, 500);
  return (
    <div className="edit container">
      <div className={'breadcrumbWrap'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>策略运营</Breadcrumb.Item>
          <Breadcrumb.Item>策略运营模板</Breadcrumb.Item>
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
              <Input placeholder="待输入" disabled={isReadonly} className="width320"></Input>
            </Form.Item>
            <Form.Item label="任务类型" name={'taskType'}>
              <Select className="width320" disabled={isReadonly}>
                <Select.Option value={1}>策略任务</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="策略执行周期" name={'runCycle'}>
              <Radio.Group disabled={isReadonly}>
                <Radio value={1}>长期有效</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="策略任务运营说明"
              name={'opDesc'}
              rules={[{ required: true, message: '请输入任务运营说明' }]}
            >
              <Input.TextArea disabled={isReadonly} placeholder="请输入" className="width400"></Input.TextArea>
            </Form.Item>
            <Form.Item label="策略任务覆盖范围">
              <Form.Item label="员工筛选" name={'staffScope'} className={styles.interiorItem}>
                <Radio.Group disabled>
                  <Radio value={1}>全部员工</Radio>
                  <Radio value={2}>部分员工</Radio>
                  <Radio value={3}>群主</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="客户筛选" name={'clientScope'} className={styles.interiorItem}>
                <Radio.Group disabled>
                  <Radio value={1}>全部客户</Radio>
                  <Radio value={2}>选择人群包</Radio>
                </Radio.Group>
              </Form.Item>
            </Form.Item>
            {/* <Form.Item> */}
          </Form>
          <div className="formListTitle">配置操作区</div>
          <FormBlock value={tplDetail?.sceneList} isReadonly={isReadonly} />

          <Form.Item className="formFooter">
            <div className="flex justify-center ">
              <Button type="primary" shape="round" ghost onClick={() => history.goBack()}>
                {isReadonly ? '返回' : '取消'}
              </Button>
              {!isReadonly && (
                <Button type="primary" shape="round" onClick={() => onBasicSubmit()}>
                  确认
                </Button>
              )}
            </div>
          </Form.Item>
        </Form.Provider>
        <div className="formListTitle">策略行事历预览</div>
        <FormBlockPreview value={tplDetail?.sceneList || []} />
      </div>
    </div>
  );
};

export default StrategyTaskEdit;
