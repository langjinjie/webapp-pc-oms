import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Radio, Space, Button } from 'antd';
import { ImageUpload, SetGroupChat } from 'src/components';
import { formatDate } from 'src/utils/base';
import { requestAddCheckInActivityBase, requestCheckInActivityDetail } from 'src/apis/marketingActivity';
import { useHistory } from 'react-router-dom';
import moment, { Moment } from 'moment';
import classNames from 'classnames';
import style from './style.module.less';
import qs from 'qs';

const { Item } = Form;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const BasicSettings: React.FC<{
  onConfirm: () => void;
  activityInfoOnChange?: (value: { actId: string; subject: string }) => void;
}> = ({ onConfirm, activityInfoOnChange }) => {
  const [groupRequire, setGroupRequire] = useState<number>();
  const [startTime, setStartTime] = useState<Moment>();

  const [form] = Form.useForm();
  const history = useHistory();

  // 获取活动详情
  const getDetail = async () => {
    const { actId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (!actId) return;
    const res = await requestCheckInActivityDetail({ actId });
    if (res) {
      const { startTime, endTime, chatIds = [] } = res;
      // 格式化群字段
      res.chatIds = (chatIds || []).map(({ chatId, chatName }: { chatId: string; chatName: string }) => ({
        chatId,
        groupName: chatName
      }));
      // 处理在群要求
      setGroupRequire(res.chatIds?.length ? 1 : 0);
      // 处理活动时间
      const activityTime = [moment(startTime, 'YYYY-MM-DD HH:mm:ss'), moment(endTime, 'YYYY-MM-DD HH:mm:ss')];
      form.setFieldsValue({ ...res, activityTime });
      activityInfoOnChange?.({ actId: res.actId, subject: res.subject });
    }
  };

  // 提交
  const onFinish = async (values?: any) => {
    let { chatIds } = values;
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
    // signText 默认为 再接再厉
    const res = await requestAddCheckInActivityBase({
      ...values,
      startTime,
      endTime,
      chatIds,
      signText: values.signText || '再接再厉'
    });
    if (res) {
      // 将活动名称和活动id保存下来
      onConfirm();
      activityInfoOnChange?.({ actId: res.actId, subject: values.subject });
      // 在url上拼上activityId
      history.push(`/checkIn/add?actId=${res.actId}`);
    }
  };

  // 选中时间的回调 不能操作value，操作value会修改选择的时间
  const onCalendarChange: (value: any) => void = (value) => {
    if (value && value[0]) {
      setStartTime(moment(value[0].valueOf()).add(30, 'days'));
    } else {
      setStartTime(undefined);
    }
  };

  // 禁止选择今天及之前的日期
  const disabledDate = (current: Moment) => {
    if (startTime) {
      return current > startTime;
    }
    return current < moment().startOf('days');
  };

  useEffect(() => {
    getDetail();
  }, []);
  return (
    <div className={style.wrap}>
      <Form form={form} scrollToFirstError={{ block: 'center', behavior: 'smooth' }} onFinish={onFinish}>
        <Item name="subject" label="活动名称" rules={[{ required: true, message: '请输入活动名称，30字以内' }]}>
          <Input className="width480" placeholder="请输入活动名称，30字以内" maxLength={30} />
        </Item>
        {/* 活动时间,最后解析成 startTime endTime */}
        <Item name="activityTime" label="活动时间" rules={[{ required: true, message: '请输入活动时间，20字以内' }]}>
          <RangePicker onCalendarChange={onCalendarChange} disabledDate={disabledDate} />
        </Item>
        <Item name="desc" label="活动规则" rules={[{ required: true, message: '请输入活动规则，1000字以内' }]}>
          <TextArea className={style.textArea} placeholder="请输入活动规则，1000字以内" maxLength={1000} />
        </Item>
        <div className={style.panel}>规则控制</div>
        <Item className="mt20" label="在群要求" required>
          <Item name="limitType" noStyle>
            <Radio.Group onChange={(e) => setGroupRequire(e.target.value)}>
              <Space direction="vertical">
                <Radio value={0}>
                  任意外部群成员 <span className="color-text-placeholder">客户经理群内成员皆可</span>
                </Radio>
                <Radio value={1}>指定群成员</Radio>
              </Space>
            </Radio.Group>
          </Item>
          {groupRequire === 1 && (
            <>
              {/* chatIds: {chatId: string; chatName: string}[] */}
              <Item name="chatGroupIds">
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
        {/* <Item label="参与次数" required>
          <Item name="limitType" noStyle>
            <Radio.Group>
              <Radio value={1}>不限制</Radio>
              <Radio value={2}>限制</Radio>
            </Radio.Group>
          </Item>
          <span>
            <Item name="" noStyle>
              <Input className="width100 mr10" placeholder="请输入" />
            </Item>
            次<span className={classNames(style.tipsText, 'ml20')}>提醒：多次参与奖品</span>
          </span>
        </Item> */}
        <div className={style.panel}>页面设置</div>
        <Item
          className="mt20"
          name="bgImgUrl"
          label="主页头图"
          rules={[{ required: true, message: '请上传主页头图' }]}
          extra="仅支持JPG/JPEG/PNG格式，尺寸为750*440且大小小于5MB的图片"
        >
          <ImageUpload />
        </Item>
        <Item name="themeBgcolour" label="主背景色">
          <Input className={style.colorPicker} type="color" />
        </Item>
        <Item name="buttonBgcolour" label="按钮背景色">
          <Input className={style.colorPicker} type="color" />
        </Item>
        <Item name="wordBgcolour" label="文字颜色">
          <Input className={style.colorPicker} type="color" />
        </Item>
        <div className={style.panel}>奖励设置</div>
        <Item
          className="mt20"
          name="signLogo"
          label="签到图标"
          rules={[{ required: true, message: '请上传主页头图' }]}
          extra="仅支持JPG/JPEG/PNG格式，尺寸为750*440且大小小于5MB的图片"
        >
          <ImageUpload />
        </Item>
        <Item name="signText" label="签到文案">
          <Input className="width480" placeholder="4个字内，不填写默认“再接再厉" maxLength={4} />
        </Item>
        <div className={style.panel}>分享设置</div>
        <Item
          className="mt20"
          name="shareImgUrl"
          label="分享缩略图"
          rules={[{ required: true, message: '请上传分享缩略图' }]}
        >
          <ImageUpload />
        </Item>
        <Item name="speechcraft" label="分享标题" rules={[{ required: true, message: '请输入分享标题' }]}>
          <Input className="width240" placeholder="24个字内，不填写默认“打卡赢好礼”" maxLength={24} />
        </Item>
        <Item name="noticeText" label="分享摘要" rules={[{ required: true, message: '请输入分享摘要' }]}>
          <Input className="width240" placeholder="30个字内，不填写默认“我正在参加打卡活动”" maxLength={30} />
        </Item>
        <Button className={style.submitBtn} htmlType="submit" type="primary" shape="round">
          保存
        </Button>
      </Form>
    </div>
  );
};
export default BasicSettings;
