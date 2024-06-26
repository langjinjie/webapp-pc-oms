/**
 * @name AddWeeklyConfig
 * @author Lester
 * @date 2021-11-06 13:49
 */
import React, { useEffect, useState, useRef, MutableRefObject } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Button, Form, FormProps, Input, Select, DatePicker, Radio, message } from 'antd';
import { getQueryParam } from 'tenacity-tools';
import moment from 'moment';
import { Icon, Modal, ImageUpload } from 'src/components';
import { queryMarketArea, searchRecommendGoodsList } from 'src/apis/marketing';
import { queryColors, queryWeeklyDetail, saveConfig, queryUserList, publishConfig } from 'src/apis/weekly';
import { DataItem } from 'src/utils/interface';
import style from './style.module.less';
import { debounce } from 'src/utils/base';

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

interface KeyMapVal {
  [key: string]: string;
}

const { Item, List, useForm } = Form;
const { Option } = Select;
const { TextArea } = Input;
const { Group } = Radio;

const AddWeeklyConfig: React.FC<RouteComponentProps> = ({ history }) => {
  const [editField, setEditField] = useState<string>('');
  const [editFieldValue, setEditFieldValues] = useState<KeyMapVal>({});
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
  const [areaText, setAreaText] = useState<any>({});

  const matetailMapRef: MutableRefObject<any> = useRef({});
  const areaTextRef: MutableRefObject<any> = useRef({});

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

  const renderAreaTips = (index: number, materialIndex: number) => {
    const listValue = form.getFieldValue('marketCateList')[index]?.marketContentList || [];
    const itemId = (listValue[materialIndex] || {}).marketId;
    if (!itemId) {
      return null;
    }
    const areaData = areaText[itemId];
    if (areaData) {
      return (
        <div className={style.areaTips}>
          <span>合计：</span>
          <span className={style.areaTipsVal}>{areaData.totalNum}人</span>
          <span>可见：</span>
          <span className={style.areaTipsVal}>{areaData.visibleNum}人</span>
          <span>不可见：</span>
          <span>{areaData.invisibleNum}人</span>
        </div>
      );
    } else {
      return null;
    }
  };

  const getAreaTips = async (type: number, itemId: string) => {
    if (areaText[itemId]) {
      return false;
    }
    const res: any = await queryMarketArea({ type, itemId });
    if (res) {
      areaTextRef.current = {
        ...areaTextRef.current,
        [itemId]: res
      };
      setAreaText(areaTextRef.current);
    }
  };

  const getColors = async () => {
    const res: any = await queryColors();
    if (res) {
      setColors(res.colorList || []);
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
              marketId: market.marketId
            }))
          }))
        });
        const articleArr = new Set();
        const productArr = new Set();
        const activityArr = new Set();
        marketCateList.forEach((item: any) => {
          if (item.cateType === 3) {
            if (item.marketContentList && item.marketContentList.length > 0) {
              item.marketContentList?.forEach((item: any) => {
                articleArr.add(item);
              });
            }
          } else if (item.cateType === 1) {
            if (item.marketContentList && item.marketContentList.length > 0) {
              item.marketContentList?.forEach((item: any) => {
                activityArr.add(item);
              });
            }
          } else {
            if (item.marketContentList && item.marketContentList.length > 0) {
              item.marketContentList?.forEach((item: any) => {
                productArr.add(item);
              });
            }
          }
        });
        setArticleList(
          Array.from(articleArr).map((item: any) => ({
            ...item,
            id: item.marketId,
            name: item.marketTitle
          }))
        );
        setProductList(
          Array.from(productArr).map((item: any) => ({
            ...item,
            id: item.marketId,
            name: item.marketTitle
          }))
        );
        setActivityList(
          Array.from(activityArr).map((item: any) => ({
            ...item,
            id: item.marketId,
            name: item.marketTitle
          }))
        );
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
              marketMessages.push(`${market.marketTitle || market.marketId}已下架，请重新选择`);
            } else {
              getAreaTips(item.cateType, market.marketId);
              marketMessages.push('搜索对应素材标题在下拉框进行选择');
            }
          });
          marketMsg[index] = marketMessages;
        });
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

  const onRecommendSearch = async (value: string, index: number) => {
    const current = form.getFieldValue('marketCateList')[index];
    // 文章类型
    const res = await searchRecommendGoodsList({
      title: value,
      specType: 0,
      type: 1,
      recommendType: current.cateType === 3 ? 0 : current.cateType
    });
    if (current.cateType === 3) {
      setArticleList(
        (res || []).map((item: any) => ({
          ...item,
          id: item.marketId,
          name: item.title
        }))
      );
    } else if (current.cateType === 1) {
      setActivityList(
        (res || []).map((item: any) => ({
          ...item,
          id: item.marketId,
          name: item.title
        }))
      );
    } else {
      if (res) {
        setProductList(
          (res || []).map((item: any) => ({
            ...item,
            name: item.title,
            id: item.marketId
          }))
        );
      }
    }
  };
  // 防抖处理
  const debounceFetcher = debounce<{ value: string; index: number }>(
    async ({ value, index }: { value: string; index: number }) => {
      await onRecommendSearch(value, index);
    },
    800
  );
  useEffect(() => {
    const paperId: string = getQueryParam('paperId');
    getWeeklyDetail(paperId);
    getColors();
    getUserList();
  }, []);

  const onSelected = (value: string, index: number, subIndex: number) => {
    const listValue = form.getFieldValue('marketCateList');
    const list = listValue[index]?.marketContentList || [];
    // 对选中的option进行处理，并且手动更新form
    const selectOptions = [...articleList, ...productList, ...activityList];
    const selectedItem = selectOptions.filter((item) => item.id === value)[0];
    list.splice(subIndex, 1, selectedItem);
    listValue[index].marketContentList = list;
    form.setFieldsValue({ marketCateList: listValue });
    setChoosedMaterial({
      ...choosedMaterial,
      [index]: list.map((item: any) => item && item.marketId).filter(Boolean)
    });
    const cateType = listValue[index]?.cateType;
    getAreaTips(cateType, value);
  };
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
        <Item name="paperDoc" label="推送文案">
          <Input
            disabled={+type === 1}
            placeholder="本周火爆内容出炉，精选内容更容易撩客户哦"
            maxLength={50}
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
                                      rules={[
                                        {
                                          required: true,
                                          message: '请选择素材'
                                        },
                                        ({ getFieldValue }) => ({
                                          validator (_, value) {
                                            const itemValue =
                                              getFieldValue('marketCateList')[index].marketContentList[materialIndex];
                                            if (!value || itemValue.status !== 3) {
                                              return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('相关内容存在已下架/删除，请检查'));
                                          }
                                        })
                                      ]}
                                      className={style.listFormItem}
                                      extra={renderAreaTips(index, materialIndex)}
                                    >
                                      <Select
                                        disabled={+type === 1}
                                        placeholder={'搜索对应素材标题在下拉框进行选择'}
                                        allowClear
                                        showSearch
                                        filterOption={false}
                                        onDropdownVisibleChange={() => {
                                          if (getMaterialData(materialList[index] || 'article').length < 5) {
                                            debounceFetcher({ value: '', index });
                                          }
                                        }}
                                        onSearch={(value) => debounceFetcher({ value, index })}
                                        onChange={(value) => onSelected(value, index, materialIndex)}
                                      >
                                        {getMaterialData(materialList[index] || 'article')?.map(
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
