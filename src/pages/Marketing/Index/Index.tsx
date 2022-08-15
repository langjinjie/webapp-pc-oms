/**
 * @name Index
 * @author Lester
 * @date 2021-10-21 16:19
 */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Card, Collapse, Button, Form, FormProps, Select, message, Spin } from 'antd';
import { queryIndexConfig, saveIndexConfig, queryMarketArea, searchRecommendGoodsList } from 'src/apis/marketing';
import { debounce, useDocumentTitle } from 'src/utils/base';
import { AuthBtn } from 'src/components';
import style from './style.module.less';
import { AreaTips } from '../Article/Components/AreaTips';

const { Panel } = Collapse;
const { Item, useForm } = Form;

export interface RecommendMarketProps {
  marketId: string;
  title: string;
  recommendImgUrl?: string;
  whetherDelete?: number;
  otherData: any;
}

interface formDataProps {
  newsList: any[];
  posterList: any[];
  productTypeList: any[];
  activityList: any[];
}
const MarketIndex: React.FC = () => {
  useDocumentTitle('移动端首页配置');
  const [posterList, setPosterList] = useState<any[]>([]);
  const [articleList, setArticleList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [activityList, setActivityList] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [formData, setFormData] = useState<formDataProps>({
    newsList: [],
    posterList: [],
    productTypeList: [],
    activityList: []
  });

  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 }
  };

  const onSubmit = async (values: any) => {
    const { newsList, productTypeList, posterList, activityList } = values;
    const param: any = {
      products: productTypeList
        .filter((product: any) => product.marketId || product.productId)
        .map((item: any) => ({ extId: item.marketId || item.productId })),
      news: newsList
        .filter((news: any) => news.marketId || news.articleId)
        .map((item: any) => ({ extId: item.marketId || item.articleId })),
      posters: posterList
        .filter((poster: any) => poster.marketId || poster.posterId)
        .map((item: any) => ({ extId: item.marketId || item.posterId })),
      activitys: activityList
        .filter((activity: any) => activity.activityId || activity.marketId)
        .map((item: any) => ({ extId: item.activityId || item.marketId }))
    };

    const res: any = await saveIndexConfig(param);
    if (res) {
      message.success('保存成功');
    }
  };

  const getConfigData = async () => {
    const res: any = await queryIndexConfig();
    const defaultProductList = [{}, {}, {}];
    const defaultArticleList = [{}, {}, {}];
    const defaultPosterList = [{}, {}, {}];
    const defaultActivityList = [{}, {}, {}];
    if (res) {
      let { activityList, newsList, posterList, productTypeList } = res;
      if (newsList && newsList.length > 0) {
        newsList = await Promise.all(
          newsList.map(async (news: any) => {
            const res = await queryMarketArea({
              itemId: news.articleId,
              type: 3
            });
            news.otherData = res;
            return news;
          })
        );
        setArticleList(newsList);
        // 数组自动补全
        const spliceIndex: number = newsList.length;
        newsList = newsList.concat(defaultArticleList.splice(spliceIndex, 3));
      } else {
        newsList = defaultArticleList;
      }
      if (productTypeList && productTypeList.length > 0) {
        productTypeList = await Promise.all(
          productTypeList.map(async (product: any) => {
            const res = await queryMarketArea({
              itemId: product.productId,
              type: 2
            });
            product.otherData = res;
            return product;
          })
        );
        // 数组自动补全
        setProductList(() => productTypeList);
        const spliceIndex: number = productTypeList.length;
        productTypeList = productTypeList.concat(defaultProductList.splice(spliceIndex, 3));
      } else {
        productTypeList = defaultProductList;
      }
      if (posterList && posterList.length > 0) {
        posterList = await Promise.all(
          posterList.map(async (poster: any) => {
            const res = await queryMarketArea({
              itemId: poster.posterId,
              type: 4
            });
            poster.otherData = res;
            return poster;
          })
        );
        // 数组自动补全
        setPosterList(() => posterList);
        const spliceIndex: number = posterList.length;
        posterList = posterList.concat(defaultPosterList.splice(spliceIndex, 3));
      } else {
        posterList = defaultPosterList;
      }

      if (activityList && activityList.length > 0) {
        activityList = await Promise.all(
          activityList.map(async (activity: any) => {
            const res = await queryMarketArea({
              itemId: activity.activityId,
              type: 1
            });
            activity.otherData = res;
            return activity;
          })
        );
        // 数组自动补全
        setActivityList(() => activityList);
        const spliceIndex: number = activityList.length;
        activityList = activityList.concat(defaultActivityList.splice(spliceIndex, 3));
      } else {
        activityList = defaultActivityList;
      }
      form.setFieldsValue({
        newsList,
        posterList,
        productTypeList,
        activityList
      });
      setFormData({ newsList, posterList, productTypeList, activityList });
      console.log(posterList);
    }
  };

  useEffect(() => {
    getConfigData();
  }, []);

  // 当选中select素材时处理的东西
  const onRecommendSelected = async (value: string, index: number, marketType: number) => {
    // 文章的
    if (marketType === 3) {
      if (value) {
        const res = await queryMarketArea({
          itemId: value,
          type: marketType
        });
        const selectedItem = articleList.filter((item) => item.marketId === value)[0];
        selectedItem.articleId = selectedItem.articleId || selectedItem.marketId;
        selectedItem.otherData = res;
        const oldSelectedList = [...formData.newsList];
        oldSelectedList.splice(index, 1, selectedItem);
        form.setFieldsValue({
          newsList: oldSelectedList
        });
        setFormData((formData) => ({ ...formData, newsList: oldSelectedList }));
      } else {
        const oldSelectedList = [...formData.newsList];
        oldSelectedList.splice(index, 1, {});
        setFormData((formData) => ({ ...formData, newsList: oldSelectedList }));
        form.setFieldsValue({
          newsList: oldSelectedList
        });
      }
    }
    // 产品
    if (marketType === 2) {
      if (value) {
        const res = await queryMarketArea({
          itemId: value,
          type: marketType
        });
        const selectedItem = productList.filter((item) => item.marketId === value || item.productId === value)[0];
        selectedItem.productId = selectedItem.productId || selectedItem.marketId;
        selectedItem.otherData = res;
        const oldSelectedList = [...formData.productTypeList];
        oldSelectedList.splice(index, 1, selectedItem);
        form.setFieldsValue({
          productTypeList: oldSelectedList
        });
        setFormData((formData) => ({
          ...formData,
          productTypeList: oldSelectedList
        }));
      } else {
        const oldSelectedList = [...formData.productTypeList];
        oldSelectedList.splice(index, 1, {});
        form.setFieldsValue({
          productTypeList: oldSelectedList
        });
        setFormData((formData) => ({
          ...formData,
          productTypeList: oldSelectedList
        }));
      }
    }
    // 海报
    if (marketType === 4) {
      if (value) {
        const res = await queryMarketArea({
          itemId: value,
          type: marketType
        });
        const selectedItem = posterList.filter((item) => item.marketId === value || item.posterId === value)[0];
        selectedItem.posterId = selectedItem.posterId || selectedItem.marketId;
        selectedItem.otherData = res;
        const oldSelectedList = [...formData.posterList];
        oldSelectedList.splice(index, 1, selectedItem);
        form.setFieldsValue({
          posterList: oldSelectedList
        });
        setFormData((formData: any) => ({
          ...formData,
          posterList: oldSelectedList
        }));
      } else {
        const oldSelectedList = [...formData.posterList];
        oldSelectedList.splice(index, 1, {});
        form.setFieldsValue({
          posterList: oldSelectedList
        });
        setFormData((formData: any) => ({
          ...formData,
          posterList: oldSelectedList
        }));
      }
    }
    // 活动
    if (marketType === 1) {
      if (value) {
        const res = await queryMarketArea({
          itemId: value,
          type: marketType
        });
        const selectedItem = activityList.filter((item) => item.marketId === value || item.activityId === value)[0];
        selectedItem.activityId = selectedItem.activityId || selectedItem.marketId;
        selectedItem.otherData = res;
        const oldSelectedList = [...formData.activityList];
        oldSelectedList.splice(index, 1, selectedItem);
        form.setFieldsValue({
          activityList: oldSelectedList
        });
        setFormData((formData: any) => ({
          ...formData,
          activityList: oldSelectedList
        }));
      } else {
        const oldSelectedList = [...formData.activityList];
        oldSelectedList.splice(index, 1, {});
        form.setFieldsValue({
          activityList: oldSelectedList
        });
        setFormData((formData: any) => ({
          ...formData,
          activityList: oldSelectedList
        }));
      }
    }
  };

  const onRecommendSearch = async (value: string, marketType: number) => {
    setFetching(true);
    const res: RecommendMarketProps[] = await searchRecommendGoodsList({
      title: value,
      type: 1,
      recommendType: marketType
    });
    if (marketType === 0) {
      const resList = [...formData.newsList?.filter((item: any) => item !== undefined), ...res];
      const obj: any = {};
      const arr = resList.reduce((newArr: RecommendMarketProps[], next) => {
        if (obj[next.marketId || next.articleId]) {
          console.log(obj);
        } else {
          obj[next.marketId || next.articleId] = true && newArr.push(next);
        }
        return newArr;
      }, []);
      setArticleList(arr);
    } else if (marketType === 2) {
      const resList = [...formData.productTypeList?.filter((item: any) => item.productId), ...res];
      const obj: any = {};
      const arr = resList.reduce((newArr: RecommendMarketProps[], next) => {
        if (obj[next.marketId || next.productId]) {
          console.log(obj);
        } else {
          obj[next.marketId || next.productId] = true && newArr.push(next);
        }
        return newArr;
      }, []);
      setProductList(arr);
    } else if (marketType === 1) {
      const resList = [...formData.activityList?.filter((item: any) => item.activityId), ...res];
      const obj: any = {};
      const arr = resList.reduce((newArr: RecommendMarketProps[], next) => {
        if (obj[next.marketId || next.activityId]) {
          console.log(obj);
        } else {
          obj[next.marketId || next.activityId] = true && newArr.push(next);
        }
        return newArr;
      }, []);
      setActivityList(arr);
    } else if (marketType === 3) {
      const resList = [...formData.posterList?.filter((item: any) => item.posterId), ...res];
      const obj: any = {};
      const arr = resList.reduce((newArr: RecommendMarketProps[], next) => {
        if (obj[next.marketId || next.posterId]) {
          console.log(obj);
        } else {
          obj[next.marketId || next.posterId] = true && newArr.push(next);
        }
        return newArr;
      }, []);
      setPosterList(arr);
    }
    setFetching(false);
  };

  // 防抖处理
  const debounceFetcher = debounce<{ value: any; marketType: Number }>(
    async ({ value, marketType }: { value: string; marketType: number }) => {
      await onRecommendSearch(value, marketType);
    },
    800
  );

  return (
    <Card>
      <Form className={classNames(style.formWrap, 'edit')} form={form} onFinish={onSubmit} {...formLayout}>
        <Collapse defaultActiveKey={['activity', 'product', 'article', 'poster']}>
          <Panel key="product" header="精选产品">
            <Form.List name={'productTypeList'} key="productTypeList">
              {(fields) => (
                <>
                  {fields?.map(({ name, ...restFiled }, index) => {
                    return (
                      <div key={'productTypeList' + index} className={style.formListWrap}>
                        <Item
                          style={{
                            width: '400px'
                          }}
                          label={`产品${index + 1} `}
                          {...restFiled}
                          name={[name, 'productId']}
                          rules={[
                            { required: index === 0, message: '请选择' },
                            ({ getFieldValue }) => ({
                              validator (_, value) {
                                const itemValue = getFieldValue('productTypeList')[index];
                                if (!value || itemValue.status !== 3) {
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
                            onDropdownVisibleChange={() => {
                              if (productList.length < 5) {
                                debounceFetcher({ value: '', marketType: 2 });
                              }
                            }}
                            onChange={(value) => onRecommendSelected(value, index, 2)}
                            onSearch={(value) => debounceFetcher({ value: value, marketType: 2 })}
                          >
                            {productList.map((option) => {
                              return (
                                <Select.Option
                                  key={option.productId || option.marketId}
                                  value={option.productId || option.marketId}
                                  disabled={
                                    formData?.productTypeList?.filter(
                                      (item: any) =>
                                        (item?.marketId || item.productId) === (option.marketId || option.productId)
                                    ).length > 0
                                  }
                                >
                                  {option.productName || option.title}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Item>
                        <Form.Item name={[name, 'otherData']} className={style.otherData}>
                          <AreaTips />
                        </Form.Item>
                      </div>
                    );
                  })}
                </>
              )}
            </Form.List>
          </Panel>
          <Panel key="article" header="精选文章">
            <Form.List name={'newsList'} key="newsList">
              {(fields) => (
                <>
                  {fields?.map(({ name, ...restFiled }, index) => {
                    return (
                      <div key={'abdc' + index} className={style.formListWrap}>
                        <Item
                          style={{
                            width: '400px'
                          }}
                          label={`文章${index + 1} `}
                          {...restFiled}
                          name={[name, 'articleId']}
                          rules={[
                            { required: true, message: '请选择' },
                            ({ getFieldValue }) => ({
                              validator (_, value) {
                                const itemValue = getFieldValue('newsList')[index];
                                if (!value || (itemValue.status !== 2 && itemValue.status !== 3)) {
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
                            onDropdownVisibleChange={() => {
                              if (articleList.length < 5) {
                                debounceFetcher({ value: '', marketType: 0 });
                              }
                            }}
                            onChange={(value) => onRecommendSelected(value, index, 3)}
                            onSearch={(value) => debounceFetcher({ value: value, marketType: 0 })}
                          >
                            {articleList.map((option) => {
                              return (
                                <Select.Option
                                  key={option.articleId || option.marketId}
                                  value={option.articleId || option.marketId}
                                  disabled={
                                    formData?.newsList?.filter(
                                      (item: any) =>
                                        (item?.marketId || item.articleId) === (option.marketId || option.articleId)
                                    ).length > 0
                                  }
                                >
                                  {option.title}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Item>
                        <Form.Item name={[name, 'otherData']} className={style.otherData}>
                          <AreaTips />
                        </Form.Item>
                      </div>
                    );
                  })}
                </>
              )}
            </Form.List>
          </Panel>
          <Panel key="poster" header="展业海报">
            <Form.List name={'posterList'} key="posterList">
              {(fields) => (
                <>
                  {fields?.map(({ name, ...restFiled }, index) => {
                    return (
                      <div key={'posterList' + index} className={style.formListWrap}>
                        <Item
                          style={{
                            width: '400px'
                          }}
                          label={`海报${index + 1} `}
                          {...restFiled}
                          name={[name, 'posterId']}
                          rules={[
                            { required: true, message: '请选择' },
                            ({ getFieldValue }) => ({
                              validator (_, value) {
                                const itemValue = getFieldValue('productTypeList')[index];
                                if (!value || itemValue.status !== 3) {
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
                            onDropdownVisibleChange={() => {
                              if (posterList.length < 5) {
                                debounceFetcher({ value: '', marketType: 3 });
                              }
                            }}
                            notFoundContent={
                              fetching ? <Spin size="small" /> : <span>暂无相关素材，请试试其他内容</span>
                            }
                            onChange={(value) => onRecommendSelected(value, index, 4)}
                            onSearch={(value) => debounceFetcher({ value: value, marketType: 3 })}
                          >
                            {posterList.map((option) => {
                              return (
                                <Select.Option
                                  key={option.posterId || option.marketId}
                                  value={option.posterId || option.marketId}
                                  disabled={
                                    formData?.posterList?.filter(
                                      (item: any) =>
                                        (item?.marketId || item.posterId) === (option.marketId || option.posterId)
                                    ).length > 0
                                  }
                                >
                                  {option.name || option.title}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Item>
                        <Form.Item name={[name, 'otherData']} className={style.otherData}>
                          <AreaTips />
                        </Form.Item>
                      </div>
                    );
                  })}
                </>
              )}
            </Form.List>
          </Panel>
          <Panel key="activity" header="营销活动">
            <Form.List name={'activityList'} key="activityList">
              {(fields) => (
                <>
                  {fields?.map(({ name, ...restFiled }, index) => {
                    return (
                      <div key={'activity' + index} className={style.formListWrap}>
                        <Item
                          style={{
                            width: '400px'
                          }}
                          label={`活动${index + 1} `}
                          {...restFiled}
                          name={[name, 'activityId']}
                          rules={[
                            { message: '请选择' },
                            ({ getFieldValue }) => ({
                              validator (_, value) {
                                const itemValue = getFieldValue('productTypeList')[index];
                                if (!value || itemValue.status !== 3) {
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
                            onChange={(value) => onRecommendSelected(value, index, 1)}
                            onDropdownVisibleChange={() => {
                              if (activityList.length < 5) {
                                debounceFetcher({ value: '', marketType: 1 });
                              }
                            }}
                            onSearch={(value) => debounceFetcher({ value: value, marketType: 1 })}
                          >
                            {activityList.map((option) => {
                              return (
                                <Select.Option
                                  key={option.activityId || option.marketId}
                                  value={option.activityId || option.marketId}
                                  disabled={
                                    formData?.activityList?.filter(
                                      (item: any) =>
                                        (item?.marketId || item.activityId) === (option.marketId || option.activityId)
                                    ).length > 0
                                  }
                                >
                                  {option.activityName || option.title}
                                </Select.Option>
                              );
                            })}
                          </Select>
                        </Item>
                        <Form.Item name={[name, 'otherData']} className={style.otherData}>
                          <AreaTips />
                        </Form.Item>
                      </div>
                    );
                  })}
                </>
              )}
            </Form.List>
          </Panel>
        </Collapse>
        <AuthBtn path="/submit">
          <div className={style.btnWrp}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </div>
        </AuthBtn>
      </Form>
    </Card>
  );
};

export default MarketIndex;
