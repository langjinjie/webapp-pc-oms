import React, { useEffect, useState } from 'react';
import { BreadCrumbs, ImageUpload, Preview } from 'src/components';

// import style from './style.module.less';
// import classNames from 'classnames';
import { Button, Form, Input, Radio, Switch, message } from 'antd';
import { addGroupGreeting, editGroupGreeting, getGroupGreetingDetail } from 'src/apis/group';
import { RouteComponentProps } from 'react-router-dom';
import { urlSearchParams } from 'src/utils/base';

const GroupGreetingEdit: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [formValues, setFormValues] = useState<any>({
    isSetMedia: 1
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editForm] = Form.useForm();

  const getDetail = async () => {
    const { wcId } = urlSearchParams<{ wcId: string }>(location.search);
    if (wcId) {
      setIsEdit(true);
      const res = await getGroupGreetingDetail({ wcId });
      const values = {
        ...res,
        ...res?.mediaData,
        isSetMedia: res?.wcType > 1 ? 1 : 0,
        isSend: !!res?.isSend
      };

      console.log(values);

      setFormValues({ ...values });
      editForm.setFieldsValue(values);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  // 提交表单数据
  const onFinish = async (values: any) => {
    const { isSetMedia, mediaOrgUrl, linkTitle, linkPicurl, linkDesc, linkUrl, appid, isSend, ...otherValues } = values;
    let res;
    console.log(values);

    if (formValues.wcId) {
      res = await editGroupGreeting({
        wcId: formValues.wcId || undefined,
        wcType: isSetMedia || 1,
        isSend: isSend ? 1 : 0,
        mediaData: isSetMedia ? { mediaOrgUrl, linkTitle, linkPicurl, linkDesc, linkUrl, appid } : undefined,
        ...otherValues
      });
    } else {
      res = await addGroupGreeting({
        wcType: isSetMedia || 1,
        isSend: isSend ? 1 : 0,
        mediaData: isSetMedia ? { mediaOrgUrl, linkTitle, linkPicurl, linkDesc, linkUrl, appid } : undefined,
        ...otherValues
      });
    }
    if (res) {
      message.success(formValues.wcId ? '编辑成功' : '新增成功！');
      history.goBack();
    }
  };
  return (
    <div className="container edit">
      <BreadCrumbs
        navList={[
          {
            name: '群欢迎语'
          },
          { name: isEdit ? '编辑欢迎语' : '新增欢迎语' }
        ]}
      />

      {/* <div className={classNames(style.notice, 'mt20')}>
        注：如果你已经在企业微信后台设置过欢迎语，系统设置的欢迎语可能不生效，如出现此问题，可联系企业微信超级管理员，登录后台检查是否已经配置过欢迎语。
      </div> */}
      <div className="flex mt30">
        <div className="cell" style={{ maxWidth: '600px' }}>
          <Form
            initialValues={formValues}
            form={editForm}
            onValuesChange={(_, values) => setFormValues((formValues: any) => ({ ...formValues, ...values }))}
            onFinish={onFinish}
          >
            <Form.Item
              label="欢迎语名称"
              name="title"
              rules={[{ required: true }, { max: 30, message: '名称30字以内' }]}
              extra="30字以内，仅内部展示，不对客户展示"
            >
              <Input type="text" placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="欢迎语内容"
              name="content"
              rules={[{ required: true }, { max: 300, message: '请把内容长度控制在300字内' }]}
            >
              <Input.TextArea maxLength={300} placeholder="请输入欢迎语内容，300字以内"></Input.TextArea>
            </Form.Item>
            <Form.Item label="附属内容" name="isSetMedia" rules={[{ required: true }]}>
              <Radio.Group>
                <Radio value={1}>配置</Radio>
                <Radio value={0}>不配置</Radio>
              </Radio.Group>
            </Form.Item>
            {!!formValues.isSetMedia && (
              <>
                <Form.Item label="类型" name="wcType" rules={[{ required: true }]}>
                  <Radio.Group>
                    <Radio value={2}>图片</Radio>
                    <Radio value={3}>链接</Radio>
                    <Radio value={4}>小程序</Radio>
                  </Radio.Group>
                </Form.Item>
                {formValues.wcType === 2
                  ? (
                  <Form.Item label="上传图片" name={'mediaOrgUrl'} rules={[{ required: true, message: '请上传图片' }]}>
                    <ImageUpload></ImageUpload>
                  </Form.Item>
                    )
                  : (
                  <>
                    <Form.Item
                      label={formValues.wcType === 4 ? '小程序路径' : '链接'}
                      name="linkUrl"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="分享标题" name={'linkTitle'} rules={[{ required: true }]}>
                      <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="分享摘要" name={'linkDesc'} rules={[{ required: true }]}>
                      <Input placeholder="请输入" />
                    </Form.Item>
                    <Form.Item
                      label="分享封面"
                      extra="仅支持JPG/JPEG/PNG格式，尺寸为150*150且大小小于1MB的图片"
                      name={'linkPicurl'}
                      rules={[{ required: true, message: '请上传分享封面图片' }]}
                    >
                      <ImageUpload></ImageUpload>
                    </Form.Item>
                  </>
                    )}

                {formValues.wcType === 4 && (
                  <Form.Item label="小程序AppID" name="appid" rules={[{ required: true, message: '请输入小程序ID' }]}>
                    <Input placeholder="请输入小程序AppID" />
                  </Form.Item>
                )}
              </>
            )}
            <Form.Item
              label="消息通知"
              valuePropName="checked"
              name="isSend"
              extra="开启后，会推送消息给所有客户群为群主的成员"
            >
              <Switch checkedChildren="开" unCheckedChildren="关" disabled={formValues.wcId} />
            </Form.Item>
            <Form.Item className="formFooter">
              <Button type="primary" htmlType="submit" shape="round">
                保存
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="ml40">
          <Preview
            title="群欢迎语预览"
            value={{
              speechcraft: formValues.content,
              pushTime: '',
              actionRule: {
                contentType: formValues.wcType === 1 ? 0 : formValues.wcType,
                itemIds:
                  formValues.wcType === 1
                    ? []
                    : [
                        {
                          itemId: '',
                          itemName: formValues.linkTitle,
                          speechcraft: '',
                          itemShareImgUrl: formValues.linkPicurl,
                          itemUrl: formValues.mediaOrgUrl
                        }
                      ]
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupGreetingEdit;
