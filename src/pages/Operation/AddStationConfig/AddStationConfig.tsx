/**
 * @name AddStationConfig
 * @author Lester
 * @date 2021-05-24 11:19
 */

import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Collapse, Button, Form, FormProps, Input, Select, TreeSelect, message, Upload } from 'antd';
import { getQueryParam } from 'tenacity-tools';
import { Icon } from 'src/components';
import { saveStation, queryCorpOrg, queryStationDetail } from 'src/apis/stationConfig';
import { queryMarketArea, searchRecommendGoodsList } from 'src/apis/marketing';
import { debounce } from 'src/utils/base';
import { TOKEN_KEY } from 'src/utils/config';
import style from './style.module.less';

interface Activity {
  status: string;
  activityId: string;
  activityName: string;
  bannerUrl?: any;
}

interface Product {
  productId: string;
  productName: string;
  status: string;
}

const { Panel } = Collapse;
const { Item, List, useForm } = Form;
const { Option } = Select;
const { TreeNode } = TreeSelect;

const AddStationConfig: React.FC<RouteComponentProps> = ({ history }) => {
  const [organization, setOrganization] = useState<any[]>([]);
  const [activityList, setActivityList] = useState<Activity[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [areaText, setAreaText] = useState<any>({});

  const areaTextRef: MutableRefObject<any> = useRef({});
  const [form] = useForm();
  const { SHOW_ALL } = TreeSelect;
  const type: string = getQueryParam('type');

  const myToken = window.localStorage.getItem(TOKEN_KEY);

  const renderAreaTips = (type: string, index: number) => {
    const itemId = (form.getFieldValue(`${type}List`)[index] || {})[`${type}Id`];
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

  /**
   * 提交保存
   * @param settingName
   * @param visibleScopeDeptIds
   * @param activityList
   * @param values
   */
  const onSubmit = async ({ settingName, visibleScopeDeptIds, activityList = [], ...values }: any) => {
    setIsSubmit(true);
    const settingId: string = getQueryParam('settingId');
    const param = {
      ...values,
      settingName: settingName.replace(/\s/g, ''),
      visibleScopeDeptIds: visibleScopeDeptIds.toString(),
      activityList: activityList.map(({ activityId, bannerUrl }: Activity) => ({
        activityId,
        bannerUrl: bannerUrl[0]?.response?.retdata?.filePath
      }))
    };
    if (settingId) {
      param.settingId = settingId;
    }
    const res = await saveStation(param);
    if (res) {
      message.success('保存成功！');
      history.goBack();
    }
    setIsSubmit(false);
  };

  const formLayout: FormProps = {
    labelAlign: 'right',
    labelCol: { span: 3 },
    wrapperCol: { span: 6 }
  };

  /**
   * 查询小站配置详情
   */
  const getStationDetail = async () => {
    const settingId: string = getQueryParam('settingId');
    if (settingId) {
      const res: any = await queryStationDetail({ settingId });
      const { settingName, visibleScopeDeptIds, activityList = [], productList = [] } = res;
      form.setFieldsValue({
        settingName,
        visibleScopeDeptIds: visibleScopeDeptIds.split(','),
        activityList: activityList.map(({ activityId, bannerUrl, status }: Activity) => ({
          activityId: activityId,
          status,
          bannerUrl: [
            {
              uid: '00',
              status: 'done',
              thumbUrl: bannerUrl,
              response: {
                retdata: {
                  filePath: bannerUrl
                }
              }
            }
          ]
        })),
        productList: productList
      });
      // if (+type !== 0) {
      activityList.forEach(({ status, activityId }: Activity) => {
        if (+status !== 3) {
          getAreaTips(1, activityId);
        }
      });
      productList.forEach(({ status, productId }: Product) => {
        if (+status !== 3) {
          getAreaTips(2, productId);
        }
      });
      setProductList(productList);
      setActivityList(activityList);
      form.validateFields();
      // }
    }
  };

  /**
   * 获取组织架构
   * @param parentId
   */
  const getCorpOrgData = async (parentId?: string) => {
    return await queryCorpOrg({ parentId });
  };

  /**
   * 获取组织架构初始数据
   */
  const initCorpOrgData = async () => {
    const res: any = await getCorpOrgData();
    if (res) {
      setOrganization(res);
    }
  };

  /**
   * 树组件渲染-组织架构
   * @param data
   */
  const renderNode = (data: any) =>
    data.map((item: any) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode nodeData={item} value={item.id} title={item.name} key={item.id}>
            {renderNode(item.children)}
          </TreeNode>
        );
      } else {
        return <TreeNode nodeData={item} isLeaf={!item.isParent} value={item.id} title={item.name} key={item.id} />;
      }
    });

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e.slice(e.length - 1);
    }
    return e && e.fileList.slice(e.fileList.length - 1);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只允许上传JPG/PNG文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  useEffect(() => {
    getStationDetail();
    initCorpOrgData();
  }, []);

  const onRecommendSearch = async (value: string, type: number) => {
    // setFetching(true);
    const res = await searchRecommendGoodsList({
      title: value,
      specType: 0,
      type: 1,
      recommendType: type
    });
    if (type === 1) {
      setActivityList(
        res.map((item: any) => ({
          ...item,
          activityId: item.marketId,
          activityName: item.title
        }))
      );
    } else {
      setProductList(
        res.map((item: any) => ({
          ...item,
          productId: item.marketId,
          productName: item.title
        }))
      );
    }
  };

  // 防抖处理
  const debounceFetcher = debounce<{ value: string; type: number }>(
    async ({ value, type }: { value: string; type: number }) => {
      await onRecommendSearch(value, type);
    },
    800
  );

  const onSelected = (value: string, index: number, type: number) => {
    if (type === 1) {
      const list = form.getFieldValue('activityList');
      list[index] = activityList.filter((item) => item.activityId === value)[0];
      form.setFieldsValue({ activityList: list });
    } else {
      const list = form.getFieldValue('productList');
      list[index] = productList.filter((item) => item.productId === value)[0];
      form.setFieldsValue({ productList: list });
    }
    getAreaTips(type, value);
  };

  return (
    <Card title="新增小站配置">
      <Form className={style.formWrap} form={form} onFinish={onSubmit} {...formLayout}>
        <Item name="settingName" label="配置名称" rules={[{ required: true, message: '请输入' }]}>
          <Input disabled={+type === 1} placeholder="示例：XX保险华南地区坐席小站" maxLength={32} />
        </Item>
        <Item name="visibleScopeDeptIds" label="可见范围" rules={[{ required: true, message: '请选择' }]}>
          <TreeSelect
            disabled={+type === 1}
            multiple
            allowClear
            showCheckedStrategy={SHOW_ALL}
            placeholder="请选择可见范围"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            // loadData={onLoadData}
          >
            {renderNode(organization)}
          </TreeSelect>
        </Item>
        <Collapse defaultActiveKey={['activity', 'product']}>
          <Panel
            key="activity"
            header={
              <div className={style.mainText}>
                活动配置 <span className={style.deputyText}>说明：该模块最多支持6个活动，如无配置，则该模块不展示</span>
              </div>
            }
          >
            <List name="activityList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Item key={field.key} className={style.formItemWrap} wrapperCol={{ span: 10 }}>
                      <Item
                        noStyle
                        shouldUpdate={(prevValues, curValues) => prevValues.activityList !== curValues.activityList}
                      >
                        <Item
                          {...field}
                          labelCol={{ span: 7 }}
                          wrapperCol={{ span: 15 }}
                          label={`${index === 0 ? '主推' : ''}活动${index > 0 ? index : ''}`}
                          name={[field.name, 'activityId']}
                          rules={[
                            { required: true },
                            ({ getFieldValue }) => ({
                              validator (_, value) {
                                const itemValue = getFieldValue('activityList')[index];
                                if (!value || +itemValue.status !== 3) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(new Error('相关内容存在已下架/删除，请检查'));
                              }
                            })
                          ]}
                          className={style.listFormItem}
                          extra={renderAreaTips('activity', index)}
                        >
                          <Select
                            disabled={+type === 1}
                            showSearch
                            filterOption={false}
                            allowClear
                            placeholder="请选择"
                            onSearch={(value) => debounceFetcher({ value, type: 1 })}
                            onDropdownVisibleChange={() => {
                              if (activityList.length < 5) {
                                debounceFetcher({ value: '', type: 1 });
                              }
                            }}
                            onChange={(value) => {
                              onSelected(value, index, 1);
                            }}
                          >
                            {activityList.map((item: Activity) => (
                              <Option key={item.activityId} value={item.activityId}>
                                {item.activityName}
                              </Option>
                            ))}
                          </Select>
                        </Item>
                      </Item>
                      <Item
                        {...field}
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label="banner图"
                        name={[field.name, 'bannerUrl']}
                        rules={[{ required: true, message: '请上传图片' }]}
                        getValueFromEvent={normFile}
                        valuePropName="fileList"
                        extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持png/jpg格式"
                      >
                        <Upload
                          accept="image/*"
                          disabled={+type === 1}
                          listType="picture-card"
                          action={'/tenacity-admin/api/file/upload?myToken=' + myToken}
                          data={{ bizKey: 'news' }}
                          beforeUpload={beforeUpload}
                        >
                          <Icon className={style.uploadIcon} name="icon_daohang_28_jiahaoyou" />
                        </Upload>
                      </Item>
                      {+type === 0 && (
                        <Icon
                          className={style.deleteIcon}
                          name="cangpeitubiao_shanchu"
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Item>
                  ))}
                  {+type === 0 && (
                    <Button
                      className={style.addBtn}
                      onClick={() => {
                        const value = form.getFieldValue('activityList');
                        if (value && value.length >= 6) {
                          message.warn('最多支持6个活动');
                        } else {
                          if (activityList.length === 0) {
                            onRecommendSearch('', 1);
                          }
                          add();
                        }
                      }}
                    >
                      <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
                      新建
                    </Button>
                  )}
                </>
              )}
            </List>
          </Panel>
          <Panel
            key="product"
            header={
              <div className={style.mainText}>
                产品配置
                <span className={style.deputyText}>说明：该模块最多支持30个产品，如无配置，则该模块不展示</span>
              </div>
            }
          >
            <List name="productList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <Item key={field.key} className={style.formItemWrap} wrapperCol={{ span: 10 }}>
                      <Item
                        {...field}
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 15 }}
                        label={`${index === 0 ? '主推' : ''}产品${index > 0 ? index : ''}`}
                        name={[field.name, 'productId']}
                        rules={[{ required: true }]}
                        className={style.listFormItem}
                        extra={renderAreaTips('product', index)}
                      >
                        <Select
                          disabled={+type === 1}
                          showSearch
                          onDropdownVisibleChange={() => {
                            if (productList.length < 5) {
                              debounceFetcher({ value: '', type: 2 });
                            }
                          }}
                          onSearch={(value) => debounceFetcher({ value, type: 2 })}
                          filterOption={false}
                          allowClear
                          placeholder="请选择"
                          onChange={(value) => {
                            onSelected(value, index, 2);
                          }}
                        >
                          {productList.map((item: Product) => (
                            <Option key={item.productId} value={item.productId}>
                              {item.productName}
                            </Option>
                          ))}
                        </Select>
                      </Item>
                      {+type === 0 && (
                        <Icon
                          className={style.deleteIcon}
                          name="cangpeitubiao_shanchu"
                          onClick={() => remove(field.name)}
                        />
                      )}
                    </Item>
                  ))}
                  {+type === 0 && (
                    <Button
                      className={style.addBtn}
                      onClick={() => {
                        const value = form.getFieldValue('productList');
                        if (value && value.length >= 30) {
                          message.warn('最多支持30个产品');
                        } else {
                          if (productList.length === 0) {
                            onRecommendSearch('', 2);
                          }
                          add();
                        }
                      }}
                    >
                      <Icon className={style.addIcon} name="icon_daohang_28_jiahaoyou" />
                      新建
                    </Button>
                  )}
                </>
              )}
            </List>
          </Panel>
        </Collapse>
        {+type === 0 && (
          <div className={style.btnWrap}>
            <Button className={style.btn} loading={isSubmit} type="primary" htmlType="submit">
              提交
            </Button>
          </div>
        )}
      </Form>
    </Card>
  );
};

export default AddStationConfig;
