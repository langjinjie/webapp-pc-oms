import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, Upload, Select, Button, message, Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { getNewsDetail, saveNews, uploadImage, getTagsOrCategorys } from 'src/apis/marketing';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';
import { NgEditor } from 'src/components';
interface TabView3Props {
  isEdit: boolean;
  newsId: string;
}
interface TypeProps {
  id: string;
  name: string;
  type: string;
}
const TabView3: React.FC<TabView3Props> = (props) => {
  const [loading, changeLoading] = useState(false);
  const [isGetDetailLoading, changeGetDetailLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [imageUrl, changeImgUrl] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    originalCreator: '',
    summary: '',
    defaultImg: '',
    crawl: 0,
    editorHtml: '',
    editorHtmlChanged: ''
  });
  const { currentCorpId, articleCategoryList, setArticleCategoryList, articleTagList, setArticleTagList } =
    useContext(Context);
  // const { data, dispatch } = useContext(GlobalContent);
  const [categoryList] = useState<TypeProps[]>([]);
  const [tagList] = useState<TypeProps[]>([]);

  const [form] = Form.useForm();
  const { isEdit, newsId } = props;
  const RouterHistory = useHistory();

  // editor 发生改变
  const changeEditorHtml = (editorHtml: string) => {
    setFormData((formData) => ({ ...formData, editorHtmlChanged: editorHtml }));
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

  const onChangeTitle: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData((formData) => ({ ...formData, title: event.target.value }));
  };
  const onChangeSummary: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData((formData) => ({ ...formData, summary: event.target.value }));
  };
  const asyncGetTagsOrCategory = async (type: 'category' | 'tag') => {
    try {
      const res = await getTagsOrCategorys({ type });
      if (res) {
        type === 'category' ? setArticleCategoryList(res) : setArticleTagList(res);
      }
    } catch (err) {
      // throw Error(err);
    }
  };

  const getDetail = async () => {
    changeGetDetailLoading(true);
    try {
      const res = await getNewsDetail({ newsId });
      const resdata: any = res;
      const content = resdata.crawl === 0 ? resdata.txt : resdata && resdata.content && resdata.content[0].content;
      setFormData((formData) => ({
        ...formData,
        ...resdata,
        editorHtml: content || ''
      }));
      changeImgUrl(resdata.defaultImg);
      form.setFields([
        { name: 'title', value: res.title },
        { name: 'originalCreator', value: res.originalCreator },
        { name: 'summary', value: res.summary },
        { name: 'categoryId', value: res.categoryId || '' },
        { name: 'tagIdList', value: res.tagIdList || [] },
        {
          name: 'corpId',
          value: res.corpId || undefined
        }
      ]);
      changeGetDetailLoading(false);
    } catch (e) {
      changeGetDetailLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    try {
      const submitHTML = formData.editorHtmlChanged || formData.editorHtml;
      if (!submitHTML || submitHTML.length <= 7) {
        return message.error('请输入文章内容');
      }
      setSubmitting(true);
      await saveNews({
        ...values,
        newsId: newsId,
        defaultImg: formData.defaultImg,
        content: submitHTML,
        corpId: currentCorpId
      });
      message.success('添加成功！').then(() => {
        setSubmitting(false);
        form.resetFields();
        RouterHistory.push('/marketingArticle');
      });
    } catch (e) {
      setSubmitting(false);
      console.log(e);
    }
  };

  useEffect(() => {
    if (categoryList.length === 0) {
      asyncGetTagsOrCategory('category');
    }
    if (tagList.length === 0) {
      asyncGetTagsOrCategory('tag');
    }
    if (isEdit) {
      getDetail();
    }
    return () => {
      console.log('unmounted');
    };
  }, []);

  const getBase64 = (img: any, callback: (imageUrl: any) => void) => {
    const reader: FileReader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  // 长期修改
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

  // 自定义上传
  const uploadToServer = async (options: any) => {
    const fileData = new FormData();
    fileData.append('file', options.file);
    fileData.append('bizKey', 'news');
    try {
      const res = await uploadImage(fileData);
      options.onSuccess(options);
      setFormData((formData) => ({ ...formData, defaultImg: res.filePath }));
    } catch (e) {
      message.error('图片上传失败，请重试' + e);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <Spin spinning={isGetDetailLoading} tip="加载中...">
      <Form
        form={form}
        initialValues={formData}
        onFinish={onFinish}
        scrollToFirstError={true}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
      >
        <Form.Item
          label="文章标题"
          name="title"
          rules={[
            { type: 'string', required: true, message: '请输入文章标题' },
            { message: '文章标题最多100个字符', max: 100 }
          ]}
        >
          <Input placeholder="请输入文章标题，限100个字符以内。" maxLength={100} onChange={onChangeTitle} />
        </Form.Item>

        <Form.Item
          label="原创信息"
          rules={[
            { type: 'string', required: true, message: '请输入原创信息' },
            { message: '原创信息最多15个字符', max: 15 }
          ]}
          name="originalCreator"
        >
          <Input maxLength={15} placeholder={'请输入原创作者名称，限15个字符以内。'} />
        </Form.Item>
        <Form.Item label="文章封面" labelCol={{ span: 3 }} wrapperCol={{ span: 12 }}>
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
          <p className="color-info">
            为确保最佳展示效果，请上传154*154像素高清图片，支持.png及.jpg格式的图片。若不上传，则默认为链接对应文章的自带封面。
          </p>
        </Form.Item>
        <Form.Item
          label={<span>文章分享摘要</span>}
          name="summary"
          rules={[{ type: 'string' }, { message: '分享摘要最多100个字符', max: 100 }]}
          extra="请输入分享摘要，限100个字符以内，若不输入，则默认为链接对应文章的自带摘要。"
        >
          <Input placeholder={'请输入分享摘要，限100个字符以内。'} onChange={onChangeSummary} />
        </Form.Item>
        <Form.Item label={<span>文章分享预览</span>} labelCol={{ span: 3 }} wrapperCol={{ span: 12 }}>
          <div className={'shareCardView'}>
            <img className={'shareImg'} src={formData.defaultImg} />
            <div className={'shareContent'}>
              <div className={'text-ellipsis shareTitle'}>{formData.title || '文章标题'}</div>
              <div className={'text-ellipsis shareSubTitle'}>{formData.summary}</div>
            </div>
          </div>
        </Form.Item>
        <Form.Item
          label={<span className="is_required">输入内容</span>}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 16 }}
          validateStatus="error"
          help={!formData.editorHtmlChanged && !formData.editorHtml ? '请输入文章内容' : ''}
        >
          <NgEditor initialValue={formData.editorHtml} handleEditorChange={changeEditorHtml} />
        </Form.Item>
        <Form.Item label="选择分类" labelCol={{ span: 3 }} wrapperCol={{ span: 12 }} name="categoryId">
          <Select style={{ width: '100%' }} placeholder="请选择分类" showSearch optionFilterProp="children">
            {articleCategoryList?.map((category) => (
              <Select.Option value={category.id + ''} key={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="选择标签" labelCol={{ span: 3 }} wrapperCol={{ span: 12 }} name="tagIdList">
          <Select
            style={{ width: '100%' }}
            placeholder="请选择标签"
            optionFilterProp="children"
            showSearch
            mode="multiple"
          >
            {articleTagList?.map((tag) => (
              <Select.Option value={tag.id + ''} key={tag.id}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button type="primary" shape="round" htmlType="submit" loading={isSubmitting}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default TabView3;
