import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, Select, Button, message, Spin, Radio, RadioChangeEvent, Image as AntImage } from 'antd';
import {
  getNewsDetail,
  saveNews,
  getTagsOrCategorys,
  searchRecommendGoodsList,
  queryMarketArea
} from 'src/apis/marketing';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';
import { NgEditor } from 'src/components';
import NgUpload from '../../Components/Upload/Upload';
import { WechatShare } from '../../Components/WechatShare/WechatShare';
import { Icon } from 'tenacity-ui';

import style from './style.module.less';
import { recommendTypeList } from '../Config';
import { debounce } from 'src/utils/base';
import { SetUserRightFormItem } from '../../Components/SetUserRight/SetUserRight';
import { AreaTips } from './AreaTips';
interface TabView3Props {
  isEdit: boolean;
  newsId: string;
}

interface TypeProps {
  id: string;
  name: string;
  type: string;
}

export interface RecommendMarketProps {
  marketId: string;
  title: string;
  recommendImgUrl?: string;
  whetherDelete?: number;
  otherData?: any;
}

const TabView3: React.FC<TabView3Props> = (props) => {
  const [isGetDetailLoading, changeGetDetailLoading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [visibleImage, setVisibleImage] = useState(false);
  const [formData, setFormData] = useState<{ recommendList: RecommendMarketProps[]; [prop: string]: any }>({
    title: '',
    originalCreator: '',
    summary: '',
    defaultImg: '',
    crawl: 0,
    editorHtml: '',
    editorHtmlChanged: '',
    recommendType: 0,
    recommendList: [],
    isSet: 0,
    syncFromMain: 0
  });
  const [recommendList, setRecommendList] = useState<RecommendMarketProps[]>([]);
  const [fetching, setFetching] = useState(false);
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
      let {
        title,
        originalCreator,
        fromSource,
        summary,
        categoryId,
        tagIdList,
        defaultImg,
        corpId,
        recommendType,
        recommendList,
        groupId
      } = res;

      if (recommendList && recommendList.length > 0) {
        recommendList = await Promise.all(
          recommendList.map(async (recommend: any) => {
            const res = await queryMarketArea({
              itemId: recommend.marketId,
              type: recommendTypeList.filter((item) => item.id === recommendType)[0]?.queryAuthId
            });
            recommend.otherData = res;
            return recommend;
          })
        );
      }
      form.setFieldsValue({
        title,
        groupId,
        originalCreator,
        fromSource,
        summary,
        categoryId,
        tagIdList,
        defaultImg,
        corpId,
        recommendType: recommendType || 0,
        recommendList
      });
      setRecommendType(recommendType);
      setRecommendList(recommendList || []);
      changeGetDetailLoading(false);
      form.validateFields();
    } catch (e) {
      console.error(e);
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
      delete values.group1;
      delete values.group2;
      delete values.groupType;
      delete values.isSet;
      const res = await saveNews({
        ...values,
        groupId: values.groupId || '',
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
      setFetching(true);
      const res = await searchRecommendGoodsList({
        title: '',
        specType: 0,
        recommendType: +e.target.value,
        type: +e.target.value && undefined
      });

      setRecommendList(res || []);
      setFetching(false);
    }
    form.setFieldsValue({
      recommendList: []
    });
    setFormData((formData) => ({ ...formData, recommendList: [] }));
  };

  const onRecommendSearch = async (value: string) => {
    setFetching(true);
    const res: RecommendMarketProps[] = await searchRecommendGoodsList({
      title: value,
      specType: 0,
      type: formData.recommendType || undefined,
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
    setFetching(false);
  };

  // 防抖处理
  const debounceFetcher = debounce(async (value: string) => {
    await onRecommendSearch(value);
  }, 800);

  // 当选中select素材时处理的东西
  const onRecommendSelected = async (value: string, index: number) => {
    let res = null;
    if (value) {
      res = await queryMarketArea({
        itemId: value,
        type: recommendTypeList.filter((item) => item.id === recommendType)[0]?.queryAuthId
      });
    }
    let selectedItem = recommendList.filter((item) => item.marketId === value)[0];
    selectedItem = { ...selectedItem, otherData: res };
    const oldSelectedList = [...formData.recommendList];
    oldSelectedList.splice(index, 1, selectedItem);
    form.setFieldsValue({
      recommendList: oldSelectedList
    });
    setFormData((formData) => ({ ...formData, recommendList: oldSelectedList }));
  };

  const recommendPicBeforeUpload = (file: any) => {
    const isJpg = file.type === 'image/jpeg';
    if (!isJpg) {
      message.error('只可以上传 JPG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不可以超过 2MB!');
    }
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
          const height = image.height;
          if (!(width === 690 && height === 200)) {
            message.error('请上传正确的图片尺寸');
          }
          resolve(width === 690 && height === 200 && isJpg && isLt2M);
        };
      };
      reader.readAsDataURL(file);
    });
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
          extra=" 为确保最佳展示效果，请上传154*154像素高清图片，支持.png及.jpg格式的图片。若不上传，则会使用默认封面。"
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
          <NgEditor value={formData.editorHtml} onChange={changeEditorHtml} />
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
        <Form.Item label="可见范围设置" name={'groupId'}>
          <SetUserRightFormItem form={form} />
        </Form.Item>
        {formData.syncFromMain === 0 && (
          <>
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
              className={style.customerAddWrap}
              required={recommendType !== 3}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 12 }}
              label="推荐内容"
            >
              <Button className={style.btnDemo} type="link" onClick={() => setVisibleImage(true)}>
                示例图
              </Button>
              <Form.Item
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
                              style={{ width: '400px' }}
                              {...restFiled}
                              name={[name, 'marketId']}
                              rules={[
                                { required: true, message: '请选择' },
                                ({ getFieldValue }) => ({
                                  validator (_, value) {
                                    const itemValue = getFieldValue('recommendList')[index];
                                    if (!value || itemValue.whetherDelete !== 1) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('相关内容存在已下架/删除，请检查'));
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
                                notFoundContent={
                                  fetching ? <Spin size="small" /> : <span>暂无相关素材，请试试其他内容</span>
                                }
                                onChange={(value) => onRecommendSelected(value, index)}
                                onSearch={debounceFetcher}
                              >
                                {recommendList.map((option) => (
                                  <Select.Option
                                    key={option.marketId}
                                    value={option.marketId}
                                    disabled={
                                      formData?.recommendList?.filter((item: any) => item?.marketId === option.marketId)
                                        .length > 0
                                    }
                                  >
                                    {option.title}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            <Form.Item name={[name, 'otherData']} className={style.otherData}>
                              <AreaTips />
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
                            <Icon
                              className={style.removeBtn}
                              name="cangpeitubiao_shanchu"
                              onClick={() => remove(name)}
                            />
                          </Form.Item>
                        );
                      })}
                      <Form.Item>
                        {fields.length < 5 && (
                          <Button
                            className={style.addBtn}
                            onClick={async () => {
                              if (recommendType === 3) {
                                return message.warning('请选择推荐类型后再进行添加');
                              }
                              if (recommendList.length < 5) {
                                const res = await searchRecommendGoodsList({
                                  title: '',
                                  specType: 0,
                                  recommendType,
                                  type: +recommendType && undefined
                                });

                                setRecommendList([...res] || []);
                              }
                              add();
                            }}
                          >
                            <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" /> 添加
                          </Button>
                        )}
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form.Item>
            </Form.Item>
          </>
        )}

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button type="primary" shape="round" className={style.submitBtn} htmlType="submit" loading={isSubmitting}>
            保存
          </Button>
        </Form.Item>
      </Form>

      <AntImage
        width={200}
        style={{ display: 'none' }}
        src={
          recommendType === 2
            ? require('src/assets/images/marketing/productDemo.jpg')
            : require('src/assets/images/marketing/newsDemo.jpg')
        }
        preview={{
          visible: visibleImage,
          src:
            recommendType === 2
              ? require('src/assets/images/marketing/productDemo.jpg')
              : require('src/assets/images/marketing/newsDemo.jpg'),
          onVisibleChange: (value) => {
            setVisibleImage(value);
          }
        }}
      />
    </Spin>
  );
};

export default TabView3;
