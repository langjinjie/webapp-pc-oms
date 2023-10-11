import React, { useEffect, useState } from 'react';
import { Form, Input, Radio, Checkbox, Select, Button, message } from 'antd';
import { BreadCrumbs, ImageUpload } from 'src/components';
import { ChooseLiveCode, Preview } from 'src/pages/PublicManage/ActivityReservation/components';
import { IValue } from 'src/pages/PublicManage/ActivityReservation/components/Preview/Preview';
import { IChannelTagList } from 'src/pages/Operation/ChannelTag/Config';
import { requestGetChannelGroupList } from 'src/apis/channelTag';
import { requestCreateActivityLeadActivity, requestActivityLeadActivityDetail } from 'src/apis/publicManage';
import { RouteComponentProps } from 'react-router-dom';
import FilterChannelTag from 'src/pages/LiveCode/MomentCode/components/FilterChannelTag/FilterChannelTag';
import classNames from 'classnames';
import style from './style.module.less';
import qs from 'qs';

const { TextArea } = Input;
const { Item } = Form;
const { Group } = Radio;

interface IChannelTagListProps {
  channelTagList?: IChannelTagList[];
  value?: IChannelTagList[];
  onChange?: (value?: IChannelTagList[]) => void;
  disabled?: boolean;
}

// 选择渠道标签
const ChannelTagGroup: React.FC<IChannelTagListProps> = ({ channelTagList, value, onChange, disabled }) => {
  const onChangeHandle = (tagItem: IChannelTagList) => {
    if (disabled) return;
    onChange?.([tagItem]);
  };

  return (
    <>
      {(channelTagList || []).map((tagItem) => (
        <Radio
          disabled={disabled}
          key={tagItem.tagId}
          value={tagItem.tagId}
          checked={value?.some(({ tagId }) => tagId === tagItem.tagId)}
          onClick={() => onChangeHandle(tagItem)}
        >
          {tagItem.tagName}
        </Radio>
      ))}
    </>
  );
};

const AddActivity: React.FC<RouteComponentProps> = ({ history }) => {
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
  const { leadActivityId } = qs.parse(location.search, { ignoreQueryPrefix: true }) as { leadActivityId: string };

  // 获取详情
  const getDetail = async () => {
    if (!leadActivityId) return;
    const res = await requestActivityLeadActivityDetail({ leadActivityId });
    if (res) {
      const {
        mainImgUrl,
        bgImgUrl,
        type,
        liveCodeType,
        needClientName,
        needPhone,
        needCarNumber,
        liveId,
        liveLogoUrl,
        liveMergeQrCode,
        liveName,
        liveQrCode
      } = res;
      // 处理类型
      setType(type);
      // 处理活码类型
      setLiveCodeType(liveCodeType);
      const liveCodeItem = { liveId, liveLogoUrl, liveMergeQrCode, liveName, liveQrCode };
      form.setFieldsValue({
        ...res,
        needClientName: needClientName ? [1] : undefined,
        needPhone: needPhone ? [needPhone] : undefined,
        needCarNumber: needCarNumber ? [needCarNumber] : undefined,
        liveCodeItem: [liveCodeItem]
      });
      setPreviewValue({
        mainImgUrl,
        bgImgUrl,
        needClientName,
        needPhone,
        needCarNumber,
        ...liveCodeItem
      });
    }
  };

  const onValuesChange = (changedValues: { [key: string]: any }, values: { [key: string]: any }) => {
    const { bgImgUrl, mainImgUrl, liveCodeItem, needClientName, needPhone, needCarNumber } = values;
    setPreviewValue({
      mainImgUrl,
      bgImgUrl,
      needClientName: needClientName?.[0],
      needPhone: needPhone?.[0],
      needCarNumber: needCarNumber?.[0],
      ...liveCodeItem?.[0]
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
    let { needClientName, needPhone, needCarNumber, type, liveCodeItem } = values;
    // 处理人工留资 type = 1
    if (type === 1) {
      needClientName = needClientName?.[0] || 0;
      needPhone = needPhone?.[0] || 0;
      needCarNumber = needCarNumber?.[0] || 0;
    }
    // 处理活码 type = 2
    if (type === 2) {
      liveCodeItem = liveCodeItem[0];
      delete values.liveCodeItem;
    }
    const res = await requestCreateActivityLeadActivity({
      leadActivityId,
      ...values,
      needClientName,
      needPhone,
      needCarNumber,
      ...liveCodeItem
    });
    if (res) {
      message.success(`活动${leadActivityId ? '编辑' : '新增'}成功`);
      history.push('/activityReservation');
    }
  };

  useEffect(() => {
    getChannelGroupList();
    getDetail();
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
            <Item label="活动名称" name="leadActivityName" rules={[{ required: true, message: '请输入活动名称' }]}>
              <Input className={style.input} placeholder="请输入活动名称" readOnly={!!leadActivityId} />
            </Item>
            <Item label="活动备注" name="remark">
              <TextArea className={style.textArea} placeholder="请输入活动备注" readOnly={!!leadActivityId} />
            </Item>
          </div>
        </div>
        <div className={style.panel}>
          <div className={style.title}>配置活动</div>
          {/* {liveCodeType === 1 || ( */}
          <div className={style.preview}>
            <Preview type={type} value={previewValue} />
          </div>
          {/* )} */}
          <div className={style.content}>
            <Item
              label="上传背景图"
              name="bgImgUrl"
              extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持.jpg格式"
              rules={[{ required: true, message: '请上传背景图' }]}
            >
              <ImageUpload disabled={!!leadActivityId} />
            </Item>
            <Item
              label="上传主图"
              name="mainImgUrl"
              extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持.jpg格式"
              rules={[{ required: true, message: '请上传上传主图' }]}
            >
              <ImageUpload disabled={!!leadActivityId} />
            </Item>
            <Item label="选择类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
              <Group disabled={!!leadActivityId}>
                <Radio value={1}>人工留资</Radio>
                <Radio value={2}>活码</Radio>
              </Group>
            </Item>
            {/* 人工留资 */}
            {type === 1 && (
              <Item label="留资选择">
                <Item name="needClientName" noStyle>
                  <Checkbox.Group disabled={!!leadActivityId} options={[{ label: '客户姓名', value: 1 }]} />
                </Item>
                <Item name="needPhone" noStyle>
                  <Checkbox.Group disabled={!!leadActivityId} options={[{ label: '电话号码', value: 1 }]} />
                </Item>
                <Item name="needCarNumber" noStyle>
                  <Checkbox.Group disabled={!!leadActivityId} options={[{ label: '车牌号', value: 1 }]} />
                </Item>
              </Item>
            )}
            {/*  */}
            {type === 2 && (
              <Item label="活码类型" required>
                <Item name="liveCodeType" noStyle>
                  <Select
                    disabled={!!leadActivityId}
                    className={classNames(style.select, 'width160')}
                    options={[
                      { value: 1, label: '员工活码' },
                      { value: 2, label: '群活码' }
                    ]}
                    placeholder="请选择活码类型"
                  />
                </Item>
                <Item name="liveCodeItem" noStyle rules={[{ required: true, message: '请选择活码' }]}>
                  <ChooseLiveCode disabled={!!leadActivityId} liveCodeType={liveCodeType} />
                </Item>
              </Item>
            )}
            <Item label="企微客服链接" name="customerCode">
              <Input placeholder="请输入企微客服链接" className={style.input} />
            </Item>
            {/* 活码不展示渠道标签 */}
            {type === 1 && (
              <Item label="渠道标签">
                <div className={style.channelTag}>
                  <Item
                    name="channelTagList"
                    label="投放渠道标签"
                    rules={[{ required: true, message: '请选择投放渠道' }]}
                    extra="*未找到适合的渠道，请联系管理员进行新增"
                  >
                    <ChannelTagGroup channelTagList={channelTagList} disabled={!!leadActivityId} />
                  </Item>
                  <Item label="其他渠道标签" name="otherTagList">
                    <FilterChannelTag disabled={!!leadActivityId} />
                  </Item>
                </div>
              </Item>
            )}
            <div className={style.btnWrap}>
              <Button
                className={style.submitBtn}
                type="primary"
                htmlType="submit"
                disabled={!!leadActivityId}
                // disabled={readOnly}
                // loading={loading}
              >
                确定
              </Button>
              <Button className={style.cancelBtn} onClick={() => history.goBack()}>
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
