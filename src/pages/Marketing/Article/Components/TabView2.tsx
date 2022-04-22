import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Select, Button, message, Image, Radio, RadioChangeEvent } from 'antd';
import { peerNews, getTagsOrCategorys, searchRecommendGoodsList } from 'src/apis/marketing';
import { useHistory } from 'react-router-dom';
import { Context } from 'src/store';
import NgUpload from '../../Components/Upload/Upload';
import style from './style.module.less';
import { Icon } from 'lester-ui';
import { RecommendMarketProps } from './TabView3';
import { debounce } from 'src/utils/base';
import { recommendTypeList } from '../Config';
interface typeProps {
  id: string;
  name: string;
  type: string;
}
const TabView2: React.FC = () => {
  const [visibleImage, setVisibleImage] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [recommendList, setRecommendList] = useState<RecommendMarketProps[]>([]);
  const [recommendType, setRecommendType] = useState(3);

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
  const { currentCorpId, articleCategoryList, setArticleCategoryList, articleTagList, setArticleTagList } =
    useContext(Context);
  const [form] = Form.useForm();
  const RouterHistory = useHistory();
  const [categoryList] = useState<typeProps[]>([]);
  const [tagList] = useState<typeProps[]>([]);
  const [newUploadProductIdList, setNewUploadProductIdList] = useState<string[]>([]);
  const changeSummary: React.ChangeEventHandler<HTMLInputElement> = (event) => {
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
    console.log(values);
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
        form.resetFields();
        RouterHistory.push('/marketingArticle');
      });
    } catch (e) {
      setSubmitting(false);
      console.log(e);
    }
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

  const isUploadDisabled = (index: number): boolean => {
    const currentItem: RecommendMarketProps = form.getFieldValue('recommendList')[index];
    if (!currentItem) {
      return false;
    }
    return !!currentItem?.recommendImgUrl && !newUploadProductIdList.includes(currentItem.marketId);
  };

  // 防抖处理
  const debounceFetcher = debounce(async (value: string) => {
    await onRecommendSearch(value);
  }, 800);
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
  const onFormValuesChange = (changeValues: any, values: any) => {
    const { recommendType } = values;
    setFormData((formData) => ({ ...formData, recommendType }));
  };

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 12 }}
        onFinish={onFinish}
        name="control-hooks"
        initialValues={formData}
        scrollToFirstError={true}
        onValuesChange={onFormValuesChange}
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
          name="fromSource"
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
        <Form.Item name={'recommendType'} label="推荐类型">
          <Radio.Group onChange={onRecommendTypeChange}>
            {recommendTypeList.map((item) => (
              <Radio key={item.id} value={+item.id}>
                {item.name}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item className={style.customerAddWrap} labelCol={{ span: 3 }} wrapperCol={{ span: 12 }} label="推荐内容">
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
                                  formData?.recommendList?.filter((item: any) => item?.marketId === option.marketId)
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
                      <Button
                        className={style.addBtn}
                        onClick={() => {
                          if (recommendType === 3) {
                            return message.warning('请选择推荐类型后再进行添加');
                          }
                          add();
                        }}
                      >
                        <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" /> 添加
                      </Button>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button type="primary" shape="round" htmlType="submit" loading={isSubmitting}>
            添加
          </Button>
        </Form.Item>
      </Form>

      <Image
        width={200}
        style={{ display: 'none' }}
        src={
          recommendType === 2
            ? require('src/assets/images/marketing/productDemo.png')
            : require('src/assets/images/marketing/newsDemo.png')
        }
        preview={{
          visible: visibleImage,
          src:
            recommendType === 2
              ? require('src/assets/images/marketing/productDemo.png')
              : require('src/assets/images/marketing/newsDemo.png'),
          onVisibleChange: (value) => {
            setVisibleImage(value);
          }
        }}
      />
    </>
  );
};

export default TabView2;
