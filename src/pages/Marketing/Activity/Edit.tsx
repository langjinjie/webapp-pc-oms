import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Form, Input, Upload, message, Button, Select } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { getQueryParam } from 'lester-tools';
import { Context } from 'src/store';
import { activityDetail, uploadImg, activityEdit, productConfig } from 'src/apis/marketing';
import style from './style.module.less';
import { Icon } from 'src/components';
import classNames from 'classnames';

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
        shareCoverImgUrl: [{ src: shareCoverImgUrl }],
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
      history.replace('/activityLibrary?pageNum=1');
    }
  };
  const [loading, setLoading] = useState<boolean>(false);

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <Icon name="upload" className="font36" />}
      <div style={{ marginTop: 8 }} className="color-text-regular">
        上传图片
      </div>
    </div>
  );
  const getBase64 = (img: any, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
  const uploadFile = async (option: any) => {
    // 创建一个空对象实例
    const uploadData = new FormData();
    // 调用append()方法来添加数据
    uploadData.append('file', option.file);
    const res = await uploadImg(uploadData);
    setLoading(false);
    if (res) {
      setActive((active) => ({ ...active, shareCoverImgUrl: res }));
    }
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, () => {
        setLoading(false);
      });
    }
  };

  const onFormValuesChange = (values: ActivityProps) => {
    const { shareTitle, activityName } = values;
    setActive((active) => ({ ...active, shareTitle, activityName }));
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
              getValueFromEvent={normFile}
              valuePropName="fileList"
              rules={[{ required: true, message: '请上传分享封面图' }]}
              extra="为确保最佳展示效果，请上传132*132像素高清图片，仅支持.jpg格式"
            >
              <Upload
                multiple={false}
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={uploadFile}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                disabled={isReadOnly}
              >
                {active.shareCoverImgUrl
                  ? (
                  <img src={active.shareCoverImgUrl} alt="avatar" style={{ width: '100%' }} />
                    )
                  : (
                      uploadButton
                    )}
              </Upload>
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
              <div className={style.userImg}>
                <img src={userInfo.avatar} alt="" />
              </div>
              <div className={style.shareWrap}>
                <div style={{ overflow: 'hidden' }}>
                  <div className={style.shareInfo}>
                    <h3 style={{ fontSize: '14px', fontWeight: 500 }} className="ellipsis">
                      {active.activityName}
                    </h3>
                    <p style={{ fontSize: '12px' }} className="ellipsis">
                      {active.shareTitle}
                    </p>
                  </div>
                  <div className={style.shareImg}>
                    <img src={active.shareCoverImgUrl} alt="" />
                  </div>
                </div>
                <p className={style.shareTag}>企业微信</p>
              </div>
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
