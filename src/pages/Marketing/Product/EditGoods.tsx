import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Card, Form, Input, message, Button, Select, Space, Row, Col } from 'antd';
import { productEdit, productConfig, productDetail } from 'src/apis/marketing';
import NumberInput from 'src/components/NumberInput/NumberInput';
import { Context } from 'src/store';
import style from './style.module.less';
import classNames from 'classnames';
import NgUpload from '../Components/Upload/Upload';
interface productConfigProps {
  id: number;
  type: number;
  location: any;
  history: any;
}
const { Option } = Select;
const ProductConfig: React.FC<productConfigProps> = ({ location, history }) => {
  const { userInfo } = useContext(Context);
  const [form] = Form.useForm();

  const [premiumValue, setPremiumValue] = useState('0');
  const [shareInfo, setShareInfo] = useState({
    shareCoverImgUrl: '',
    shareTitle: '',
    productName: '',
    posterImgUrl: ''
  });
  interface Config {
    areaList: any[];
    objectList: any[];
    premiumTypeList: any[];
    tagList: any[];
    sceneList: any[];
    productTypeList: any[];
  }
  const [config, setConfig] = useState<Config>({
    areaList: [],
    objectList: [],
    premiumTypeList: [],
    tagList: [],
    sceneList: [],
    productTypeList: []
  });

  const [currency, setCurrency] = useState<string>('');
  const [propsState, setPropsState] = useState({
    id: '',
    type: '0'
  });

  useMemo(() => {
    const state = location.state || {};
    const { id = '', type = '0' } = state;
    setPropsState({ id, type });
  }, [location]);

  // 获取详情
  const getProductDetail = async () => {
    const res = await productDetail({ productId: propsState.id });
    if (res) {
      const {
        productName,
        corpProductId,
        categoryId,
        familyEnsureId,
        ensureTargetId,
        ensureSceneId,
        premiumTypeId,
        speechcraft,
        posterName,
        shareTitle,
        highlights,
        corpProductLink,
        shareCoverImgUrl,
        posterImgUrl,
        tags = ''
      } = res;

      setShareInfo({ productName, shareTitle, shareCoverImgUrl, posterImgUrl });
      const premium = (res.premium as number) / 100;
      setPremiumValue(premium + '');
      setCurrency(res.premiumTypeId);
      form.setFieldsValue({
        productName,
        corpProductId,
        corpProductLink,
        categoryId,
        familyEnsureId,
        ensureTargetId,
        ensureSceneId,
        premiumTypeId,
        speechcraft,
        posterName,
        shareTitle,
        highlights,
        posterImgUrl,
        shareCoverImgUrl,
        tags: tags?.split(',') || undefined
      });
    }
  };

  const onNumberChange = (value: string) => {
    setPremiumValue(value);
  };

  const onCurrencyChange = (newCurrency: any) => {
    setCurrency(newCurrency);
  };

  /** 海报图片 */
  const posterBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超出 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  /** 分享图片 */
  const shareCoverBeforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只可以上传 JPG/PNG 格式的图片!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不可以超过 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const onFinish = async (values: any) => {
    const {
      productName,
      corpProductId,
      corpProductLink,
      categoryId,
      familyEnsureId,
      ensureTargetId,
      ensureSceneId,
      speechcraft,
      posterName,
      highlights,
      shareTitle,
      posterImgUrl,
      shareCoverImgUrl,
      tags
    } = values;
    const editParams = {
      productId: propsState.id || null,
      productName,
      corpProductId,
      corpProductLink,
      categoryId,
      familyEnsureId,
      ensureTargetId,
      ensureSceneId,
      premium: +premiumValue * 100,
      premiumTypeId: currency,
      speechcraft,
      tags: tags.join(','),
      highlights: highlights && highlights.replace(/，/gi, ','),
      posterName,
      posterImgUrl,
      shareCoverImgUrl,
      shareTitle
    };
    const res = await productEdit(editParams);
    if (res) {
      message.success('编辑成功！');
      history.replace('/marketingProduct?pageNum=1');
    }
  };
  // 获取配置列表
  const getProductConfig = async () => {
    const res = await productConfig({ type: [1, 2, 3, 4, 5, 6] });
    if (res) {
      setConfig(res);
    }
  };
  const validatorLights = (value: string) => {
    if (!value) {
      return Promise.resolve();
    } else {
      const lightsValues = value.replace(/，/gi, ',');
      let lightsArr: string[] = [];
      lightsArr = lightsValues.split(',');

      if (lightsArr.length > 0) {
        let isMaxLengthError = false;
        lightsArr.forEach((light) => {
          if (light.length > 16) {
            isMaxLengthError = true;
          }
        });
        if (isMaxLengthError) {
          return Promise.reject(new Error('单个亮点字数最多为16个'));
        }
      }
      if (lightsArr.length > 10) {
        return Promise.reject(new Error('亮点最多为10条'));
      }
      return Promise.resolve();
    }
  };

  useEffect(() => {
    getProductConfig();
    propsState.id && getProductDetail();
  }, []);
  const validatorProductId = (_: any, value: string): any => {
    const reg = /^[^\u4e00-\u9fa5]+$/g;
    if (value && !reg.test(value)) {
      return Promise.reject(new Error('禁止输入汉字'));
    } else {
      return Promise.resolve();
    }
  };

  const handleInput: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const inputValue = e.target.value.replace(/，/gi, ',');
    form.setFields([{ name: 'highlights', value: inputValue }]);
  };
  const onFormValuesChange = (values: any) => {
    const { shareTitle, activityName, productName, shareCoverImgUrl } = values;
    setShareInfo((active) => ({ ...active, shareTitle, activityName, productName, shareCoverImgUrl }));
  };
  return (
    <Card title="新增产品" className="edit">
      <Form
        form={form}
        name="validate_other"
        onFinish={onFinish}
        scrollToFirstError
        onValuesChange={(changeValues, values) => onFormValuesChange(values)}
      >
        <Form.Item
          label="产品名称："
          name="productName"
          rules={[
            { required: true, message: '请输入产品名称' },
            { max: 40, message: '最多40个字符，不区分中英文' }
          ]}
        >
          <Input maxLength={50} className="width320" placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="产品ID："
          name="corpProductId"
          rules={[
            { validator: validatorProductId },
            {
              pattern: /^[^\s]*$/,
              message: '禁止输入空格'
            }
          ]}
        >
          <Input placeholder="请输入产品ID" className="width320" maxLength={40} />
        </Form.Item>
        <Form.Item
          label="产品链接："
          name="corpProductLink"
          rules={[
            { required: true, message: '请输入产品链接' },
            { type: 'url', message: '请输入正确的链接' }
          ]}
        >
          <Input className="width320" placeholder="待添加" />
        </Form.Item>
        <Form.Item name="categoryId" label="产品分类：" rules={[{ required: true, message: '请选择产品分类' }]}>
          <Select placeholder="请选择" allowClear className="width320">
            {config.productTypeList.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          className={style.selectTagWrap}
          name="tags"
          label="产品标签："
          rules={[{ type: 'array', required: true, message: '请选择产品标签' }]}
        >
          <Select placeholder="请选择" allowClear className={classNames('width320')} mode="tags">
            {config.tagList?.map((item, index) => {
              return (
                <Option key={index} value={item.name}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="familyEnsureId" label="家庭保障：">
          <Select placeholder="请选择" allowClear className="width320">
            {config?.areaList.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="ensureSceneId" label="保障场景：">
          <Select placeholder="请选择" allowClear className="width320">
            {config.sceneList.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="ensureTargetId" label="保障对象：">
          <Select placeholder="请选择" allowClear className="width320">
            {config?.objectList.map((item, index) => {
              return (
                <Option key={index} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="premium" label="保费金额：">
          <Space direction="horizontal">
            <NumberInput value={premiumValue} onChange={onNumberChange} />
            {/* <Input type="text" onChange={onNumberChange} value={premiumValue} style={{ width: 100 }} /> */}
            元起
            <Select style={{ width: 80, margin: '0 8px' }} value={currency} onChange={onCurrencyChange}>
              {config.premiumTypeList.map((item, index) => {
                return (
                  <Option key={index} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Space>
        </Form.Item>
        <Form.Item
          className="lights_wrap"
          label="产品亮点："
          name="highlights"
          required
          rules={[
            { required: true, message: '请输入产品亮点' },
            {
              validator: (_, value) => {
                return validatorLights(value);
              }
            }
          ]}
          extra="限10条，且每条亮点字数不超过16个字,各亮点以逗号隔开"
        >
          <Input.TextArea
            placeholder="请输入亮点"
            autoSize={{ minRows: 4 }}
            onInput={handleInput}
            className="width400"
          />
        </Form.Item>
        <Form.Item name="speechcraft" label="营销话术：" rules={[{ required: true, message: '请输入营销话术' }]}>
          <Input.TextArea
            maxLength={300}
            showCount
            placeholder="请输入营销话术"
            autoSize={{ minRows: 4 }}
            className="width400"
          />
        </Form.Item>
        {/* </Form> */}

        <div className="sectionTitle" style={{ marginTop: '60px' }}>
          <span className="bold margin-right20">分享设置</span>
          <span className="color-text-regular">说明：如无配置，则该模块不展示</span>
        </div>
        <Form.Item
          label="海报："
          name="posterImgUrl"
          extra="为确保最佳展示效果，请上传750*1334像素高清图片，仅支持.jpg格式"
        >
          <NgUpload beforeUpload={posterBeforeUpload} />
        </Form.Item>
        <Form.Item
          label="海报名称："
          labelAlign="right"
          name="posterName"
          rules={[{ max: 20, message: '最多20位字符' }]}
        >
          <Input className="width320" maxLength={30} placeholder="待添加" />
        </Form.Item>
        <div className="sectionTitle" style={{ marginTop: '60px' }}>
          <span className="bold margin-right20">分享设置</span>
        </div>
        <Row>
          <Col span="12">
            <Form.Item
              label="分享封面图："
              name="shareCoverImgUrl"
              rules={[{ required: true, message: '请上传分享封面图' }]}
              extra="为确保最佳展示效果，请上传132*132像素高清图片，仅支持.jpg格式"
            >
              <NgUpload beforeUpload={shareCoverBeforeUpload} />
            </Form.Item>
            <Form.Item
              label="小标题："
              labelAlign="right"
              name="shareTitle"
              rules={[
                { required: true, message: '请输入小标题' },
                { max: 32, message: '最多32位字符' }
              ]}
            >
              <Input className="width320" placeholder="请输入" maxLength={40} />
            </Form.Item>
          </Col>
          <Col span="12">
            <div className="sharePreviewWrap">
              <h3 className="margin-bottom20 font14 bold">分享给客户样例展示</h3>
              <div className="userImg">
                <img src={userInfo.avatar} alt="" />
              </div>
              <div className="shareWrap">
                <div style={{ overflow: 'hidden' }}>
                  <div className="shareInfo">
                    <h3 className="ellipsis font14 bold">{shareInfo.productName}</h3>
                    <div className="two-line-ellipsis font12 color-text-regular" style={{ marginTop: '5px' }}>
                      {shareInfo.shareTitle}
                    </div>
                  </div>
                  <div className="shareImg">
                    <img src={shareInfo.shareCoverImgUrl} alt="" />
                  </div>
                </div>
                <p className="shareTag">企业微信</p>
              </div>
            </div>
          </Col>
        </Row>

        {propsState.type !== '1' && (
          <div style={{ textAlign: 'center', width: 1000, marginTop: 32 }}>
            <Button type="primary" shape="round" htmlType="submit" size="large" style={{ width: 128 }}>
              保存
            </Button>
          </div>
        )}
      </Form>
    </Card>
  );
};
export default React.memo(ProductConfig);
