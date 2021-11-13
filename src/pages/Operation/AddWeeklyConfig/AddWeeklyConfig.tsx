/**
 * @name AddWeeklyConfig
 * @author Lester
 * @date 2021-11-06 13:49
 */
import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Button, Form, FormProps, Input, Select, DatePicker, Radio, message } from 'antd';
import { getQueryParam } from 'lester-tools';
import moment from 'moment';
import { Icon, Modal, ImageUpload } from 'src/components';
import { queryActivityList, queryArticleList, queryProductList } from 'src/apis/marketing';
import { queryColors, queryWeeklyDetail, saveConfig, queryUserList, publishConfig } from 'src/apis/weekly';
import { DataItem } from 'src/utils/interface';
import style from './style.module.less';

interface ColorItem {
  colorCode: string;
  colorName: string;
}

interface UserItem {
  userId: string;
  name: string;
}

interface Article {
  id: string;
  name: string;
  newsId: string;
  articleId: string;
  title: string;
  status: number;
  syncBank?: number;
}

interface Activity {
  id: string;
  name: string;
  activityId: string;
  activityName: string;
  status: number;
}

interface Product {
  id: string;
  name: string;
  productId: string;
  productName: string;
  status: number;
}

const { Item, List, useForm } = Form;
const { Option } = Select;
const { TextArea } = Input;
const { Group } = Radio;

const AddWeeklyConfig: React.FC<RouteComponentProps> = ({ history }) => {
  const [editField, setEditField] = useState<string>('');
  const [editFieldValue, setEditFieldValues] = useState<any>({});
  const [categoryMessage, setCategoryMessage] = useState<any>({});
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [receiver, setReceiver] = useState<string[]>([]);
  const [userVisible, setUserVisible] = useState<boolean>(false);
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [materialList, setMaterialList] = useState<any>({});
  const [choosedMaterial, setChoosedMaterial] = useState<any>({});
  const [paperId, setPaperId] = useState<string>('');

  const matetailMapRef: MutableRefObject<any> = useRef({});

  const [form] = useForm();
  const type: string = getQueryParam('type');

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 8 }
  };

  const chineseNumbers = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  const materialTypes: DataItem[] = [
    {
      id: '3',
      name: '文章'
    },
    {
      id: '2',
      name: '产品'
    },
    {
      id: '1',
      name: '活动'
    }
  ];

  const getColors = async () => {
    const res: any = await queryColors();
    if (res) {
      setColors(res.colorList || []);
    }
  };

  const getArticleList = async () => {
    const res: any = await queryArticleList({ pageSize: 2000, syncBank: 1 });
    if (res) {
      setArticleList(
        (res.newsList || []).map((item: Article) => ({
          ...item,
          id: item.newsId,
          name: item.title
        }))
      );
    }
  };

  const getProductList = async () => {
    const res: any = await queryProductList({ pageSize: 1000, status: 2 });
    if (res) {
      setProductList(
        (res.list || []).map((item: Product) => ({
          ...item,
          id: item.productId,
          name: item.productName
        }))
      );
    }
  };

  const getActivityList = async () => {
    const res: any = await queryActivityList({ pageSize: 1000, status: 2 });
    if (res) {
      setActivityList(
        (res.list || []).map((item: Activity) => ({
          ...item,
          id: item.activityId,
          name: item.activityName
        }))
      );
    }
  };

  const getUserList = async () => {
    const res: any = await queryUserList();
    if (res) {
      setUserList(res.oprationList || []);
    }
  };

  const publishWeeklyConfig = async () => {
    const res: any = await publishConfig({ paperId, sendType: 2, userIds: receiver });
    if (res) {
      message.success('推送成功，可在企业微信消息里查看！');
    }
  };

  const getMaterialData = (type: string) => {
    if (type === 'activity') {
      return activityList;
    } else if (type === 'product') {
      return productList;
    } else {
      return articleList;
    }
  };

  const getMaterialMap = (index: number, value: number) => {
    if (value === 1) {
      matetailMapRef.current = {
        ...matetailMapRef.current,
        [index]: 'activity'
      };
    } else if (value === 2) {
      matetailMapRef.current = {
        ...matetailMapRef.current,
        [index]: 'product'
      };
    } else {
      matetailMapRef.current = {
        ...matetailMapRef.current,
        [index]: 'article'
      };
    }
    setMaterialList(matetailMapRef.current);
  };

  /**
   * 获取周报详情
   */
  const getWeeklyDetail = async (weeklyId: string) => {
    if (weeklyId) {
      const res = await queryWeeklyDetail({ paperId: weeklyId });
      if (res && res.paperInfo) {
        const { sendTime, expressName, marketCateList, status, ...otherInfo } = res.paperInfo;
        status === 1 && setPaperId(weeklyId);
        form.setFieldsValue({
          ...otherInfo,
          expressName,
          startTime: sendTime ? moment(sendTime) : undefined,
          marketCateList: marketCateList.map((marketCate: any) => ({
            ...marketCate,
            marketContentList: marketCate.marketContentList.map((market: any) => ({
              ...market,
              marketId: market.status === 3 ? undefined : market.marketId
            }))
          }))
        });
        const cateNames: any = {};
        const marketMsg: any = {};
        const chooseMaterial: any = {};
        (marketCateList || []).forEach((item: any, index: number) => {
          cateNames[`cateName${index}`] = item.cateName;
          getMaterialMap(index, item.cateType);
          chooseMaterial[index] = item.marketContentList.map((item: any) => item.marketId).filter(Boolean);
          const marketMessages: string[] = [];
          item.marketContentList.forEach((market: any) => {
            if (market.status === 3) {
              marketMessages.push(`${market.marketTitle || market.marketId}已过期，请重新选择`);
            } else {
              marketMessages.push('搜索对应素材标题在下拉框进行选择');
            }
          });
          marketMsg[index] = marketMessages;
        });
        setCategoryMessage(marketMsg);
        setEditFieldValues({
          expressName,
          ...cateNames
        });
        setChoosedMaterial(chooseMaterial);
      }
      form.validateFields();
    } else {
      form.setFieldsValue({
        expressName: '本周快讯',
        expressList: [{}, {}, {}, {}, {}, {}],
        marketCateList: [
          {
            cateName: '热点速递',
            marketContentList: [{}, {}]
          }
        ]
      });
      setEditFieldValues({
        expressName: '本周快讯',
        cateName0: '热点速递'
      });
    }
  };

  const onSubmit = async (values: any) => {
    const { startTime, ...otherValue } = values;
    const params = { ...otherValue };
    if (startTime) {
      params.startTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
    }
    if (paperId) {
      params.paperId = paperId;
    }
    console.log(params);
    const res: any = await saveConfig(params);
    if (res) {
      message.success('保存成功！');
      setPaperId(res);
    }
  };

  /**
   * 编辑字段处理
   * @param filed
   * @param type 0-编辑 1-取消编辑
   */
  const editVisibleHandle = (filed: string, type: number) => setEditField(type === 0 ? filed : '');

  /**
   * 资讯分类名称编辑
   * @param filed
   * @param index
   */
  const editHandle = (filed: string, index = 0) => {
    let value = '';
    let filedName = filed;
    if (filed === 'cateName') {
      filedName = `cateName${index}`;
      value = (form.getFieldValue('marketCateList')[index] || {}).cateName;
    } else {
      value = form.getFieldValue(filed);
    }
    if (value) {
      editVisibleHandle(filedName, 1);
      setEditFieldValues({
        ...editFieldValue,
        [filedName]: value
      });
    }
  };

  const isEdit = (filed: string) => editField === filed;

  useEffect(() => {
    const paperId: string = getQueryParam('paperId');
    getWeeklyDetail(paperId);
    getColors();
    getArticleList();
    getProductList();
    getActivityList();
    getUserList();
  }, []);

  return (
    <Card title="新增周报配置">
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Item name="paperTitle" label="周报标题">
          <Input disabled={+type === 1} placeholder="如不填则采用机构名称+为您精选" maxLength={32} allowClear />
        </Item>
        <Item name="shareTitle" label="分享副标题">
          <Input disabled={+type === 1} placeholder="如无则默认为“查看更多，100个字符以内" maxLength={100} allowClear />
        </Item>
        <Item
          name="paperUrl"
          label="分享主图"
          rules={[{ required: true, message: '请上传图片' }]}
          extra="为确保最佳展示效果，请上传154*154像素高清图片，仅支持.jpg和.png格式"
        >
          <ImageUpload disabled={+type === 1} />
        </Item>
        <Item name="startTime" label="推送时间">
          <DatePicker
            disabled={+type === 1}
            disabledDate={(date) => date.valueOf() < moment().startOf('day').valueOf()}
            showTime
            placeholder="请选择推送时间"
            allowClear
          />
        </Item>
        <section className={style.sectionWrap}>
          <div className={style.titleWrap}>
            <Item
              style={{ display: isEdit('expressName') ? 'block' : 'none' }}
              name="expressName"
              rules={[{ required: true, message: '请输入' }]}
            >
              <Input
                placeholder="请输入"
                maxLength={12}
                allowClear
                onKeyDown={({ keyCode }) => keyCode === 13 && editHandle('expressName')}
                onBlur={() => editHandle('expressName')}
              />
            </Item>
            <div style={{ display: !isEdit('expressName') ? 'inline-flex' : 'none' }}>
              <strong>{editFieldValue.expressName}</strong>
              {+type === 0 && (
                <div className={style.editBtn} onClick={() => editVisibleHandle('expressName', 0)}>
                  <Icon name="bianji" />
                  编辑
                </div>
              )}
            </div>
          </div>
          <Item hidden name="expressId">
            <Input />
          </Item>
          <List name="expressList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Item key={field.key} className={style.formItemWrap} wrapperCol={{ span: 10 }}>
                    <Item
                      noStyle
                      shouldUpdate={(prevValues, curValues) => prevValues.expressList !== curValues.expressList}
                    >
                      <Item hidden name={[field.name, 'repcontentId']}>
                        <Input />
                      </Item>
                      <Item
                        {...field}
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label={`新闻${chineseNumbers[index]}`}
                        name={[field.name, 'title']}
                        fieldKey={[field.fieldKey, 'title']}
                        rules={[{ required: true, message: '请输入' }]}
                        className={style.listFormItem}
                      >
                        <TextArea
                          disabled={+type === 1}
                          placeholder="请输入"
                          showCount
                          maxLength={100}
                          autoSize={{ minRows: 3, maxRows: 4 }}
                        />
                      </Item>
                    </Item>
                    <Item
                      {...field}
                      labelCol={{ span: 7 }}
                      wrapperCol={{ span: 15 }}
                      label={`解读${chineseNumbers[index]}`}
                      name={[field.name, 'content']}
                      fieldKey={[field.fieldKey, 'content']}
                      rules={[{ required: true, message: '请输入' }]}
                      className={style.listFormItem}
                    >
                      <TextArea
                        disabled={+type === 1}
                        placeholder="请输入"
                        showCount
                        maxLength={200}
                        autoSize={{ minRows: 4, maxRows: 6 }}
                      />
                    </Item>
                    {+type === 0 && index > 5 && (
                      <Icon
                        className={style.deleteIcon}
                        name="cangpeitubiao_shanchu"
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </Item>
                ))}
                {+type === 0 && (
                  <Item wrapperCol={{ offset: 3 }}>
                    <Button
                      className={style.addBtn}
                      onClick={() => {
                        const value = form.getFieldValue('expressList');
                        if (value && value.length >= 10) {
                          message.warn('最多可配置10个快讯！');
                        } else {
                          add();
                        }
                      }}
                    >
                      <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
                      新建
                    </Button>
                  </Item>
                )}
              </>
            )}
          </List>
          <List name="marketCateList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <section key={field.key} className={style.sectionWrap}>
                    <Item className={style.formItemWrap} wrapperCol={{ span: 24 }}>
                      <Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) => prevValues.marketCateList !== curValues.marketCateList}
                      >
                        <Item hidden name={[field.name, 'cateId']}>
                          <Input />
                        </Item>
                        <div className={style.titleWrap}>
                          <Item
                            style={{ display: isEdit(`cateName${index}`) ? 'block' : 'none' }}
                            {...field}
                            name={[field.name, 'cateName']}
                            fieldKey={[field.fieldKey, 'cateName']}
                            rules={[{ required: true, message: '请输入' }]}
                            initialValue={`分类名称${chineseNumbers[index]}`}
                          >
                            <Input
                              placeholder="请输入"
                              maxLength={12}
                              allowClear
                              onKeyDown={({ keyCode }) => keyCode === 13 && editHandle('cateName', index)}
                              onBlur={() => editHandle('cateName', index)}
                            />
                          </Item>
                          <div style={{ display: !isEdit(`cateName${index}`) ? 'inline-flex' : 'none' }}>
                            <strong>{editFieldValue[`cateName${index}`] || `分类名称${chineseNumbers[index]}`}</strong>
                            {+type === 0 && (
                              <div className={style.editBtn} onClick={() => editVisibleHandle(`cateName${index}`, 0)}>
                                <Icon className={style.editIcon} name="bianji" />
                                编辑
                              </div>
                            )}
                          </div>
                          {+type === 0 && (
                            <>
                              {index === 0 && (
                                <div
                                  className={style.editBtn}
                                  onClick={() => {
                                    setEditField('');
                                    const value = form.getFieldValue('marketCateList');
                                    if (value && value.length >= 6) {
                                      message.warn('最多可配置6个分类！');
                                    } else {
                                      add({
                                        marketContentList: [{}, {}]
                                      });
                                    }
                                  }}
                                >
                                  <Icon className={style.editIcon} name="icon_daohang_28_jiahaoyou" />
                                  创建
                                </div>
                              )}
                              {index > 0 && (
                                <div
                                  className={style.editBtn}
                                  onClick={() => {
                                    const newValue: any = {};
                                    const marketCateListValues = form.getFieldValue('marketCateList');
                                    for (let i = index + 1; i < marketCateListValues.length; i++) {
                                      newValue[`cateName${i - 1}`] = `分类名称${chineseNumbers[i]}`;
                                    }
                                    Object.entries(editFieldValue).forEach(([key, val]) => {
                                      const keyRes = key.match(/(?<=cateName)\d+/);
                                      if (keyRes && +keyRes[0] >= index) {
                                        if (+keyRes[0] > index) {
                                          newValue[`cateName${+keyRes[0] - 1}`] = val;
                                        }
                                      } else {
                                        newValue[key] = val;
                                      }
                                    });
                                    setEditFieldValues(newValue);
                                    remove(field.name);
                                  }}
                                >
                                  <Icon className={style.editIcon} name="cangpeitubiao_shanchu" />
                                  删除
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <Item
                          style={{ marginTop: 15 }}
                          name={[field.name, 'colorCode']}
                          label="标题颜色"
                          labelCol={{ span: 3 }}
                          wrapperCol={{ span: 6 }}
                          rules={[{ required: true, message: '请选择' }]}
                        >
                          <Select disabled={+type === 1} placeholder="请选择颜色">
                            {colors.map((item) => (
                              <Option key={item.colorCode} value={item.colorCode}>
                                <div className={style.colorItem}>
                                  <span>{item.colorName}</span>
                                  <span
                                    className={style.colorArea}
                                    style={{
                                      background: `linear-gradient(135deg, ${item.colorCode.split(',')[0]} 0%,  ${
                                        item.colorCode.split(',')[1]
                                      } 100%)`
                                    }}
                                  />
                                </div>
                              </Option>
                            ))}
                          </Select>
                        </Item>
                        <Item
                          {...field}
                          name={[field.name, 'cateType']}
                          fieldKey={[field.fieldKey, 'cateType']}
                          rules={[{ required: true, message: '请选择' }]}
                          wrapperCol={{ offset: 3 }}
                          initialValue={3}
                        >
                          <Group
                            disabled={+type === 1}
                            onChange={(e) => {
                              getMaterialMap(index, e.target.value);
                              const marketCateListValues = form.getFieldValue('marketCateList');
                              form.setFieldsValue({
                                marketCateList: marketCateListValues.map((marketItem: any, marketIndex: number) => ({
                                  ...marketItem,
                                  marketContentList:
                                    marketIndex === index
                                      ? marketItem.marketContentList.map(() => ({}))
                                      : marketItem.marketContentList
                                }))
                              });
                              setChoosedMaterial({
                                ...choosedMaterial,
                                [index]: []
                              });
                            }}
                          >
                            {materialTypes.map((item) => (
                              <Radio key={item.id} value={+item.id}>
                                {item.name}
                              </Radio>
                            ))}
                          </Group>
                        </Item>
                        <List name={[field.name, 'marketContentList']}>
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((field, materialIndex) => (
                                <Item key={field.key} className={style.formItemWrap} wrapperCol={{ span: 10 }}>
                                  <Item
                                    noStyle
                                    shouldUpdate={(prevValues, curValues) =>
                                      prevValues.marketContentList !== curValues.marketContentList
                                    }
                                  >
                                    <Item hidden name={[field.name, 'repcontentId']}>
                                      <Input />
                                    </Item>
                                    <Item
                                      {...field}
                                      labelCol={{ span: 7 }}
                                      wrapperCol={{ span: 15 }}
                                      label={`素材${chineseNumbers[materialIndex]}`}
                                      name={[field.name, 'marketId']}
                                      fieldKey={[field.fieldKey, 'marketId']}
                                      rules={[
                                        {
                                          required: true,
                                          message: (categoryMessage[index] || [])[materialIndex] || '请选择'
                                        }
                                      ]}
                                      className={style.listFormItem}
                                    >
                                      <Select
                                        disabled={+type === 1}
                                        placeholder={
                                          (categoryMessage[index] || [])[materialIndex] ||
                                          '搜索对应素材标题在下拉框进行选择'
                                        }
                                        allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={() => {
                                          const value =
                                            form.getFieldValue('marketCateList')[index]?.marketContentList || [];
                                          setChoosedMaterial({
                                            ...choosedMaterial,
                                            [index]: value.map((item: any) => item && item.marketId).filter(Boolean)
                                          });
                                        }}
                                      >
                                        {getMaterialData(materialList[index] || 'article').map(
                                          (item: Activity | Product | Article) => (
                                            <Option
                                              key={item.id}
                                              value={item.id}
                                              disabled={(choosedMaterial[index] || []).includes(item.id)}
                                            >
                                              {item.name}
                                            </Option>
                                          )
                                        )}
                                      </Select>
                                    </Item>
                                  </Item>
                                  {+type === 0 && materialIndex > 1 && (
                                    <Icon
                                      className={style.deleteIcon}
                                      name="cangpeitubiao_shanchu"
                                      onClick={() => remove(field.name)}
                                    />
                                  )}
                                </Item>
                              ))}
                              {+type === 0 && (
                                <Item wrapperCol={{ offset: 3 }}>
                                  <Button
                                    className={style.addBtn}
                                    onClick={() => {
                                      const value = form.getFieldValue('marketCateList')[index]!.marketContentList;
                                      if (value && value.length >= 6) {
                                        message.warn('最多可配置6个营销素材！');
                                      } else {
                                        add();
                                      }
                                    }}
                                  >
                                    <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
                                    新建
                                  </Button>
                                </Item>
                              )}
                            </>
                          )}
                        </List>
                      </Item>
                    </Item>
                  </section>
                ))}
              </>
            )}
          </List>
        </section>
        <div className={style.btnWrap}>
          {+type === 0 && (
            <Button disabled={+type === 1} type="primary" htmlType="submit">
              保存
            </Button>
          )}
          {paperId && <Button onClick={() => setUserVisible(true)}>预览</Button>}
          <Button onClick={() => history.goBack()}>返回</Button>
        </div>
      </Form>
      <Modal
        title="选择接收人员"
        visible={userVisible}
        onClose={() => setUserVisible(false)}
        onOk={() => {
          if (receiver.length > 0) {
            setUserVisible(false);
            publishWeeklyConfig();
          } else {
            message.error('请选择预览人员');
          }
        }}
      >
        <Select
          style={{ width: '80%' }}
          placeholder="请选择"
          allowClear
          showSearch
          mode="multiple"
          filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={(val: string[]) => setReceiver(val)}
        >
          {userList.map((item) => (
            <Option key={item.userId} value={item.userId}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Modal>
    </Card>
  );
};

export default AddWeeklyConfig;
