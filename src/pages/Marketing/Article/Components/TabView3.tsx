import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, Select, Button, message, Spin, Radio, RadioChangeEvent } from 'antd';
import { getNewsDetail, saveNews, getTagsOrCategorys, searchRecommendGoodsList } from 'src/apis/marketing';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';
import { NgEditor } from 'src/components';
import NgUpload from '../../Components/Upload/Upload';
import { WechatShare } from '../../Components/WechatShare/WechatShare';
import { Icon } from 'lester-ui';

import style from './style.module.less';
import { recommendTypeList } from '../Config';
import { debounce } from 'src/utils/base';
interface TabView3Props {
  isEdit: boolean;
  newsId: string;
}

interface TypeProps {
  id: string;
  name: string;
  type: string;
}

interface RecommendMarketProps {
  marketId: string;
  title: string;
  recommendImgUrl?: string;
  whetherDelete?: number;
}

const TabView3: React.FC<TabView3Props> = (props) => {
  const [isGetDetailLoading, changeGetDetailLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<{ recommendList: RecommendMarketProps[]; [prop: string]: any }>({
    title: '',
    originalCreator: '',
    summary: '',
    defaultImg: '',
    crawl: 0,
    editorHtml: '',
    editorHtmlChanged: '',
    recommendType: 3,
    recommendList: []
  });
  const [recommendList, setRecommendList] = useState<RecommendMarketProps[]>([]);
  const [recommendType, setRecommendType] = useState(0);
  const [newUploadProductIdList, setNewUploadProductIdList] = useState<string[]>([]);
  const { currentCorpId, articleCategoryList, setArticleCategoryList, articleTagList, setArticleTagList, userInfo } =
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
      const {
        title,
        originalCreator,
        fromSource,
        summary,
        categoryId,
        tagIdList,
        defaultImg,
        corpId,
        recommendType,
        recommendList
      } = res;
      // recommendList.map((item: RecommendMarketProps) => {
      //   if (item.whetherDelete) {
      //     console.log(item);
      //     return item;
      //   }
      // });
      form.setFieldsValue({
        title,
        originalCreator,
        fromSource,
        summary,
        categoryId,
        tagIdList,
        defaultImg,
        corpId,
        recommendType: recommendType,
        recommendList
      });
      setRecommendType(recommendType);
      setRecommendList(recommendList || []);
      changeGetDetailLoading(false);
      form.validateFields();
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
      setSubmitting(false);
      const res = await saveNews({
        ...values,
        newsId: newsId,
        content: submitHTML,
        corpId: currentCorpId
      });
      setSubmitting(false);
      if (res) {
        message.success('添加成功！').then(() => {
          setSubmitting(false);
          form.resetFields();
          RouterHistory.push('/marketingArticle');
        });
      }
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
  const onFormValuesChange = (changeValues: any, values: any) => {
    const { defaultImg, summary, recommendType } = values;
    setFormData((formData) => ({ ...formData, defaultImg, summary, recommendType }));
  };

  // 推荐类型发生变化时
  const onRecommendTypeChange = async (e: RadioChangeEvent) => {
    setRecommendType(+e.target.value);
    const type = +e.target.value;
    if (type !== 3) {
      const res = await searchRecommendGoodsList({
        title: '',
        recommendType: +e.target.value
      });
      setRecommendList(res || []);
    }
    form.setFieldsValue({
      recommendList: []
    });
    setFormData((formData) => ({ ...formData, recommendList: [] }));
  };

  const onRecommendSearch = async (value: string) => {
    const res: RecommendMarketProps[] = await searchRecommendGoodsList({
      title: value,
      recommendType: formData.recommendType
    });
    const resList = [...formData.recommendList.filter((item) => item !== undefined), ...res];
    const obj: any = {};
    const arr = resList.reduce((newArr: RecommendMarketProps[], next) => {
      if (obj[next.marketId]) {
        console.log(obj);
      } else {
        obj[next.marketId] = true && newArr.push(next);
      }
      return newArr;
    }, []);
    setRecommendList(arr);
  };

  // 防抖处理
  const debounceFetcher = debounce(async (value: string) => {
    await onRecommendSearch(value);
  }, 800);

  // 当选中select素材时处理的东西
  const onRecommendSelected = (value: string, index: number) => {
    const selectedItem = recommendList.filter((item) => item.marketId === value)[0];
    const oldSelectedList = [...formData.recommendList];
    oldSelectedList.splice(index, 1, selectedItem);
    form.setFieldsValue({
      recommendList: oldSelectedList
    });
    setFormData((formData) => ({ ...formData, recommendList: oldSelectedList }));
  };

  const recommendPicBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg';
    if (!isJpgOrPng) {
      message.error('只可以上传 JPG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不可以超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const isUploadDisabled = (index: number): boolean => {
    const currentItem: RecommendMarketProps = form.getFieldValue('recommendList')[index];
    if (!currentItem) {
      return false;
    }
    return !!currentItem?.recommendImgUrl && !newUploadProductIdList.includes(currentItem.marketId);
  };

  const customerUploadChange = (url: string, index: number) => {
    const currentItem: RecommendMarketProps = form.getFieldValue('recommendList')[index];
    const list = [...newUploadProductIdList];
    if (!list.includes(currentItem.marketId)) {
      list.push(currentItem.marketId);
      setNewUploadProductIdList(list);
    }
    console.log(currentItem);
    console.log(url);
  };

  return (
    <Spin spinning={isGetDetailLoading} tip="加载中...">
      <Form
        form={form}
        initialValues={formData}
        onFinish={onFinish}
        onValuesChange={onFormValuesChange}
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
        <Form.Item
          label="渠道来源"
          rules={[
            { type: 'string', required: true, message: '请输入渠道来源' },
            { message: '渠道来源最多12个字符', max: 12 }
          ]}
          name="fromSource"
        >
          <Input maxLength={12} placeholder={'请输入渠道来源，限12个字符以内。'} />
        </Form.Item>
        <Form.Item
          label="文章封面"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 12 }}
          rules={[{ required: true, message: '请上传文章封面' }]}
          name="defaultImg"
          extra=" 为确保最佳展示效果，请上传154*154像素高清图片，支持.png及.jpg格式的图片。若不上传，则默认为链接对应文章的自带封面"
        >
          <NgUpload beforeUpload={beforeUpload} />
        </Form.Item>
        <Form.Item
          label={'文章分享摘要'}
          name="summary"
          rules={[
            { type: 'string', required: true },
            { message: '分享摘要最多100个字符', max: 100 }
          ]}
          extra="请输入分享摘要，限100个字符以内，若不输入，则默认为链接对应文章的自带摘要。"
        >
          <Input placeholder={'请输入分享摘要，限100个字符以内。'} />
        </Form.Item>
        <Form.Item label={<span>文章分享预览</span>} labelCol={{ span: 3 }} wrapperCol={{ span: 12 }}>
          <WechatShare
            avatar={userInfo.avatar}
            title={formData.title}
            desc={formData.summary}
            shareCoverImgUrl={formData.defaultImg}
          />
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
        <Form.Item
          label="选择分类"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 12 }}
          name="categoryId"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select style={{ width: '100%' }} placeholder="请选择分类" showSearch optionFilterProp="children">
            {articleCategoryList?.map((category: any) => (
              <Select.Option value={category.id + ''} key={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="选择标签"
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 12 }}
          name="tagIdList"
          rules={[{ required: true, message: '请选择标签' }]}
        >
          <Select
            style={{ width: '100%' }}
            placeholder="请选择标签"
            optionFilterProp="children"
            showSearch
            mode="multiple"
          >
            {articleTagList?.map((tag: any) => (
              <Select.Option value={tag.id + ''} key={tag.id}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name={'recommendType'} label="推荐类型">
          <Radio.Group onChange={onRecommendTypeChange}>
            {recommendTypeList.map((item) => (
              <Radio key={item.id} value={+item.id}>
                {item.name}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="推荐内容"
          name={'recommendList'}
          rules={[{ required: recommendType !== 3, message: '请选择推荐内容，或者将推荐类型设置为无' }]}
        >
          <Form.List name="recommendList">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restFiled }, index) => {
                  return (
                    <Form.Item key={key} required className={style.formListWrap} label={'素材' + (index + 1)}>
                      {/* 缓存是否上下上下架数据 */}
                      <Form.Item hidden name={[name, 'whetherDelete']}>
                        <Input type="text" />
                      </Form.Item>
                      <Form.Item
                        {...restFiled}
                        name={[name, 'marketId']}
                        rules={[
                          { required: true, message: '请重新选择' },
                          ({ getFieldValue }) => ({
                            validator (_, value) {
                              const itemValue = getFieldValue('recommendList')[index];
                              if (!value || itemValue.whetherDelete !== 1) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('当前素材已经下线，请选择其他素材!'));
                            }
                          })
                        ]}
                      >
                        <Select
                          placeholder="搜索对应素材标题在下拉框进行选择"
                          allowClear
                          showSearch={true}
                          defaultActiveFirstOption={false}
                          showArrow={false}
                          filterOption={false}
                          notFoundContent={false}
                          onChange={(value) => onRecommendSelected(value, index)}
                          onSearch={debounceFetcher}
                        >
                          {recommendList.map((option) => (
                            <Select.Option
                              key={option.marketId}
                              value={option.marketId}
                              disabled={
                                formData?.recommendList.filter((item: any) => item?.marketId === option.marketId)
                                  .length > 0
                              }
                            >
                              {option.title}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      {/* 当是商品时展示图片模块 */}
                      {recommendType === 2 && (
                        <Form.Item
                          {...restFiled}
                          rules={[{ required: true, message: '请上传推荐图片' }]}
                          extra="为确保最佳展示效果，请上传 690*200像素高清图片，仅支持.jpg格式"
                          name={[name, 'recommendImgUrl']}
                        >
                          <NgUpload
                            disabled={isUploadDisabled(index)}
                            onChange={(url) => customerUploadChange(url, index)}
                            beforeUpload={recommendPicBeforeUpload}
                          />
                        </Form.Item>
                      )}
                      <Icon className={style.removeBtn} name="cangpeitubiao_shanchu" onClick={() => remove(name)} />
                    </Form.Item>
                  );
                })}
                {fields.length < 5 && (
                  <Form.Item>
                    <Button className={style.addBtn} onClick={() => add()}>
                      <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" /> 添加
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button type="primary" shape="round" className={style.submitBtn} htmlType="submit" loading={isSubmitting}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default TabView3;
