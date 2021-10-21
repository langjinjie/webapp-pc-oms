import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Select, Button, message } from 'antd';
import { peerNews, uploadImage, getTagsOrCategorys } from 'src/apis/marketing';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
// import { GlobalContent, UPDATE_CATEGORY, UPDATE_TAGS } from 'src/store';
import { useGetCorps } from 'src/utils/corp';

interface formDataProps {
  newsUrl: string;
  defaultImg: string;
  originalCreator: string;
  summary: string;
}
interface typeProps {
  id: string;
  name: string;
  type: string;
}
const TabView2: React.FC = () => {
  const [loading, changeLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [imageUrl, changeImgUrl] = useState('');
  const [formData, changeFormData] = useState<formDataProps>({
    newsUrl: '',
    defaultImg: '',
    originalCreator: '',
    summary: ''
  });
  const { data: corpList } = useGetCorps();
  const [form] = Form.useForm();
  const RouterHistory = useHistory();
  // const { data, dispatch } = useContext(GlobalContent);
  const [categoryList] = useState<typeProps[]>([]);
  const [tagList] = useState<typeProps[]>([]);
  const changeSummary: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    changeFormData((formData) => ({ ...formData, summary: event.target.value }));
  };

  const asyncGetTagsOrCategory = async (type: 'category' | 'tag') => {
    try {
      const res = await getTagsOrCategorys({ type });
      console.log(res);
    } catch (err) {
      // throw Error(err);
    }
  };

  // 上传之前
  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('你只能上传 JPG/PNG 图片文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不可以超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const getBase64 = (img: any, callback: (imageUrl: any) => void) => {
    const reader: FileReader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  useEffect(() => {
    if (categoryList.length === 0) {
      asyncGetTagsOrCategory('category');
    }
    if (tagList.length === 0) {
      asyncGetTagsOrCategory('tag');
    }
    return () => {
      console.log('unmounted');
    };
  }, []);

  // 上传修改
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      changeLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        changeLoading(false);
        changeImgUrl(imageUrl);
      });
    }
  };

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      const { corpId = '' } = values;
      await peerNews({ ...values, defaultImg: formData.defaultImg, corpId });

      message.success('添加成功！').then(() => {
        form.resetFields();
        setSubmitting(false);
        changeFormData(() => ({
          newsUrl: '',
          defaultImg: '',
          originalCreator: '',
          summary: ''
        }));
        form.resetFields();
        RouterHistory.push('/index');
      });
    } catch (e) {
      setSubmitting(false);
      console.log(e);
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );
  // 自定义上传
  const uploadToServer = async (options: any) => {
    const fileData = new FormData();
    fileData.append('file', options.file);
    fileData.append('bizKey', 'news');
    try {
      const res = await uploadImage(fileData);
      options.onSuccess(options);
      changeFormData((formData) => ({ ...formData, defaultImg: res.filePath }));
    } catch (e) {
      message.error('图片上传失败，请重试' + e);
    }
  };
  return (
    <Form
      form={form}
      labelCol={{ span: 3 }}
      wrapperCol={{ span: 12 }}
      onFinish={onFinish}
      name="control-hooks"
      initialValues={formData}
      scrollToFirstError={true}
    >
      <Form.Item
        name="newsUrl"
        rules={[
          { required: true, message: '文章链接不能为空!' },
          { type: 'url', message: '请输入正确的链接' }
        ]}
        label="文章链接"
      >
        <Input.TextArea rows={2} placeholder="复制文章链接粘贴到此处"></Input.TextArea>
      </Form.Item>
      <Form.Item label="可见机构" labelCol={{ span: 3 }} name={'corpId'}>
        <Select allowClear placeholder={'请选择可见机构'}>
          <Select.Option value={''}>全部机构</Select.Option>
          {corpList.map((corp) => (
            <Select.Option value={corp.id} key={corp.id}>
              {corp.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="originalCreator"
        label="原创信息"
        rules={[{ type: 'string' }, { message: '原创信息最多15个字符', max: 15 }]}
        extra="请输入原创作者名称，限15个字符以内，若不输入，则默认为文章来源的公众号名称。"
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        label={<span>文章分享封面</span>}
        extra=" 为确保最佳展示效果，请上传154*154像素高清图片，支持.png及.jpg格式的图片。若不上传，则默认为链接对应文章的自带封面。"
      >
        <Upload
          name="avatar"
          maxCount={1}
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          customRequest={uploadToServer}
          onChange={handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </Form.Item>
      <Form.Item
        name="summary"
        label={<span>分享摘要</span>}
        rules={[{ type: 'string' }, { message: '分享摘要最多100个字符', max: 100 }]}
        extra="请输入分享摘要，限100个字符以内，若不输入，则默认为链接对应文章的自带摘要。"
      >
        <Input maxLength={100} placeholder="请输入" onChange={changeSummary} />
      </Form.Item>
      <Form.Item label={<span>分享链接预览</span>} labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
        <div className={'shareCardView'}>
          <img className={'shareImg'} src={formData.defaultImg} />
          <div className={'shareContent'}>
            <div className={'text-ellipsis shareTitle'}>文章标题</div>
            <div className={'text-ellipsis shareSubTitle'}>{formData.summary}</div>
          </div>
        </div>
      </Form.Item>
      <Form.Item label="选择分类" name="categoryId">
        <Select style={{ width: '100%' }} placeholder="请选择分类" optionFilterProp="children" showSearch>
          {categoryList.map((category) => (
            <Select.Option value={category.id} key={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="选择标签" name="tagIdList">
        <Select
          style={{ width: '100%' }}
          placeholder="请选择标签"
          optionFilterProp="children"
          showSearch
          mode="multiple"
        >
          {tagList?.map((tag) => (
            <Select.Option value={tag.id} key={tag.id}>
              {tag.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 3 }}>
        <Button type="primary" shape="round" htmlType="submit" loading={isSubmitting}>
          添加
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TabView2;
