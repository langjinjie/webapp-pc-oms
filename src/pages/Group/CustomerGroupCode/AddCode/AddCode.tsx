import React, { useEffect, useState } from 'react';
import { Button, DatePicker, Form, Input, message } from 'antd';
import { BreadCrumbs, ImageUpload } from 'src/components';
import { SetUserRightFormItem } from 'src/pages/Marketing/Components/SetUserRight/SetUserRight';
import ChatGroupSelected from './ChatGroupSelected/ChatGroupSelected';
import Preview from './Preview/Preview';
import { urlSearchParams } from 'src/utils/base';
import { RouteComponentProps } from 'react-router';
import { addChatGroupCode, getLiveCodeDetail } from 'src/apis/group';
import moment from 'moment';
const Item = Form.Item;
const AddCode: React.FC<RouteComponentProps> = ({ location, history }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);

  const [formValues, setFormValues] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeForm] = Form.useForm();
  const getDetail = async () => {
    const { liveId, isView } = urlSearchParams(location.search);
    if (liveId) {
      if (isView) {
        setIsView(true);
      } else {
        setIsEdit(true);
      }
      const res = await getLiveCodeDetail({ liveId });

      setFormValues(res);
      const { expireDate, ...otherValues } = res;

      codeForm.setFieldsValue({ ...otherValues, expireDate: moment(expireDate) });
    }
  };
  useEffect(() => {
    getDetail();
  }, []);

  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    const { expireDate, name, liveCode, staffGroupId, chatList, isSet } = values;
    const res = await addChatGroupCode({
      liveId: formValues.liveId,
      name,
      expireDate: expireDate.format('YYYY-MM-DD'),
      liveCode,
      staffGroupId,
      chatList,
      staffScope: isSet ? 2 : 1
    });
    setIsSubmitting(false);
    if (res) {
      message.success('保存成功', 1000, () => {
        history.goBack();
      });
    }
  };
  return (
    <div className="edit container">
      <BreadCrumbs
        navList={[
          {
            name: '群活码管理'
          },
          { name: isEdit ? '编辑群活码' : isView ? '查看群活码' : '新增群活码' }
        ]}
      />
      <div className="flex">
        <Form
          className="mt20"
          form={codeForm}
          onFinish={onFinish}
          onValuesChange={(_, values) => setFormValues((formValues: any) => ({ ...formValues, ...values }))}
        >
          <Item
            label="群活码名称"
            name="name"
            rules={[
              { required: true, message: '请输入群活码名称' },
              { max: 30, message: '群活码名称长度最多为30位' }
            ]}
          >
            <Input disabled={isView} placeholder="请输入" className="width400" />
          </Item>
          <Item
            style={{
              width: '600px'
            }}
            label="企业微信群"
            rules={[
              { required: true, message: '请选择微信群' },
              { type: 'array', max: 5, message: '最多支持5个群' }
            ]}
            name={'chatList'}
            extra="最多支持5个群，外部群（客户群）上限500，入群人数超过200人将自动进入下一个群，超过200的群不在支持二维码入群，需群里人手动邀请人员加入群聊直到上限500"
          >
            <ChatGroupSelected readonly={isView} />
          </Item>
          <Item label="有效期" name={'expireDate'} rules={[{ required: true, message: '请选择有效期' }]}>
            <DatePicker disabled={isView} disabledDate={(date) => date && date < moment().startOf('day')}></DatePicker>
          </Item>
          <Item label="使用员工" name={'staffGroupId'}>
            <SetUserRightFormItem allText="全部员工" readonly={isEdit || isView} partText="部分员工" form={codeForm} />
          </Item>
          <Item
            name={'liveCode'}
            rules={[
              {
                required: true,
                message: '请添加群二维码'
              }
            ]}
            label="添加群二维码"
            extra="支持jpg/png格式，大小不超过2M"
          >
            <ImageUpload disabled={isView} />
          </Item>

          {!isView && (
            <Item className="formFooter">
              <Button type="primary" htmlType="submit" shape="round" loading={isSubmitting}>
                保存
              </Button>
            </Item>
          )}
        </Form>

        <Preview value={formValues} />
      </div>
    </div>
  );
};

export default AddCode;
