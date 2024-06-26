import React, { useEffect, useState } from 'react';
import { Button, Form, Input, message, Radio } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { BreadCrumbs, ImageUpload, SelectOrg } from 'src/components';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import { requestGetGroupLiveCodeDetail, requestEditGroupLiveCode } from 'src/apis/liveCode';
import { IGroupLive } from 'src/pages/LiveCode/MomentCode/components/Preview/Preview';
import { Preview, FilterChannelTag, AccessChatModal } from '../components';
import classNames from 'classnames';
import qs from 'qs';
import style from './style.module.less';

const AddCode: React.FC = () => {
  const [readOnly, setReadOnly] = useState(false);
  const [channelTagList, setChannelTagList] = useState<IChannelTagList[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewValue, setPreviewValue] = useState<IGroupLive>();

  const [form] = Form.useForm();
  const { Item } = Form;
  // const { TextArea } = Input;

  const history = useHistory();
  const location = useLocation();

  // 获取投放渠道标签
  const getChannelGroupList = async () => {
    const res = await requestGetChannelGroupList({ groupName: '投放渠道' });
    if (res) {
      setChannelTagList(res.list?.[0]?.tagList || []);
    }
  };

  // 获取群活码详情
  const getLiveCodeDetail = async () => {
    const { liveId, readOnly } = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (readOnly) {
      setReadOnly(true);
    }
    if (liveId) {
      const res = await requestGetGroupLiveCodeDetail({ liveId });
      form.setFieldsValue({ ...res, channelTagList: res.channelTagList[0]?.tagId || '' });
      setPreviewValue({ name: res.name, word: res.word, codeList: res.codeList, customerWord: res.customerWord });
    }
  };

  // 提交表单
  const onFinishHandle = async (values: any) => {
    setLoading(true);
    const { liveId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    const res = await requestEditGroupLiveCode({
      liveId,
      ...values,
      channelTagList: [channelTagList.find((findItem) => findItem.tagId === values.channelTagList)],
      notifyUser: (values.notifyUsers || []).map((mapItem: any) => mapItem.userId).toString(),
      notifyUsers: undefined
    });
    if (res) {
      message.success(`群活码${liveId ? '编辑' : '新增'}成功`);
      history.push('/momentCode');
    }
    setLoading(false);
  };

  //
  const onValuesChangeHandle = (changedValues: any, values: any) => {
    const key = Object.keys(changedValues)?.[0];
    const changedValuesList = ['name', 'word', 'codeList', 'customerWord'];
    if (changedValuesList.includes(key)) {
      // @ts-ignore
      setPreviewValue((previewValue) => ({ ...previewValue, [key]: values[key] }));
    }
  };

  useEffect(() => {
    setReadOnly(false);
    getChannelGroupList();
    getLiveCodeDetail();
  }, []);
  return (
    <div className={style.wrap}>
      <BreadCrumbs
        navList={[
          {
            path: '/momentCode',
            name: '群活码'
          },
          { name: '新增群活码' }
        ]}
      />
      <Form
        form={form}
        className={style.form}
        onFinish={onFinishHandle}
        // @ts-ignore
        initialValues={location.state?.row || {}}
        onValuesChange={onValuesChangeHandle}
      >
        <div className={style.panel}>
          <div className={style.title}>基本信息</div>
          <div className={style.content}>
            <Item
              label="活码名称"
              name="name"
              rules={[{ required: true, max: 30, message: '请输入30个字以内的活码名称' }]}
            >
              <Input
                placeholder="待输入"
                disabled={readOnly}
                className={classNames(style.input, 'width480')}
                readOnly={readOnly}
                showCount
                maxLength={50}
              />
            </Item>
            <Item label="活码备注" name="remark">
              <Input className={style.input} placeholder="待输入" disabled={readOnly} maxLength={30} showCount />
            </Item>
            <Item
              label="引导语"
              name="word"
              // rules={[{ required: true, max: 30, message: '请输入30个字以内的任务名称' }]}
            >
              <Input
                placeholder="待输入"
                disabled={readOnly}
                className={style.input}
                readOnly={readOnly}
                showCount
                maxLength={30}
              />
            </Item>
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>客服设置</div>
          <div className={style.content}>
            <Item
              label="客服二维码"
              name="customerCode"
              // extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持.jpg格式"
            >
              <ImageUpload disabled={readOnly} />
              {/* <Input placeholder="请输入链接" className={style.input} /> */}
            </Item>
            <Item label="客户引导话术" name="customerWord">
              <Input
                className={style.input}
                placeholder="如无法进群，请及时联系我"
                showCount
                maxLength={30}
                disabled={readOnly}
              />
            </Item>
            <Item label="过期提醒人员" name="notifyUsers">
              <SelectOrg className={style.input} />
            </Item>
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>群二维码管理</div>
          <div className={classNames(style.content, style.previewContent)}>
            <Item
              name="codeList"
              className={style.codeListItem}
              required
              rules={[{ required: true, message: '请接入群聊' }]}
            >
              <AccessChatModal disabled={readOnly} />
            </Item>

            <div className={style.preview}>
              <Preview value={previewValue} />
            </div>
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>渠道设置</div>
          <div className={style.content}>
            <Item label="活码头像" name="logo" extra="建议上传尺寸：50*50px，图片比例1:1，大小不超过2MB">
              <ImageUpload disabled={readOnly} />
            </Item>
            <Item label="渠道标签">
              <div className={style.channelTag}>
                <Item
                  name="channelTagList"
                  label="投放渠道标签"
                  rules={[{ required: true, message: '请选择投放渠道' }]}
                  extra="*未找到适合的渠道，请联系管理员进行新增"
                >
                  <Radio.Group disabled={readOnly}>
                    {channelTagList.map((tagItem) => (
                      <Radio key={tagItem.tagId} value={tagItem.tagId}>
                        {tagItem.tagName}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Item>
                <Item label="其他渠道标签" name="otherTagList">
                  <FilterChannelTag disabled={readOnly} />
                </Item>
              </div>
            </Item>
            <div className={style.btnWrap}>
              <Button
                className={style.submitBtn}
                type="primary"
                htmlType="submit"
                disabled={readOnly}
                loading={loading}
              >
                确定
              </Button>
              <Button className={style.cancelBtn} onClick={() => history.goBack()}>
                {readOnly ? '返回' : '取消'}
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default AddCode;
