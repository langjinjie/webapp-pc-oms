import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Checkbox, Select, Button, message } from 'antd';
import { BreadCrumbs, ImageUpload } from 'src/components';
import { ChooseLiveCode, Preview } from 'src/pages/PublicManage/ActivityReservation/components';
import { IValue } from 'src/pages/PublicManage/ActivityReservation/components/Preview/Preview';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { requestCreateActivityLeadActivity } from 'src/apis/publicManage';
import FilterChannelTag from 'src/pages/LiveCode/MomentCode/components/FilterChannelTag/FilterChannelTag';
import classNames from 'classnames';
import style from './style.module.less';
import qs from 'qs';

const { TextArea } = Input;
const { Item } = Form;
const { Group } = Radio;

const AddActivity: React.FC = () => {
  const [type, setType] = useState<1 | 2>();
  const [channelTagList, setChannelTagList] = useState<IChannelTagList[]>([]);
  const [liveCodeType, setLiveCodeType] = useState<1 | 2>();
  const [previewValue, setPreviewValue] = useState<IValue>({});

  const [form] = Form.useForm();

  // 获取投放渠道标签
  const getChannelGroupList = async () => {
    const res = await requestGetChannelGroupList({ groupName: '投放渠道' });
    if (res) {
      setChannelTagList(res.list?.[0]?.tagList || []);
    }
  };

  //
  const onValuesChange = (changedValues: { [key: string]: any }, values: { [key: string]: any }) => {
    const { mainImgUrl, chooseNeed = [], liveCodeItem } = values;
    setPreviewValue({
      mainImgUrl,
      ...chooseNeed.reduce((prev: { [key: string]: any }, key: string) => {
        return { ...prev, [key]: 1 };
      }, {}),
      ...liveCodeItem
    });
    const keyList = Object.keys(changedValues);
    // 活动类型处理
    if (keyList.includes('type')) {
      setType(changedValues.type);
    }
    // 活码类型处理
    if (keyList.includes('liveCodeType')) {
      setLiveCodeType(changedValues.liveCodeType);
    }
  };

  const onFinish = async (values: { [key: string]: any }) => {
    const { leadActivityId } = qs.parse(location.search) as { leadActivityId: string };
    console.log('values', values);
    const res = await requestCreateActivityLeadActivity({ leadActivityId, ...values });
    if (res) {
      console.log('res', res);
      message.success(`活动${leadActivityId ? '编辑' : '新增'}成功`);
    }
  };

  useEffect(() => {
    getChannelGroupList();
  }, []);

  return (
    <div className={style.wrap}>
      <BreadCrumbs
        navList={[
          {
            path: '/activityReservation',
            name: '预约活动'
          },
          { name: '新增活动' }
        ]}
      />
      <Form
        form={form}
        className={style.form}
        onValuesChange={onValuesChange}
        scrollToFirstError={{ block: 'center', behavior: 'smooth' }}
        onFinish={onFinish}
      >
        <div className={style.panel}>
          <div className={style.title}>基本信息</div>
          <div className={style.content}>
            <Item
              label="上传背景图1"
              name="bgImgUrl1"
              extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持.jpg格式"
              rules={[{ required: true, message: '请上传背景图' }]}
            >
              <ImageUpload />
            </Item>
            <Item label="活动名称" name="leadActivityName" rules={[{ required: true, message: '请输入活动名称' }]}>
              <Input className={style.input} placeholder="请输入活动名称" />
            </Item>
            <Item label="活动备注" name="remark">
              <TextArea className={style.textArea} placeholder="请输入活动备注" />
            </Item>
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>配置活动</div>
          {liveCodeType === 1 || (
            <div className={style.preview}>
              <Preview type={type} value={previewValue} />
            </div>
          )}
          <div className={style.content}>
            <Item
              label="上传背景图"
              name="bgImgUrl"
              extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持.jpg格式"
              rules={[{ required: true, message: '请上传背景图' }]}
            >
              <ImageUpload />
            </Item>
            <Item
              label="上传主图"
              name="mainImgUrl"
              extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持.jpg格式"
              rules={[{ required: true, message: '请上传上传主图' }]}
            >
              <ImageUpload />
            </Item>
            <Item label="选择类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
              <Group>
                <Radio value={1}>人工留资</Radio>
                <Radio value={2}>活码</Radio>
              </Group>
            </Item>
            {/* 人工留资 */}
            {type === 1 && (
              <Item label="留资选择" name="chooseNeed">
                <Checkbox.Group
                  options={[
                    { label: '客户姓名', value: 'needClientName' },
                    { label: '电话号码', value: 'needPhone' },
                    { label: '车牌号', value: 'needCarNumber' }
                  ]}
                />
              </Item>
            )}
            {/*  */}
            {type === 2 && (
              <Item label="活码类型">
                <Item name="liveCodeType" noStyle>
                  <Select
                    className={classNames(style.select, 'width160')}
                    options={[
                      { value: 1, label: '员工活码' },
                      { value: 2, label: '群活码' }
                    ]}
                    placeholder="请选择活码类型"
                  />
                </Item>
                <Item name="liveCodeItem" noStyle>
                  <ChooseLiveCode liveCodeType={liveCodeType} />
                </Item>
              </Item>
            )}
            <Item label="企微客服链接" name="customerCode">
              <Input placeholder="请输入企微客服链接" className={style.input} />
            </Item>
            <Item label="渠道标签">
              <div className={style.channelTag}>
                <Item
                  name="channelTagList"
                  label="投放渠道标签"
                  rules={[{ required: true, message: '请选择投放渠道' }]}
                  extra="*未找到适合的渠道，请联系管理员进行新增"
                >
                  <Radio.Group>
                    {channelTagList.map((tagItem) => (
                      <Radio key={tagItem.tagId} value={tagItem.tagId}>
                        {tagItem.tagName}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Item>
                <Item label="其他渠道标签" name="otherTagList">
                  <FilterChannelTag />
                </Item>
              </div>
            </Item>
            <div className={style.btnWrap}>
              <Button
                className={style.submitBtn}
                type="primary"
                htmlType="submit"
                // disabled={readOnly}
                // loading={loading}
              >
                确定
              </Button>
              <Button className={style.cancelBtn} onClick={() => history.back()}>
                {/* {readOnly ? '返回' : '取消'} */}
                返回
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default AddActivity;
