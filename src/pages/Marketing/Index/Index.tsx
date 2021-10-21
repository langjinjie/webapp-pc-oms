/**
 * @name Index
 * @author Lester
 * @date 2021-10-21 16:19
 */
import React, { useEffect, useState } from 'react';
import { Card, Collapse, Button, Form, FormProps, Select, message } from 'antd';
import style from './style.module.less';

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
  const [productList, setProductList] = useState<Product[]>([]);
  const [activityList, setaAtivityList] = useState<Activity[]>([]);

  const [form] = useForm();

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 6 }
  };

  const onSubmit = (values: any) => {
    console.log(values);
    message.success('保存成功');
  };

  useEffect(() => {
    setProductList([
      {
        productId: '123',
        productName: '产品111111',
        status: 1
      }
    ]);
    setaAtivityList([
      {
        activityId: '123',
        activityName: '活动111111',
        status: 1
      }
    ]);
  }, []);

  return (
    <Card>
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Collapse defaultActiveKey={['activity', 'product', 'article', 'poster']}>
          <Panel key="product" header="精选产品">
            <Item name="product" label="产品一" rules={[{ required: true, message: '请选择产品' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {productList.map((item) => (
                  <Option key={item.productId} value={item.productId}>
                    {item.productName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="product2" label="产品二" rules={[{ required: true, message: '请选择产品' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {productList.map((item) => (
                  <Option key={item.productId} value={item.productId}>
                    {item.productName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="product3" label="产品三" rules={[{ required: true, message: '请选择产品' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {productList.map((item) => (
                  <Option key={item.productId} value={item.productId}>
                    {item.productName}
                  </Option>
                ))}
              </Select>
            </Item>
          </Panel>
          <Panel key="article" header="精选文章">
            <Item name="article" label="文章一" rules={[{ required: true, message: '请选择文章' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {productList.map((item) => (
                  <Option key={item.productId} value={item.productId}>
                    {item.productName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="article2" label="文章二" rules={[{ required: true, message: '请选择文章' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {productList.map((item) => (
                  <Option key={item.productId} value={item.productId}>
                    {item.productName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="article3" label="文章三" rules={[{ required: true, message: '请选择文章' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {productList.map((item) => (
                  <Option key={item.productId} value={item.productId}>
                    {item.productName}
                  </Option>
                ))}
              </Select>
            </Item>
          </Panel>
          <Panel key="poster" header="展业海报">
            <Item name="poster" label="海报一" rules={[{ required: true, message: '请选择海报' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {activityList.map((item) => (
                  <Option key={item.activityId} value={item.activityId}>
                    {item.activityName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="poster2" label="海报二" rules={[{ required: true, message: '请选择海报' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {activityList.map((item) => (
                  <Option key={item.activityId} value={item.activityId}>
                    {item.activityName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="poster3" label="海报三" rules={[{ required: true, message: '请选择海报' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {activityList.map((item) => (
                  <Option key={item.activityId} value={item.activityId}>
                    {item.activityName}
                  </Option>
                ))}
              </Select>
            </Item>
          </Panel>
          <Panel key="activity" header="营销活动">
            <Item name="activity" label="活动一" rules={[{ required: true, message: '请选择活动' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {activityList.map((item) => (
                  <Option key={item.activityId} value={item.activityId}>
                    {item.activityName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="activity2" label="活动二" rules={[{ required: true, message: '请选择活动' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {activityList.map((item) => (
                  <Option key={item.activityId} value={item.activityId}>
                    {item.activityName}
                  </Option>
                ))}
              </Select>
            </Item>
            <Item name="activity3" label="活动三" rules={[{ required: true, message: '请选择活动' }]}>
              <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                allowClear
              >
                {activityList.map((item) => (
                  <Option key={item.activityId} value={item.activityId}>
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
