import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { peerNews, getTagsOrCategorys } from 'src/apis/marketing';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';
import NgUpload from '../../Components/Upload/Upload';

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
  const [isSubmitting, setSubmitting] = useState(false);
  const [formData, changeFormData] = useState<formDataProps>({
    newsUrl: '',
    defaultImg: '',
    originalCreator: '',
    summary: ''
  });
  const { currentCorpId, articleCategoryList, setArticleCategoryList, articleTagList, setArticleTagList } =
    useContext(Context);
  const [form] = Form.useForm();
  const RouterHistory = useHistory();
  const [categoryList] = useState<typeProps[]>([]);
  const [tagList] = useState<typeProps[]>([]);
  const changeSummary: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    changeFormData((formData) => ({ ...formData, summary: event.target.value }));
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

  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      const res = await peerNews({ ...values, corpId: currentCorpId });
      if (!res) {
        setSubmitting(false);
        return false;
      }
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
        RouterHistory.push('/marketingArticle');
      });
    } catch (e) {
      setSubmitting(false);
      console.log(e);
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
      <Form.Item
        name="originalCreator"
        label="原创信息"
        rules={[{ type: 'string' }, { message: '原创信息最多15个字符', max: 15 }]}
        extra="请输入原创作者名称，限15个字符以内，若不输入，则默认为文章来源的公众号名称。"
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        label="渠道来源"
        rules={[
          { type: 'string', required: true, message: '请输入渠道来源' },
          { message: '渠道来源最多12个字符', max: 12 }
        ]}
        name="originalCreator"
      >
        <Input maxLength={12} placeholder={'请输入渠道来源，限12个字符以内。'} />
      </Form.Item>
      <Form.Item
        name="defaultImg"
        label={'文章分享封面'}
        extra=" 为确保最佳展示效果，请上传154*154像素高清图片，支持.png及.jpg格式的图片。若不上传，则默认为链接对应文章的自带封面。"
      >
        <NgUpload beforeUpload={beforeUpload} />
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
      <Form.Item label="选择分类" name="categoryId" rules={[{ required: true, message: '请选择分类' }]}>
        <Select style={{ width: '100%' }} placeholder="请选择分类" optionFilterProp="children" showSearch>
          {articleCategoryList?.map((category: any) => (
            <Select.Option value={category.id} key={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="选择标签" name="tagIdList" rules={[{ required: true, message: '请选择标签' }]}>
        <Select
          style={{ width: '100%' }}
          placeholder="请选择标签"
          optionFilterProp="children"
          showSearch
          mode="multiple"
        >
          {articleTagList?.map((tag: any) => (
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
