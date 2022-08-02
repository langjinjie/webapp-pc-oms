import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Input, message, Button, Select, Space, Row, Col, Radio } from 'antd';
import { productEdit, productConfig, productDetail } from 'src/apis/marketing';
import NumberInput from 'src/components/NumberInput/NumberInput';
import { Context } from 'src/store';
import style from './style.module.less';
import classNames from 'classnames';
import NgUpload from '../Components/Upload/Upload';
import { WechatShare } from '../Components/WechatShare/WechatShare';
import { UploadFile } from 'src/components';
import { getQueryParam } from 'tenacity-tools';
import { SetUserRightFormItem } from '../Components/SetUserRight/SetUserRight';

interface productConfigProps {
  id: number;
  type: number;
  location: any;
  history: any;
}

interface Config {
  areaList: any[];
  objectList: any[];
  premiumTypeList: any[];
  tagList: any[];
  sceneList: any[];
  productTypeList: any[];
}

const { Option } = Select;
const { Group } = Radio;

const ProductConfig: React.FC<productConfigProps> = ({ location, history }) => {
  const { userInfo } = useContext(Context);
  const [form] = Form.useForm();
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [premiumValue, setPremiumValue] = useState('0');

  const [shareInfo, setShareInfo] = useState({
    shareCoverImgUrl: '',
    shareTitle: '',
    productName: '',
    posterImgUrl: '',
    specType: 0,
    whetherAssociated: 1 // 是否被推荐 0 已推荐，1 未推荐
  });

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
  const [displayType, setDisplayType] = useState<number>(1);
  const [oldSourceUrlParam, setOldSourceUrlParam] = useState({ displayType: 0, sourceUrl: '' });
  const [oldUrlParam, setOldUrlParam] = useState({ displayType: 0, url: '' });

  // 获取详情
  const getProductDetail = async (id: string) => {
    const res = await productDetail({ productId: id });
    if (res) {
      const {
        productName,
        productId,
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
        tags = '',
        displayType,
        username,
        path,
        sourceUrl,
        recommendImgUrl,
        whetherAssociated,
        specType,
        groupId
      } = res;

      setShareInfo({ productName, shareTitle, shareCoverImgUrl, posterImgUrl, whetherAssociated, specType });
      const premium = (res.premium as number) / 100;
      setPremiumValue(premium + '');
      setCurrency(res.premiumTypeId);
      setDisplayType(displayType);

      form.setFieldsValue({
        productName,
        groupId,
        productId,
        specType,
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
        tags: tags?.split(',') || undefined,
        displayType,
        username,
        path,
        sourceUrl,
        recommendImgUrl
      });
    }
  };

  const onNumberChange = (value: string) => {
    setPremiumValue(value);
  };

  const onCurrencyChange = (newCurrency: any) => {
    setCurrency(newCurrency);
  };

  // 配置类型列表
  const displayTypeList = [
    { value: 1, label: '添加链接' },
    { value: 2, label: '小程序ID' },
    { value: 3, label: '上传图片' },
    { value: 4, label: '上传视频' }
  ];

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
  const beforeUploadImgHandle = (file: File): Promise<boolean> | boolean => {
    const isJpg = file.type === 'image/jpeg';
    if (!isJpg) {
      message.error('只能上传 JPG 格式的图片!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) message.error('图片大小不能超过5MB!');
    // 获取图片的真实尺寸
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
          if (!(width === 750)) {
            message.error('请上传正确的图片尺寸');
          }
          resolve(width === 750 && isJpg && isLt5M);
        };
      };
      reader.readAsDataURL(file);
    });
  };
  const beforeUploadMp4 = (file: any) => {
    const isMp4 = file.type === 'video/mp4';
    if (!isMp4) {
      message.error('你只可以上传 MP4 格式视频!');
    }
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.error('视频大小不能超过 100MB!');
    }
    return isMp4 && isLt100M;
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

  const onFinish = async (values: any) => {
    const { highlights, tags, groupId, ...otherValues } = values;

    delete otherValues.group1;
    delete otherValues.group2;
    delete otherValues.groupType;
    delete otherValues.isSet;
    const editParams = {
      ...otherValues,
      productId: isCopy ? null : propsState.id || null,
      premium: +premiumValue * 100,
      premiumTypeId: currency,
      tags: tags.join(','),
      groupId: groupId || '',
      highlights: highlights && highlights.replace(/，/gi, ',')
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
    const state = location.state || {};
    const { id = '', type = '0' } = state;
    setPropsState({ id, type });
    getProductConfig();
    id && getProductDetail(id);
    const isView = getQueryParam('isView');
    const isCopy = getQueryParam('isCopy');

    if (isView) {
      setIsReadOnly(isView === 'true');
    }
    if (isCopy) {
      setIsCopy(isCopy === 'true');
    }
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
    const { shareTitle, activityName, productName, shareCoverImgUrl, specType } = values;
    setShareInfo((active) => ({ ...active, shareTitle, activityName, productName, shareCoverImgUrl, specType }));
  };
  const onChangeDisplayType = (e: any) => {
    if (e.target.value === 1) {
      form.setFieldsValue({ ...form.getFieldsValue(), corpProductLink: oldUrlParam.url });
    }
    if (displayType === 1) {
      setOldUrlParam({ displayType, url: form.getFieldsValue().corpProductLink });
    }
    // 3,4 来回切换
    if ([3, 4].includes(displayType) && [3, 4].includes(e.target.value)) {
      // 将现在的sourceUrl保存起来,异步，不会立即生效
      setOldSourceUrlParam({ displayType, sourceUrl: form.getFieldsValue().sourceUrl });
      // 将上次保存的oldSourceUrlParam赋值
      if (oldSourceUrlParam.displayType === e.target.value) {
        form.setFieldsValue({ ...form.getFieldsValue(), sourceUrl: oldSourceUrlParam.sourceUrl });
      } else {
        form.setFieldsValue({ ...form.getFieldsValue(), sourceUrl: '' });
      }
    }
    // 从非3，4进入3，4
    if ([3, 4].includes(e.target.value) && ![3, 4].includes(displayType)) {
      if (oldSourceUrlParam.displayType !== e.target.value) {
        form.setFieldsValue({ ...form.getFieldsValue(), sourceUrl: '' });
      } else {
        form.setFieldsValue({ ...form.getFieldsValue(), sourceUrl: oldSourceUrlParam.sourceUrl });
      }
    }
    // 从3，4切换到外面
    if ([3, 4].includes(displayType) && ![3, 4].includes(e.target.value)) {
      if (form.getFieldsValue().sourceUrl) {
        setOldSourceUrlParam({ displayType, sourceUrl: form.getFieldsValue().sourceUrl });
      }
    }
    setDisplayType(e.target.value);
  };
  return (
    <Card title="新增产品" className="edit">
      <Form
        form={form}
        name="validate_other"
        onFinish={onFinish}
        scrollToFirstError
        onValuesChange={(_, values) => {
          onFormValuesChange(values);
        }}
      >
        <Form.Item
          label="产品名称："
          name="productName"
          rules={[
            { required: true, message: '请输入产品名称' },
            { max: 40, message: '最多40个字符，不区分中英文' }
          ]}
        >
          <Input maxLength={50} className="width320" placeholder="请输入" readOnly={isReadOnly} />
        </Form.Item>
        <Form.Item
          label="产品ID："
          name="productId"
          rules={[
            { validator: validatorProductId },
            {
              pattern: /^[^\s]*$/,
              message: '禁止输入空格'
            }
          ]}
        >
          <Input placeholder="请输入产品ID" className="width320" maxLength={40} readOnly={isReadOnly} />
        </Form.Item>
        <Form.Item label="产品类型" name="specType" initialValue={0}>
          <Group>
            <Radio value={0}>通用产品</Radio>
            <Radio value={1}>分坐席个性化产品</Radio>
          </Group>
        </Form.Item>
        <Form.Item label="配置类型" name="displayType" required initialValue={1}>
          <Group onChange={onChangeDisplayType} disabled={isReadOnly}>
            {displayTypeList.map((item) => (
              <Radio key={item.value + item.label} value={item.value}>
                {item.label}
              </Radio>
            ))}
          </Group>
        </Form.Item>
        {displayType === 1 && (
          <Form.Item
            label={shareInfo.specType === 1 ? '个性化产品缺省链接' : '通用产品链接'}
            name="corpProductLink"
            rules={[
              { required: true, message: '请输入产品链接' },
              { type: 'url', message: '请输入正确的链接' }
            ]}
          >
            <Input className="width320" placeholder="待添加" readOnly={isReadOnly} />
          </Form.Item>
        )}
        {displayType === 2 && (
          <>
            <Form.Item label="小程序ID" name="username" rules={[{ required: true, message: '请输入小程序ID' }]}>
              <Input className="width320" placeholder="待添加" readOnly={isReadOnly} />
            </Form.Item>
            <Form.Item label="页面路径" name="path">
              <Input className="width320" placeholder="待输入，不填默认跳转小程序首页" />
            </Form.Item>
          </>
        )}
        {displayType === 3 && (
          <>
            <Form.Item
              label="图片文件"
              name="sourceUrl"
              rules={[{ required: true, message: '请上传图片' }]}
              extra="为确保最佳展示效果，请上传宽度为750像素高清图片，仅支持.jpg格式"
            >
              <NgUpload beforeUpload={beforeUploadImgHandle} />
            </Form.Item>
          </>
        )}
        {displayType === 4 && (
          <>
            <Form.Item
              label="视频文件"
              name="sourceUrl"
              rules={[{ required: true, message: '请上传视频' }]}
              extra="仅支持.mp4格式, 最大100MB"
            >
              <UploadFile bizKey="media" beforeUpload={beforeUploadMp4} />
            </Form.Item>
          </>
        )}
        <Form.Item name="categoryId" label="产品分类：" rules={[{ required: true, message: '请选择产品分类' }]}>
          <Select placeholder="请选择" allowClear className="width320" disabled={isReadOnly}>
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
          <Select placeholder="请选择" allowClear className={classNames('width320')} mode="tags" disabled={isReadOnly}>
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
          <Select placeholder="请选择" allowClear className="width320" disabled={isReadOnly}>
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
          <Select placeholder="请选择" allowClear className="width320" disabled={isReadOnly}>
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
          <Select placeholder="请选择" allowClear className="width320" disabled={isReadOnly}>
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
            <NumberInput value={premiumValue} onChange={onNumberChange} readOnly={isReadOnly} />
            {/* <Input type="text" onChange={onNumberChange} value={premiumValue} style={{ width: 100 }} /> */}
            元起
            <Select
              style={{ width: 80, margin: '0 8px' }}
              value={currency}
              onChange={onCurrencyChange}
              disabled={isReadOnly}
            >
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
            readOnly={isReadOnly}
          />
        </Form.Item>
        <Form.Item name="speechcraft" label="营销话术：" rules={[{ required: true, message: '请输入营销话术' }]}>
          <Input.TextArea
            maxLength={300}
            showCount
            placeholder="请输入营销话术"
            autoSize={{ minRows: 4 }}
            className="width400"
            readOnly={isReadOnly}
          />
        </Form.Item>

        <Form.Item label="可见范围设置" name={'groupId'}>
          <SetUserRightFormItem form={form} />
        </Form.Item>
        {/* </Form> */}

        <div className="sectionTitle" style={{ marginTop: '60px' }}>
          <span className="bold margin-right20">文章推荐设置</span>
          <span className="color-text-secondary">说明：如无配置，则无法在文章末尾配置推荐产品</span>
        </div>
        <Form.Item
          label="推荐展示图片"
          name="recommendImgUrl"
          rules={[{ message: '请上传推荐图片' }]}
          extra="限制上传JPG格式，图片大小690*200，产品上架后推荐图不能更改"
        >
          <NgUpload beforeUpload={recommendPicBeforeUpload} showDeleteBtn={shareInfo.whetherAssociated !== 0} />
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
              <Input className="width320" placeholder="请输入" maxLength={40} readOnly={isReadOnly} />
            </Form.Item>
          </Col>
          <Col span="12">
            <div className="sharePreviewWrap">
              <h3 className="margin-bottom20 font14 bold">分享给客户样例展示</h3>
              <WechatShare
                avatar={userInfo.avatar}
                desc={shareInfo.shareTitle}
                shareCoverImgUrl={shareInfo.shareCoverImgUrl}
                title={shareInfo.productName}
              />
            </div>
          </Col>
        </Row>

        <div className="sectionTitle" style={{ marginTop: '60px' }}>
          <span className="bold margin-right20">产品海报设置</span>
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
          <Input className="width320" maxLength={30} placeholder="待添加" readOnly={isReadOnly} />
        </Form.Item>

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
