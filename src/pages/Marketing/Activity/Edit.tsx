import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Form, Input, message, Button, Select, Radio } from 'antd';
import { getQueryParam } from 'lester-tools';
import { Context } from 'src/store';
import { activityDetail, activityEdit, productConfig } from 'src/apis/marketing';
import style from './style.module.less';
import classNames from 'classnames';
import NgUpload from '../Components/Upload/Upload';
import { WechatShare } from '../Components/WechatShare/WechatShare';

interface ActivityPageProps {
  id: number;
  type: number;
  history: any;
}

interface ActivityProps {
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
  const [form] = Form.useForm();

  const getDetail = async (activityId: string) => {
    const res = await activityDetail({ activityId });
    if (res) {
      setActive(res);
      const {
        activityName,
        corpActivityId,
        corpActivityLink,
        speechcraft,
        shareCoverImgUrl,
        shareTitle,
        tags = ''
      } = res;
      form.setFieldsValue({
        activityName,
        corpActivityId,
        corpActivityLink,
        speechcraft,
        tags: tags?.split(','),
        shareCoverImgUrl,
        shareTitle
      });
    }
  };
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
      setIsReadOnly(isView);
    }
    getSystemAcTagConfig();
  }, []);

  const onFinish = async (values: any) => {
    const { activityName, corpActivityId, corpActivityLink, speechcraft, shareTitle, tags } = values;
    const editParams = {
      activityName,
      corpActivityId,
      corpActivityLink,
      speechcraft,
      tags: tags.join(','),
      shareCoverImgUrl: active.shareCoverImgUrl,
      shareTitle,
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

  const onFormValuesChange = (values: ActivityProps) => {
    const { shareTitle, activityName, shareCoverImgUrl } = values;
    setActive((active) => ({ ...active, shareTitle, activityName, shareCoverImgUrl }));
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
        <Form.Item label="活动ID：" name="corpActivityId">
          <Input
            placeholder="活动ID非必填字段，如无填写可用系统随机生成的活动ID"
            readOnly={isReadOnly}
            className="width320"
            maxLength={40}
          />
        </Form.Item>
        <Form.Item label="展示类型" name="displayType" required initialValue={1}>
          <Group onChange={(e) => setDisplayType(e.target.value)}>
            <Radio value={1}>链接</Radio>
            <Radio value={2}>小程序</Radio>
          </Group>
        </Form.Item>
        {displayType === 1 && (
          <Form.Item
            label="产品链接"
            name="corpProductLink"
            rules={[
              { required: true, message: '请输入产品链接' },
              { type: 'url', message: '请输入正确的链接' }
            ]}
          >
            <Input className="width320" placeholder="待添加" />
          </Form.Item>
        )}
        {displayType === 2 && (
          <>
            <Form.Item label="小程序ID" name="userName" rules={[{ required: true, message: '请输入小程序ID' }]}>
              <Input className="width320" placeholder="待添加" />
            </Form.Item>
            <Form.Item label="页面路径" name="path">
              <Input className="width320" placeholder="待输入，不填默认跳转小程序首页" />
            </Form.Item>
          </>
        )}
        <Form.Item
          className={style.selectTagWrap}
          name="tags"
          label="活动标签："
          rules={[{ type: 'array', required: true, message: '请选择活动标签' }]}
        >
          <Select placeholder="请选择" allowClear className={classNames('width320')} mode="tags">
            {tags?.map((tag, index) => {
              return (
                <Select.Option key={index} value={tag.name}>
                  {tag.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item label="活动链接：" name="corpActivityLink" rules={[{ required: true, message: '请输入活动链接' }]}>
          <Input placeholder="请输入" readOnly={isReadOnly} className="width320" />
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
            <Button type="primary" shape="round" htmlType="submit" size="large" style={{ width: 128 }}>
              确定
            </Button>
          )}
        </div>
      </Form>
    </Card>
  );
};
export default ActivityEdit;
