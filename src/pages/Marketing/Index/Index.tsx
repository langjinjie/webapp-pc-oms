/**
 * @name Index
 * @author Lester
 * @date 2021-10-21 16:19
 */
import React, { useEffect, useState } from 'react';
import { Card, Collapse, Button, Form, FormProps, Select, message } from 'antd';
import {
  getPosterList,
  queryArticleList,
  queryProductList,
  queryActivityList,
  queryIndexConfig,
  saveIndexConfig
} from 'src/apis/marketing';
import style from './style.module.less';

interface Poster {
  posterId: string;
  name: string;
  status: number;
}

interface Article {
  newsId: string;
  articleId: string;
  title: string;
  status: number;
  syncBank?: number;
}

interface Activity {
  activityId: string;
  activityName: string;
  status: number;
}

interface Product {
  productId: string;
  productName: string;
  status: number;
}

const { Panel } = Collapse;
const { Item, useForm } = Form;
const { Option } = Select;

const MarketIndex: React.FC = () => {
  const [posterList, setPosterList] = useState<Poster[]>([]);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [activityMessage, setActivityMessage] = useState<string[]>([]);
  const [productMessage, setProductMessage] = useState<string[]>([]);
  const [posterMessage, setPosterMessage] = useState<string[]>([]);
  const [articleMessage, setArticleMessage] = useState<string[]>([]);
  const [chooseValue, setChooseValue] = useState<any>({});

  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 6 }
  };

  /* const isRepeat = (data: string[]) => {
    return data.length !== Array.from(new Set(data)).length;
  }; */

  const onSubmit = async (values: any) => {
    const {
      product,
      productTwo,
      productThree,
      article,
      articleTwo,
      articleThree,
      poster,
      posterTwo,
      posterThree,
      activity,
      activityTwo,
      activityThree
    } = values;

    const param: any = {
      products: [{ extId: product }],
      news: [{ extId: article }, { extId: articleTwo }, { extId: articleThree }],
      posters: [{ extId: poster }, { extId: posterTwo }, { extId: posterThree }],
      activitys: []
    };
    if (productTwo) {
      param.products.push({
        extId: productTwo
      });
    }
    if (productThree) {
      param.products.push({
        extId: productThree
      });
    }
    if (activity) {
      param.activitys.push({
        extId: activity
      });
    }
    if (activityTwo) {
      param.activitys.push({
        extId: activityTwo
      });
    }
    if (activityThree) {
      param.activitys.push({
        extId: activityThree
      });
    }
    const res: any = await saveIndexConfig(param);
    if (res) {
      message.success('保存成功');
    }
  };

  const getPosterData = async () => {
    const res: any = await getPosterList({ pageSize: 1000, status: 2 });
    if (res) {
      setPosterList(res.list || []);
    }
  };

  const getArticleList = async () => {
    const res: any = await queryArticleList({ pageSize: 1000, syncBank: 1 });
    if (res) {
      setArticleList(res.newsList || []);
    }
  };

  const getProductList = async () => {
    const res: any = await queryProductList({ pageSize: 1000, status: 2 });
    if (res) {
      setProductList(res.list || []);
    }
  };

  const getActivityList = async () => {
    const res: any = await queryActivityList({ pageSize: 1000, status: 2 });
    if (res) {
      setActivityList(res.list || []);
    }
  };

  const getConfigData = async () => {
    const res: any = await queryIndexConfig();
    if (res) {
      const { activityList, newsList, posterList, productTypeList } = res;
      let initChooseValue = {};
      if (posterList && posterList.length > 0) {
        const initValue = {
          poster: posterList[0].status === 3 ? undefined : posterList[0].posterId,
          posterTwo: (posterList[1] || {}).status === 3 ? undefined : (posterList[1] || {}).posterId,
          posterThree: (posterList[2] || {}).status === 3 ? undefined : (posterList[2] || {}).posterId
        };
        form.setFieldsValue({
          ...initValue
        });
        initChooseValue = {
          ...initValue
        };
      }
      if (newsList && newsList.length > 0) {
        const initValue = {
          article: newsList[0].status === 2 ? undefined : newsList[0].articleId,
          articleTwo: (newsList[1] || {}).status === 2 ? undefined : (newsList[1] || {}).articleId,
          articleThree: (newsList[2] || {}).status === 2 ? undefined : (newsList[2] || {}).articleId
        };
        form.setFieldsValue({
          ...initValue
        });
        initChooseValue = {
          ...initChooseValue,
          ...initValue
        };
      }
      if (productTypeList && productTypeList.length > 0) {
        const initValue = {
          product: productTypeList[0].status === 3 ? undefined : productTypeList[0].productId,
          productTwo: (productTypeList[1] || {}).status === 3 ? undefined : (productTypeList[1] || {}).productId,
          productThree: (productTypeList[2] || {}).status === 3 ? undefined : (productTypeList[2] || {}).productId
        };
        form.setFieldsValue({
          ...initValue
        });
        initChooseValue = {
          ...initChooseValue,
          ...initValue
        };
      }
      if (activityList && activityList.length > 0) {
        const initValue = {
          activity: activityList[0].status === 3 ? undefined : activityList[0].activityId,
          activityTwo: (activityList[1] || {}).status === 3 ? undefined : (activityList[1] || {}).activityId,
          activityThree: (activityList[2] || {}).status === 3 ? undefined : (activityList[2] || {}).activityId
        };
        form.setFieldsValue({
          ...initValue
        });
        initChooseValue = {
          ...initChooseValue,
          ...initValue
        };
      }
      setChooseValue(initChooseValue);
      const activityMessages: string[] = [];
      const productMessages: string[] = [];
      const posterMessages: string[] = [];
      const articleMessages: string[] = [];
      activityList.forEach(({ status, activityName, activityId }: Activity) => {
        if (status === 3) {
          activityMessages.push(`${activityName || activityId}已下架，请重新选择`);
        } else {
          activityMessages.push('请选择活动');
        }
      });
      productTypeList.forEach(({ status, productName, productId }: Product) => {
        if (status === 3) {
          productMessages.push(`${productName || productId}已下架，请重新选择`);
        } else {
          productMessages.push('请选择产品');
        }
      });
      posterList.forEach(({ status, name, posterId }: Poster) => {
        if (status === 3) {
          posterMessages.push(`${name || posterId}已下架，请重新选择`);
        } else {
          posterMessages.push('请选择海报');
        }
      });
      newsList.forEach(({ status, title, articleId }: Article) => {
        if (status === 2) {
          articleMessages.push(`${title || articleId}已下架，请重新选择`);
        } else {
          articleMessages.push('请选择文章');
        }
      });
      setActivityMessage(activityMessages);
      setProductMessage(productMessages);
      setPosterMessage(posterMessages);
      setArticleMessage(articleMessages);
      if (newsList && newsList.length > 0) {
        form.validateFields();
      }
    }
  };

  const getMarketMessage = (type: number, msg?: string) => {
    if (msg) {
      return msg;
    }
    let msgStr = '请选择';
    if (type === 0) {
      msgStr += '产品';
    }
    if (type === 1) {
      msgStr += '文章';
    }
    if (type === 2) {
      msgStr += '海报';
    }
    if (type === 3) {
      msgStr += '活动';
    }
    return msgStr;
  };

  useEffect(() => {
    getPosterData();
    getArticleList();
    getProductList();
    getActivityList();
    getConfigData();
  }, []);

  return (
    <Card>
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Collapse defaultActiveKey={['activity', 'product', 'article', 'poster']}>
          <Panel key="product" header="精选产品">
            <Item
              name="product"
              label="产品一"
              rules={[{ required: true, message: getMarketMessage(0, productMessage[0]) }]}
            >
              <Select
                placeholder={getMarketMessage(0, productMessage[0])}
                onChange={(val) => setChooseValue({ ...chooseValue, product: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {productList.map((item) => (
                  <Option
                    key={item.productId}
                    value={item.productId}
                    disabled={
                      item.status === 3 || [chooseValue.productTwo, chooseValue.productThree].includes(item.productId)
                    }
                  >
                    {item.productName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="productTwo" label="产品二">
              <Select
                placeholder={getMarketMessage(0, productMessage[1])}
                onChange={(val) => setChooseValue({ ...chooseValue, productTwo: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {productList.map((item) => (
                  <Option
                    key={item.productId}
                    value={item.productId}
                    disabled={
                      item.status === 3 || [chooseValue.product, chooseValue.productThree].includes(item.productId)
                    }
                  >
                    {item.productName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="productThree" label="产品三">
              <Select
                placeholder={getMarketMessage(0, productMessage[2])}
                onChange={(val) => setChooseValue({ ...chooseValue, productThree: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {productList.map((item) => (
                  <Option
                    key={item.productId}
                    value={item.productId}
                    disabled={
                      item.status === 3 || [chooseValue.product, chooseValue.productTwo].includes(item.productId)
                    }
                  >
                    {item.productName}
                  </Option>
                ))}
              </Select>
            </Item>
          </Panel>
          <Panel key="article" header="精选文章">
            <Item
              name="article"
              label="文章一"
              rules={[{ required: true, message: getMarketMessage(1, articleMessage[0]) }]}
            >
              <Select
                placeholder={getMarketMessage(1, articleMessage[0])}
                onChange={(val) => setChooseValue({ ...chooseValue, article: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {articleList.map((item) => (
                  <Option
                    key={item.newsId}
                    value={item.newsId}
                    disabled={
                      item.syncBank === 2 || [chooseValue.articleTwo, chooseValue.articleThree].includes(item.newsId)
                    }
                  >
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item
              name="articleTwo"
              label="文章二"
              rules={[{ required: true, message: getMarketMessage(1, articleMessage[1]) }]}
            >
              <Select
                placeholder={getMarketMessage(1, articleMessage[1])}
                onChange={(val) => setChooseValue({ ...chooseValue, articleTwo: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {articleList.map((item) => (
                  <Option
                    key={item.newsId}
                    value={item.newsId}
                    disabled={
                      item.syncBank === 2 || [chooseValue.article, chooseValue.articleThree].includes(item.newsId)
                    }
                  >
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item
              name="articleThree"
              label="文章三"
              rules={[{ required: true, message: getMarketMessage(1, articleMessage[2]) }]}
            >
              <Select
                placeholder={getMarketMessage(1, articleMessage[2])}
                onChange={(val) => setChooseValue({ ...chooseValue, articleThree: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {articleList.map((item) => (
                  <Option
                    key={item.newsId}
                    value={item.newsId}
                    disabled={
                      item.syncBank === 2 || [chooseValue.article, chooseValue.articleTwo].includes(item.newsId)
                    }
                  >
                    {item.title}
                  </Option>
                ))}
              </Select>
            </Item>
          </Panel>
          <Panel key="poster" header="展业海报">
            <Item
              name="poster"
              label="海报一"
              rules={[{ required: true, message: getMarketMessage(2, posterMessage[0]) }]}
            >
              <Select
                placeholder={getMarketMessage(2, posterMessage[0])}
                onChange={(val) => setChooseValue({ ...chooseValue, poster: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {posterList.map((item) => (
                  <Option
                    key={item.posterId}
                    value={item.posterId}
                    disabled={
                      item.status === 3 || [chooseValue.posterTwo, chooseValue.posterThree].includes(item.posterId)
                    }
                  >
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item
              name="posterTwo"
              label="海报二"
              rules={[{ required: true, message: getMarketMessage(2, posterMessage[1]) }]}
            >
              <Select
                placeholder={getMarketMessage(2, posterMessage[1])}
                onChange={(val) => setChooseValue({ ...chooseValue, posterTwo: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {posterList.map((item) => (
                  <Option
                    key={item.posterId}
                    value={item.posterId}
                    disabled={
                      item.status === 3 || [chooseValue.poster, chooseValue.posterThree].includes(item.posterId)
                    }
                  >
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item
              name="posterThree"
              label="海报三"
              rules={[{ required: true, message: getMarketMessage(2, posterMessage[2]) }]}
            >
              <Select
                placeholder={getMarketMessage(2, posterMessage[2])}
                onChange={(val) => setChooseValue({ ...chooseValue, posterThree: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {posterList.map((item) => (
                  <Option
                    key={item.posterId}
                    value={item.posterId}
                    disabled={item.status === 3 || [chooseValue.poster, chooseValue.posterTwo].includes(item.posterId)}
                  >
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Item>
          </Panel>
          <Panel key="activity" header="营销活动">
            <Item name="activity" label="活动一">
              <Select
                placeholder={getMarketMessage(3, activityMessage[0])}
                onChange={(val) => setChooseValue({ ...chooseValue, activity: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {activityList.map((item) => (
                  <Option
                    key={item.activityId}
                    value={item.activityId}
                    disabled={
                      item.status === 3 ||
                      [chooseValue.activityTwo, chooseValue.activityThree].includes(item.activityId)
                    }
                  >
                    {item.activityName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="activityTwo" label="活动二">
              <Select
                placeholder={getMarketMessage(3, activityMessage[1])}
                onChange={(val) => setChooseValue({ ...chooseValue, activityTwo: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {activityList.map((item) => (
                  <Option
                    key={item.activityId}
                    value={item.activityId}
                    disabled={
                      item.status === 3 || [chooseValue.activity, chooseValue.activityThree].includes(item.activityId)
                    }
                  >
                    {item.activityName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="activityThree" label="活动三">
              <Select
                placeholder={getMarketMessage(3, activityMessage[2])}
                onChange={(val) => setChooseValue({ ...chooseValue, activityThree: val })}
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {activityList.map((item) => (
                  <Option
                    key={item.activityId}
                    value={item.activityId}
                    disabled={
                      item.status === 3 || [chooseValue.activity, chooseValue.activityTwo].includes(item.activityId)
                    }
                  >
                    {item.activityName}
                  </Option>
                ))}
              </Select>
            </Item>
          </Panel>
        </Collapse>
        <div className={style.btnWrp}>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default MarketIndex;
