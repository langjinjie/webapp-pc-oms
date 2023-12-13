import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Radio, Space, Button, InputNumber } from 'antd';
import { ImageUpload, SetGroupChat } from 'src/components';
import { formatDate } from 'src/utils/base';
import { requestAddQuestionActivityBase, requestQuestionActivityDetail } from 'src/apis/marketingActivity';
import { useHistory } from 'react-router-dom';
import Preview from './Preview';
import classNames from 'classnames';
import style from './style.module.less';
import qs from 'qs';
import moment from 'moment';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const BasicSettings: React.FC<{
  onConfirm: () => void;
  activityInfoOnChange?: (value: { activityId: string; activityName: string }) => void;
}> = ({ onConfirm, activityInfoOnChange }) => {
  const [groupRequire, setGroupRequire] = useState<number>();
  const [isLimitCount, setIsLimitCount] = useState<number>(1);
  const [previewVal, setPreviewVal] = useState<any>({
    themeColor: '#2A2AE8',
    buttonBgColor: '#FFC403',
    textColor: '#ffffff'
  });

  const [form] = Form.useForm();
  const history = useHistory();

  // 获取活动详情
  const getDetail = async () => {
    const { activityId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (!activityId) return;
    const res = await requestQuestionActivityDetail({ activityId });
    if (res) {
      const { chatIds, playNum, startTime, endTime } = res;
      // 格式化群字段
      res.chatIds = (res.chatIds || []).map(({ chatId, chatName }: { chatId: string; chatName: string }) => ({
        chatId,
        groupName: chatName
      }));
      // 处理在群要求
      setGroupRequire(chatIds?.length ? 2 : 1);
      // 处理参与次数限制
      setIsLimitCount(playNum ? 2 : 1);
      // 处理活动时间
      const activityTime = [moment(startTime, 'YYYY-MM-DD HH:mm:ss'), moment(endTime, 'YYYY-MM-DD HH:mm:ss')];
      form.setFieldsValue({ ...res, playNum: playNum || undefined, activityTime });
      setPreviewVal({ ...res, playNum: playNum || undefined, activityTime });
      activityInfoOnChange?.({ activityId: res.activityId, activityName: res.activityName });
    }
  };

  // 提交
  const onFinish = async (values?: any) => {
    let { chatIds, playNum = 0 } = values;
    const { activityId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    // 处理时间
    const [startTime, endTime] = formatDate(values?.activityTime);
    delete values.activityTime;
    if (chatIds) {
      // 处理群字段,原字段: {chatId: string; groupName: string}[] 需要格式化成 {chatId: string; chatName: string}[],
      chatIds = chatIds.map(({ chatId, groupName }: { chatId: string; groupName: string }) => ({
        chatId,
        chatName: groupName
      }));
    }
    const res = await requestAddQuestionActivityBase({ ...values, startTime, endTime, chatIds, playNum, activityId });
    if (res) {
      // 在url上拼上activityId
      history.push(`/questionActivity/add?activityId=${res.activityId}`);
      // 将活动名称和活动id保存下来
      onConfirm();
      activityInfoOnChange?.({ activityId: res.activityId, activityName: values.activityName });
    }
  };
  console.log('基础设置渲染了');
  useEffect(() => {
    getDetail();
  }, []);
  return (
    <div className={style.wrap}>
      <Form
        form={form}
        scrollToFirstError={{ block: 'center', behavior: 'smooth' }}
        onFinish={onFinish}
        onValuesChange={(_: any, values?: any) => setPreviewVal(values)}
      >
        <Item name="activityName" label="活动名称" rules={[{ required: true, message: '请输入活动名称，30字以内' }]}>
          <Input className="width480" placeholder="请输入活动名称，30字以内" maxLength={30} />
        </Item>
        {/* 活动时间,最后解析成 startTime endTime */}
        <Item name="activityTime" label="活动时间" rules={[{ required: true, message: '请输入活动时间，20字以内' }]}>
          <RangePicker />
        </Item>
        <Item name="activityDesc" label="活动规则" rules={[{ required: true, message: '请输入活动规则，1000字以内' }]}>
          <TextArea className={style.textArea} placeholder="请输入活动规则，1000字以内" maxLength={1000} />
        </Item>
        <div className={style.panel}>规则控制</div>
        <Item className="mt20" label="在群要求" required>
          <Item noStyle>
            <Radio.Group value={groupRequire} onChange={(e) => setGroupRequire(e.target.value)}>
              <Space direction="vertical">
                <Radio value={1}>
                  达成条件即可奖励 <span className="color-text-placeholder">客户经理群内成员皆可</span>
                </Radio>
                <Radio value={2}>指定群成员</Radio>
              </Space>
            </Radio.Group>
          </Item>
          {groupRequire === 2 && (
            <>
              {/* chatIds: {chatId: string; chatName: string}[] */}
              <Item name="chatIds">
                {/* {chatId: string; groupName: string}[] */}
                <SetGroupChat className="mt10" />
              </Item>
              <div className={classNames(style.tips, style.tipsText)}>
                提醒：
                <br />
                1、因企微信息同步存在时差，如出现客户在群活动提醒不在群的建议客户次日尝试
                <br />
                2、微信迁移至企微的群聊不可参与活动
              </div>
            </>
          )}
        </Item>
        <Item label="参与次数" required>
          {/* <Item name="参与次数" noStyle> */}
          <Radio.Group value={isLimitCount} onChange={(e) => setIsLimitCount(e.target.value)}>
            <Radio value={1}>不限制</Radio>
            <Radio value={2}>限制</Radio>
          </Radio.Group>
          {/* </Item> */}
          {isLimitCount === 2 && (
            <span>
              <Item name="playNum" noStyle>
                <InputNumber className={classNames(style.inputNumber, 'width100')} placeholder="请输入" />
              </Item>
              次<span className={classNames(style.tipsText, 'ml20')}>提醒：多次参与奖品也只能领取一次</span>
            </span>
          )}
        </Item>
        <div className={style.panel}>页面设置</div>
        <Item
          className="mt20"
          name="activityPoster"
          label="主页头图"
          rules={[{ required: true, message: '请上传主页头图' }]}
          extra="仅支持JPG/JPEG/PNG格式，尺寸为750*440且大小小于5MB的图片"
        >
          <ImageUpload />
        </Item>
        <Item name="themeColor" label="主背景色" initialValue={'#2A2AE8'}>
          <Input className={style.colorPicker} type="color" />
        </Item>
        <Item name="buttonBgColor" label="按钮背景色" initialValue={'#FFC403'}>
          <Input className={style.colorPicker} type="color" />
        </Item>
        <Item name="textColor" label="文字颜色" initialValue={'#ffffff'}>
          <Input className={style.colorPicker} type="color" />
        </Item>
        <div className={style.panel}>分享设置</div>
        <Item className="mt20" name="activityShareImg" label="分享缩略图">
          <ImageUpload />
        </Item>
        <Item name="shareTitle" label="分享标题">
          <Input className="width240" placeholder="24个字内，不填写默认“答题赢好礼”" maxLength={24} />
        </Item>
        <Item name="shareDesc" label="分享摘要">
          <Input className="width240" placeholder="30个字内，不填写默认“我正在参加答题活动”" maxLength={30} />
        </Item>
        <Button className={style.submitBtn} htmlType="submit" type="primary" shape="round">
          保存
        </Button>
      </Form>

      <Preview className={style.preview} value={previewVal} title={previewVal?.shareTitle || '有奖答题'} />
    </div>
  );
};
export default BasicSettings;
