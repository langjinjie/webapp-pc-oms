import { Button, Form, Input, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { getVideoDetail, getVideoTypeList } from 'src/apis/marketing';
import { BreadCrumbs, UploadFile } from 'src/components';
import { URLSearchParams } from 'src/utils/base';
import { SetUserRightFormItem } from '../../Components/SetUserRight/SetUserRight';
import NgUpload from '../../Components/Upload/Upload';
import { VideoColumn } from '../VideoList/Config';

const AddVideo: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [addForm] = Form.useForm();
  const [typeList, setTypeList] = useState<any[]>([]);
  const [video, setVideo] = useState<VideoColumn>();
  const getDetail = async () => {
    const { videoId } = URLSearchParams(location.search);
    if (videoId) {
      const res = await getVideoDetail({ videoId });
      console.log(res, video);
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
  return (
    <div className="container">
      <BreadCrumbs navList={[{ name: '视频库', path: '/marketingVideo' }, { name: '新增视频' }]} />

      <Form form={addForm} className="mt20 edit">
        <div className="sectionTitle">基本信息</div>
        <Form.Item label="视频标题" rules={[{ required: true }]}>
          <Input className="width240" placeholder="请输入"></Input>
        </Form.Item>
        <Form.Item label="视频摘要">
          <Input className="width240" placeholder="请输入"></Input>
        </Form.Item>
        <Form.Item label="原创信息">
          <Input className="width240" placeholder="请输入"></Input>
        </Form.Item>

        <div className="sectionTitle">视频配置</div>

        <Form.Item label="视频文件" extra="仅支持MP4格式，最大100M">
          <UploadFile />
        </Form.Item>
        <Form.Item label="视频封面" extra="建议尺寸：400px*400px,图片比例1:1，大小不超过2MB">
          <NgUpload />
        </Form.Item>
        <Form.Item label="视频时长">
          <Input className="width240" placeholder="请输入时长，格式如08:58"></Input>
        </Form.Item>
        <Form.Item label="分享预览">
          <Input className="width280" placeholder="请输入"></Input>
        </Form.Item>
        <Form.Item label="营销话术">
          <Input.TextArea className="width280" placeholder="请输入"></Input.TextArea>
        </Form.Item>

        <Form.Item label="选择分类">
          <Select>
            {typeList.map((item: any) => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="选择标签">
          <Select></Select>
        </Form.Item>
        <Form.Item label="可见范围设置" name={'groupId'}>
          <SetUserRightFormItem form={addForm} />
        </Form.Item>

        <Form.Item className="formFooter mt40">
          <Space size={36} style={{ marginLeft: '140px' }}>
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
            <Button shape="round" type="primary">
              确定
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddVideo;
