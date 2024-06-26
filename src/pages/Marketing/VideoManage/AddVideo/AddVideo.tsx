import { Button, Form, Input, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { editVideo, getVideoDetail, getVideoTypeList } from 'src/apis/marketing';
import { BreadCrumbs, UploadVideo } from 'src/components';
import { urlSearchParams } from 'src/utils/base';
import { SetUserRightFormItem } from '../../Components/SetUserRight/SetUserRight';
import NgUpload from '../../Components/Upload/Upload';
import { WechatShare } from '../../Components/WechatShare/WechatShare';
import { VideoColumn } from '../VideoList/Config';

const AddVideo: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addForm] = Form.useForm();
  const [typeList, setTypeList] = useState<any[]>([]);
  const [video, setVideo] = useState<VideoColumn>();
  const getDetail = async () => {
    const { videoId } = urlSearchParams(location.search);
    if (videoId) {
      const res = await getVideoDetail({ videoId });
      if (res) {
        setVideo(res);
        addForm.setFieldsValue(res);
      }
    }
  };

  const getCategoryList = async () => {
    const res = await getVideoTypeList({});
    if (res) {
      const { typeList } = res;
      setTypeList(typeList.map((item: any) => ({ id: item.typeId, name: item.typeName })));
    }
  };
  useEffect(() => {
    getDetail();
    getCategoryList();
  }, []);

  // 提交表单数据
  const onFinish = async (values: any) => {
    setIsSubmitting(true);
    const { isSet, group1, ...otherVal } = values;
    const res = await editVideo({
      ...otherVal,
      groupId: values.groupId || '',
      videoId: video?.videoId || null,
      typeName: typeList.filter((item) => item.id === values.typeId)[0].name
    });
    setIsSubmitting(false);
    if (res) {
      message.success('保存成功');
      history.goBack();
    }
    console.log(res, isSet, group1);
  };

  const beforeUpload = (file: any) => {
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

  const beforeUploadImg = (file: any) => {
    const isJpgPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgPng) {
      message.error('只能上传 JPG和PNG  格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) message.error('图片大小不能超过2MB!');
    return isJpgPng && isLt2M;
  };
  return (
    <div className="container">
      <BreadCrumbs navList={[{ name: '视频库', path: '/marketingVideo' }, { name: '新增视频' }]} />

      <Form
        form={addForm}
        className="mt20 edit"
        onFinish={onFinish}
        onValuesChange={(changeValues, values) => setVideo((video) => ({ ...video, ...values }))}
      >
        <div className="sectionTitle">基本信息</div>
        <Form.Item
          label="视频标题"
          name={'videoName'}
          rules={[{ required: true }, { max: 40, message: '限制40个字符以内' }]}
        >
          <Input className="width480" placeholder="请输入,限制40个字符以内"></Input>
        </Form.Item>
        <Form.Item
          label="视频摘要"
          name="summary"
          rules={[{ required: true }, { max: 40, message: '限制40个字符以内' }]}
        >
          <Input className="width480" placeholder="请输入,限制40个字符以内"></Input>
        </Form.Item>
        <Form.Item label="原创信息" name="original" rules={[{ max: 20, message: '限制20个字符以内', required: true }]}>
          <Input className="width480" placeholder="请输入,限制20个字符以内"></Input>
        </Form.Item>

        <div className="sectionTitle">视频配置</div>

        <Form.Item
          name={'videoLink'}
          rules={[{ required: true, message: '请上传视频' }]}
          label="视频文件"
          extra="仅支持MP4格式，最大100M"
        >
          <UploadVideo beforeUpload={beforeUpload} />
        </Form.Item>
        <Form.Item
          name="videoCoverUrl"
          rules={[{ required: true }]}
          label="视频封面"
          extra="建议尺寸：400px*400px,图片比例1:1，大小不超过2MB"
        >
          <NgUpload beforeUpload={beforeUploadImg} />
        </Form.Item>
        <Form.Item label="视频时长" name="videoTime" rules={[{ required: true }]}>
          <Input className="width240" placeholder="请输入时长，格式如08:58"></Input>
        </Form.Item>
        <Form.Item label="分享预览">
          <WechatShare
            avatar={''}
            title={video?.videoName}
            desc={video?.summary}
            shareCoverImgUrl={video?.videoCoverUrl}
          />
        </Form.Item>
        <Form.Item
          label="营销话术"
          name={'speechcraft'}
          rules={[{ required: true }, { max: 100, message: '限100个字符以内' }]}
        >
          <Input.TextArea className="width480" placeholder="请输入"></Input.TextArea>
        </Form.Item>

        <Form.Item label="选择分类" name="typeId" rules={[{ required: true }]}>
          <Select className="width240" placeholder="请选择">
            {typeList.map((item: any) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/* <Form.Item label="选择标签">
          <Select></Select>
        </Form.Item> */}
        <Form.Item label="可见范围设置" name={'groupId'}>
          <SetUserRightFormItem form={addForm} />
        </Form.Item>

        <Form.Item className="formFooter mt40">
          <Button
            shape="round"
            type="primary"
            ghost
            onClick={() => {
              history.goBack();
            }}
          >
            取消
          </Button>
          <Button shape="round" type="primary" htmlType="submit" loading={isSubmitting}>
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddVideo;
