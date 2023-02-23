import React, { useEffect, useState } from 'react';
import { Button, Form, message, Spin } from 'antd';
import { BreadCrumbs } from 'src/components';
import { SetUserGroup } from 'src/pages/Migration/Welcome/components';
import { AddMarket, Preview } from 'src/pages/LiveCode/StaffCode/components';
import { IValue } from 'src/pages/LiveCode/StaffCode/components/Preview/Preview';
import { useHistory } from 'react-router';
import { requestEditWelcomeStaff, requestGetWelcomeStaffDetail } from 'src/apis/migration';
import CustomTextArea from 'src/pages/SalesCollection/SpeechManage/Components/CustomTextArea';
import qs from 'qs';
import style from './style.module.less';

const AddWelcome: React.FC = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [previewValue, setPreviewValue] = useState<IValue>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [getDetailLoading, setGetDetailLoading] = useState(false);

  const { Item } = Form;
  const [form] = Form.useForm();
  const history = useHistory();

  // 获取欢迎语详情
  const getLiveCodeDetail = async () => {
    const { welcomeCode, readOnly } = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (readOnly) {
      setReadOnly(true);
    }
    if (welcomeCode) {
      setGetDetailLoading(true);
      const res = await requestGetWelcomeStaffDetail({ welcomeCode });
      if (res) {
        form.setFieldsValue(res);
        setPreviewValue(res);
      }
      setGetDetailLoading(false);
    }
  };

  // 设置预览的值
  const onValuesChangeHandle = (changedValues: any) => {
    const { welcomeWord, welcomes } = changedValues as IValue;
    if (welcomeWord) {
      setPreviewValue((previewValue) => ({ ...previewValue, welcomeWord }));
    }
    if (welcomes) {
      setPreviewValue((previewValue) => ({ ...previewValue, welcomes }));
    }
  };

  // 新增欢迎语
  const onFinishHandle = async (values?: any) => {
    setSubmitLoading(true);
    const { welcomeCode } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const param = { ...values };
    const res = await requestEditWelcomeStaff({ ...param, welcomeCode });
    if (res) {
      message.success('欢迎语新增成功');
      history.push('/welcome');
    }
    setSubmitLoading(false);
  };

  useEffect(() => {
    getLiveCodeDetail();
  }, []);

  return (
    <Spin spinning={getDetailLoading} tip="加载中...">
      <div className={style.wrap}>
        <BreadCrumbs
          navList={[
            {
              path: '/welcome',
              name: '欢迎语列表'
            },
            { name: '新增欢迎语' }
          ]}
        />
        <div className={style.tip}>
          1 、如企业在企业微信后台设置了欢迎语，此处设计的欢迎语不会生效，
          <br />
          2、一个成员如果被设置了多个欢迎语，将会使用最新设置或修改的欢迎语。
        </div>
        <Form className="mt24" form={form} onValuesChange={onValuesChangeHandle} onFinish={onFinishHandle}>
          <Item label="选择使用成员" name="groupId" rules={[{ required: true, message: '选择使用成员' }]}>
            <SetUserGroup form={form} />
          </Item>
          <Item label="发送欢迎语">
            <Form.Item name="welcomeWord">
              <CustomTextArea maxLength={100} disabled={readOnly} />
            </Form.Item>
            <Item noStyle name="welcomes" rules={[{ required: true, message: '请配置' }]}>
              <AddMarket disabled={readOnly} />
            </Item>
            <Preview className={style.preview} value={previewValue} />
          </Item>
          <div className={style.btnWrap}>
            <Button
              className={style.submitBtn}
              type="primary"
              htmlType="submit"
              disabled={readOnly}
              loading={submitLoading}
            >
              确定
            </Button>
            <Button className={style.cancelBtn} onClick={() => history.goBack()}>
              {readOnly ? '返回' : '取消'}
            </Button>
          </div>
        </Form>
      </div>
    </Spin>
  );
};
export default AddWelcome;
