import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Row, Col, Card, Form, FormProps, message, Button, Select, Tooltip } from 'antd';
import { getProductOnlineList, productChoiceList, productChoiceEdit, queryMarketArea } from 'src/apis/marketing';
import { Icon } from 'src/components';
import NgUpload from '../Components/Upload/Upload';
import { AreaTips } from '../Article/Components/AreaTips';
import style from './style.module.less';

const { Option } = Select;
const getItemStyle = () => ({
  height: 'auto',
  marginBottom: '20px',
  width: '100%'
});
const ProductFeatureConfig: React.FC<RouteComponentProps> = ({ history }) => {
  const [data, setData] = useState<any[]>(function () {
    const newData = Array.from({ length: 4 }, (item, index) => ({
      key: 'key' + index,
      productId: undefined,
      productName: '',
      choiceId: '',
      status: 2
    }));
    return newData;
  });
  const [productList, setProductList] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = Form.useForm();
  // 每一项的样式

  const indexFormat = (index: number) => {
    switch (index) {
      case 1:
        return '一';
      case 2:
        return '二';
      case 3:
        return '三';
      case 4:
        return '四';
    }
  };

  // 获取产品列表
  const getProducts = async () => {
    const res = await getProductOnlineList({});
    if (res) {
      setProductList(res);
    }
  };
  const shareLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 20 }
  };

  const getList = async () => {
    const res = await productChoiceList({});
    try {
      if (res) {
        let { productList } = res;
        if (productList && productList.length > 0) {
          productList = await Promise.all(
            productList.map(async (item: any) => {
              const authData = await queryMarketArea({
                itemId: item.productId,
                type: 2
              });
              item.authData = authData;
              return item;
            })
          );
        }
        const spliceIndex: number = productList.length;
        // 数组自动补全
        const __data = productList.concat(data.splice(spliceIndex, 4));
        setData(__data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 重新记录数组顺序
  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    // 删除并记录 删除元素
    const [removed] = result.splice(startIndex, 1);
    // 将原来的元素添加进数组
    result.splice(endIndex, 0, removed);
    return result;
  };

  useEffect(() => {
    getProducts();
    getList();
  }, []);

  // 拖拽结束
  const onDragEnd = (result: any) => {
    try {
      if (!result.destination) {
        return;
      }
      // 获取拖拽后的数据 重新赋值
      const newData = reorder(data, result.source.index, result.destination.index);
      setData(newData);
    } catch (err) {
      console.error(err);
    }
  };

  const beforeUpload = (file: any) => {
    const isJpg = file.type === 'image/jpeg';
    if (!isJpg) {
      message.error('仅支持上传.jpg格式图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片尺寸不可以超过 2MB!');
    }
    return isJpg && isLt2M;
  };

  // 上传图片
  const handleChange = async (value: any, index: number) => {
    // 创建一个空对象实例
    // 调用append()方法来添加数据

    setData((data) => {
      const copyData = [...data];
      copyData[index].loading = false;
      copyData[index].bannerImgUrl = value;
      return copyData;
    });
  };

  const onGenderChange = async (index: number, value: string) => {
    const copyData = [...data];

    copyData[index].productId = value;
    copyData[index].status = 2;
    // 获取文章的可见范围
    const res = await queryMarketArea({
      itemId: value,
      type: 2
    });
    copyData[index].authData = res;
    setData(copyData);
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const submitForm = async () => {
    let isright = true;
    data.forEach((item, index): any => {
      if (item.productId && !item.bannerImgUrl) {
        message.error(`请上传精选商品${indexFormat(index + 1)}的banner图片`);
        isright = false;
        return false;
      }
      if (item.status === 3) {
        isright = false;
        return message.error('存在下架的商品，请修改后再提交');
      }
    });
    if (!isright) return;
    const filterData = data.filter((item) => item.productId && item.bannerImgUrl);
    if (filterData.length === 0) {
      message.error('请至少添加一个精选商品');
      return false;
    }
    const postData = filterData.map((item, index) => {
      return {
        choiceId: item.choiceId || '',
        productId: item.productId,
        bannerImgUrl: item.bannerImgUrl,
        sortId: index
      };
    });
    setSubmitting(true);
    const res = await productChoiceEdit({ choiceList: postData });
    setSubmitting(false);
    if (res) {
      message.success('添加成功');
      history.goBack();
    }
  };

  return (
    <Card title="当月精选" bordered={false} className="edit">
      <Form form={form} name="share_other" {...shareLayout} onFinish={onFinish}>
        <DragDropContext onDragEnd={onDragEnd}>
          {/* direction代表拖拽方向  默认垂直方向  水平方向:horizontal */}
          <Droppable droppableId="droppable">
            {(provided: any) => (
              // 这里是拖拽容器 在这里设置容器的宽高等等...
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {/* 这里放置所需要拖拽的组件,必须要被 Draggable 包裹 */}
                {data.map((item, index) => {
                  return (
                    <Draggable index={index} draggableId={index + 'draggableId'} key={index}>
                      {(provided: any) => (
                        // 在这里写你的拖拽组件的样式 dom 等等...
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...getItemStyle(), ...provided.draggableProps.style }}
                        >
                          <div className="sectionTitle" style={{ marginTop: '60px' }}>
                            <span className="bold margin-right10">{`精选产品${indexFormat(index + 1)}`}</span>
                            <Tooltip
                              placement="topLeft"
                              title="按住鼠标左键可以上下拖动进行排序"
                              overlayInnerStyle={{ backgroundColor: '#fff', color: '#111', borderRadius: '8px' }}
                            >
                              <Button type="link" style={{ padding: 0 }}>
                                <Icon name="icon_common_16_question" className="text-primary font16"></Icon>
                              </Button>
                            </Tooltip>
                          </div>

                          <Row gutter={24}>
                            <Col className="gutter-row" span={24}>
                              <Form.Item
                                className={style.authWrap}
                                labelAlign="right"
                                required
                                label="产品名称："
                                validateStatus={
                                  (item.bannerImgUrl && !item.productId) || item.status === 3 ? 'error' : ''
                                }
                                help={
                                  item.bannerImgUrl && !item.productId
                                    ? '请选择产品'
                                    : item.status === 3
                                      ? '该产品已下架'
                                      : null
                                }
                              >
                                <Select
                                  placeholder="请选择"
                                  style={{ width: 400 }}
                                  value={item.productId}
                                  onChange={(value) => onGenderChange(index, value)}
                                  allowClear
                                  className="width320"
                                >
                                  {productList.map((item, index) => {
                                    return (
                                      <Option
                                        key={index}
                                        value={item.productId}
                                        disabled={
                                          data.filter((current) => current.productId === item.productId).length > 0
                                        }
                                      >
                                        {item.productName}
                                      </Option>
                                    );
                                  })}
                                </Select>
                                <AreaTips className={'customAreaTips'} value={item.authData} />
                              </Form.Item>
                              <Form.Item
                                label="banner图片："
                                required
                                validateStatus={!item.bannerImgUrl && item.productId ? 'error' : ''}
                                help={!item.bannerImgUrl && item.productId ? '请上传图片' : null}
                                rules={[{ required: true, message: '请上传banner图片：' }]}
                                extra="为确保最佳展示效果，请上传1136*276像素高清图片，仅支持.jpg格式"
                              >
                                <NgUpload
                                  value={item.bannerImgUrl}
                                  beforeUpload={beforeUpload}
                                  onChange={(value) => {
                                    handleChange(value, index);
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {/* 这个不能少 */}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div style={{ textAlign: 'center', width: 1000, marginTop: 32 }}>
          <Button
            loading={submitting}
            type="primary"
            shape="round"
            htmlType="submit"
            onClick={submitForm}
            size="large"
            style={{ width: 128 }}
          >
            保存
          </Button>
        </div>
      </Form>
    </Card>
  );
};
export default ProductFeatureConfig;
