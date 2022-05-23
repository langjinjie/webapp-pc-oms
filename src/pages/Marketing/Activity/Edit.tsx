import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Form, Input, message, Button, Select, Radio } from 'antd';
import { getQueryParam } from 'lester-tools';
import { Context } from 'src/store';
import { activityDetail, activityEdit, productConfig } from 'src/apis/marketing';
import style from './style.module.less';
import classNames from 'classnames';
import NgUpload from '../Components/Upload/Upload';
import { WechatShare } from '../Components/WechatShare/WechatShare';
import { UploadFile } from 'src/components';
import { SetUserRightFormItem } from '../Components/SetUserRight/SetUserRight';

interface ActivityPageProps {
  id: number;
  type: number;
  history: any;
}

interface ActivityProps {
  groupId?: string;
  activityId?: string;
  activityName: string;
  corpactivityId?: string;
  corpactivityLink: string;
  speechcraft?: string;
  tags?: string;
  shareCoverImgUrl: string;
  shareTitle: string;
  [porp: string]: any;
}

interface Tag {
  id: string;
  name: string;
}

const { Group } = Radio;

const ActivityEdit: React.FC<ActivityPageProps> = ({ history }) => {
  const { userInfo } = useContext(Context);
  const [active, setActive] = useState<ActivityProps>({
    activityId: '',
    activityName: '',
    corpactivityLink: '',
    shareCoverImgUrl: '',
    shareTitle: ''
  });
  const [tags, setTags] = useState<Tag[]>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [displayType, setDisplayType] = useState<number>(1);
  const [oldSourceUrlParam, setOldSourceUrlParam] = useState({ displayType: 0, sourceUrl: '' });
  const [oldUrlParam, setOldUrlParam] = useState({ displayType: 0, url: '' });
  const [form] = Form.useForm();

  const getDetail = async (activityId: string) => {
    const res = await activityDetail({ activityId });
    if (res) {
      setActive(res);
      const {
        activityName,
        activityId,
        corpActivityLink,
        speechcraft,
        shareCoverImgUrl,
        shareTitle,
        tags = '',
        displayType,
        username,
        path,
        sourceUrl,
        groupId
      } = res;

      setDisplayType(displayType);

      form.setFieldsValue({
        activityName,
        activityId,
        groupId,
        corpActivityLink,
        speechcraft,
        tags: tags?.split(','),
        shareCoverImgUrl,
        shareTitle,
        displayType,
        username,
        path,
        sourceUrl
      });
    }
  };
  // 配置类型列表
  const displayTypeList = [
    { value: 1, label: '添加链接' },
    { value: 2, label: '小程序ID' },
    { value: 3, label: '上传图片' },
    { value: 4, label: '上传视频' }
  ];
  const getSystemAcTagConfig = async () => {
    const res = await productConfig({ type: [7] });
    const { acTagList = [] } = res;
    setTags(acTagList || []);
  };

  useEffect(() => {
    const activityId = getQueryParam('activityId');
    const isView = getQueryParam('isView');
    if (activityId) {
      getDetail(activityId);
    }
    if (isView) {
      setIsReadOnly(isView === 'true');
    }
    getSystemAcTagConfig();
  }, []);

  const onFinish = async (values: any) => {
    const { tags, groupId, ...otherValues } = values;
    delete otherValues.group1;
    delete otherValues.group2;
    const editParams = {
      ...otherValues,
      tags: tags.join(','),
      groupId: groupId || '',
      shareCoverImgUrl: active.shareCoverImgUrl,
      activityId: active.activityId
    };
    const res = await activityEdit(editParams);
    if (res) {
      message.success(active.activityId ? '编辑成功！' : '新增成功！');
      history.replace('/marketingActivity?pageNum=1');
    }
  };

  const beforeUpload = (file: any) => {
    const isJpg = file.type === 'image/jpeg';
    if (!isJpg) {
      message.error('你只可以上传 JPG 格式图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
    }
    return isJpg && isLt2M;
  };
  const beforeUploadImgHandle = (file: File): Promise<boolean> | boolean => {
    const isJpg = file.type === 'image/jpeg';
    if (!isJpg) {
      message.error('只能上传 JPG 格式的图片!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) message.error('图片大小不能超过5MB!');
    // 获取图片的真实尺寸
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        // @ts-ignore
        const data = e.target.result;
        // 加载图片获取图片真实宽度和高度
        const image = new Image();
        // @ts-ignore
        image.src = data;
        image.onload = function () {
          const width = image.width;
          if (!(width === 750)) {
            message.error('请上传正确的图片尺寸');
          }
          resolve(width === 750 && isJpg && isLt5M);
        };
      };
      reader.readAsDataURL(file);
    });
  };
  const beforeUploadMp4 = (file: any) => {
    const isMp4 = file.type === 'video/mp4';
    if (!isMp4) {
      message.error('你只可以上传 MP4 格式视频!');
    }
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.error('视频大小不能超过 100MB!');
    }
    return isMp4 && isLt100M;
  };

  const onFormValuesChange = (values: ActivityProps) => {
    const { shareTitle, activityName, shareCoverImgUrl } = values;
    setActive((active) => ({ ...active, shareTitle, activityName, shareCoverImgUrl }));
  };
  const onChangeDisplayType = (e: any) => {
    if (e.target.value === 1) {
      form.setFieldsValue({ ...form.getFieldsValue(), corpActivityLink: oldUrlParam.url });
    }
    if (displayType === 1) {
      setOldUrlParam({ displayType, url: form.getFieldsValue().corpActivityLink });
    }
    // 3,4 来回切换
    if ([3, 4].includes(displayType) && [3, 4].includes(e.target.value)) {
      // 将现在的sourceUrl保存起来,异步，不会立即生效
      setOldSourceUrlParam({ displayType, sourceUrl: form.getFieldsValue().sourceUrl });
      // 将上次保存的oldSourceUrlParam赋值
      if (oldSourceUrlParam.displayType === e.target.value) {
        form.setFieldsValue({ ...form.getFieldsValue(), sourceUrl: oldSourceUrlParam.sourceUrl });
      } else {
        form.setFieldsValue({ ...form.getFieldsValue(), sourceUrl: '' });
      }
    }
    // 从非3，4进入3，4
    if ([3, 4].includes(e.target.value) && ![3, 4].includes(displayType)) {
      if (oldSourceUrlParam.displayType !== e.target.value) {
        form.setFieldsValue({ ...form.getFieldsValue(), sourceUrl: '' });
      } else {
        form.setFieldsValue({ ...form.getFieldsValue(), sourceUrl: oldSourceUrlParam.sourceUrl });
      }
    }
    // 从3，4切换到外面
    if ([3, 4].includes(displayType) && ![3, 4].includes(e.target.value)) {
      if (form.getFieldsValue().sourceUrl) {
        setOldSourceUrlParam({ displayType, sourceUrl: form.getFieldsValue().sourceUrl });
      }
    }
    setDisplayType(e.target.value);
  };
  return (
    <Card title="活动配置" bordered={false} className="edit">
      <Form
        form={form}
        name="validate_other"
        onValuesChange={(changeValues, values) => {
          onFormValuesChange(values);
        }}
        onFinish={onFinish}
        initialValues={active}
      >
        <Form.Item
          label="活动名称："
          name="activityName"
          rules={[
            { required: true, message: '请输入活动名称' },
            { max: 40, message: '最多40个字符，不区分中英文' }
          ]}
        >
          <Input placeholder="请输入" readOnly={isReadOnly} className="width320" />
        </Form.Item>
        <Form.Item label="活动ID：" name="activityId">
          <Input
            placeholder="活动ID非必填字段，如无填写可用系统随机生成的活动ID"
            readOnly={isReadOnly}
            className="width320"
            maxLength={40}
          />
        </Form.Item>
        <Form.Item label="配置类型" name="displayType" required initialValue={1}>
          <Group onChange={onChangeDisplayType}>
            {displayTypeList.map((item) => (
              <Radio key={item.value + item.label} value={item.value}>
                {item.label}
              </Radio>
            ))}
          </Group>
        </Form.Item>
        {displayType === 1 && (
          <Form.Item label="活动链接：" name="corpActivityLink" rules={[{ required: true, message: '请输入活动链接' }]}>
            <Input placeholder="请输入" readOnly={isReadOnly} className="width320" />
          </Form.Item>
        )}
        {displayType === 2 && (
          <>
            <Form.Item label="小程序ID" name="username" rules={[{ required: true, message: '请输入小程序ID' }]}>
              <Input className="width320" placeholder="待添加" readOnly={isReadOnly} />
            </Form.Item>
            <Form.Item label="页面路径" name="path">
              <Input className="width320" placeholder="待输入，不填默认跳转小程序首页" readOnly={isReadOnly} />
            </Form.Item>
          </>
        )}
        {displayType === 3 && (
          <>
            <Form.Item
              label="图片文件"
              name="sourceUrl"
              rules={[{ required: true, message: '请上传图片' }]}
              extra="为确保最佳展示效果，请上传宽度为750像素高清图片，仅支持.jpg格式"
            >
              <NgUpload beforeUpload={beforeUploadImgHandle} />
            </Form.Item>
          </>
        )}
        {displayType === 4 && (
          <>
            <Form.Item
              label="视频文件"
              name="sourceUrl"
              rules={[{ required: true, message: '请上传视频' }]}
              extra="仅支持.mp4格式, 最大100MB"
            >
              <UploadFile bizKey="media" beforeUpload={beforeUploadMp4} />
            </Form.Item>
          </>
        )}
        <Form.Item
          className={style.selectTagWrap}
          name="tags"
          label="活动标签："
          rules={[{ type: 'array', required: true, message: '请选择活动标签' }]}
        >
          <Select placeholder="请选择" allowClear className={classNames('width320')} mode="tags" disabled={isReadOnly}>
            {tags?.map((tag, index) => {
              return (
                <Select.Option key={index} value={tag.name}>
                  {tag.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="speechcraft" label="营销话术：">
          <Input.TextArea
            maxLength={300}
            showCount
            placeholder="请输入"
            autoSize={{ minRows: 4 }}
            readOnly={isReadOnly}
            className="width400"
          />
        </Form.Item>
        <Form.Item label="可见范围设置" name={'groupId'}>
          <SetUserRightFormItem form={form} />
        </Form.Item>
        {/* </Form> */}
        <div className="sectionTitle" style={{ marginTop: '60px' }}>
          <span className="bold margin-right20">分享设置</span>
        </div>

        <Row>
          <Col span="12">
            <Form.Item
              label="分享封面图："
              name="shareCoverImgUrl"
              rules={[{ required: true, message: '请上传分享封面图' }]}
              extra="为确保最佳展示效果，请上传132*132像素高清图片，仅支持.jpg格式"
            >
              <NgUpload beforeUpload={beforeUpload} />
            </Form.Item>
            <Form.Item
              label="小标题："
              labelAlign="right"
              name="shareTitle"
              rules={[
                { required: true, message: '请输入小标题' },
                { max: 32, message: '最多32位字符' }
              ]}
            >
              <Input readOnly={isReadOnly} className="width320" placeholder="待添加" />
            </Form.Item>
          </Col>
          <Col span="12">
            <div className={style.sharePreviewWrap}>
              <h3 style={{ fontSize: '14px', fontWeight: 500 }} className="margin-bottom20">
                分享给客户样例展示
              </h3>
              <WechatShare
                avatar={userInfo.avatar}
                title={active.activityName}
                desc={active.shareTitle}
                shareCoverImgUrl={active.shareCoverImgUrl}
              />
            </div>
          </Col>
        </Row>

        {/* </Form> */}
        <div style={{ textAlign: 'center', width: 1000, marginTop: 32 }}>
          {!isReadOnly && (
            <Button
              type="primary"
              shape="round"
              htmlType="submit"
              size="large"
              style={{ width: 128 }}
              onClick={() => {
                console.log(form.getFieldsValue());
              }}
            >
              确定
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};
export default ActivityEdit;
