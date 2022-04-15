/**
 * @name AddStationConfig
 * @author Lester
 * @date 2021-05-24 11:19
 */

import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Card, Collapse, Button, Form, FormProps, Input, Select, TreeSelect, message, Upload } from 'antd';
import { getQueryParam } from 'lester-tools';
import { Icon } from 'src/components';
import {
  saveStation,
  queryCorpOrg,
  queryStationDetail,
  queryActivityList,
  queryProductList
} from 'src/apis/stationConfig';
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
  const [activityMessage, setActivityMessage] = useState<string[]>([]);
  const [productMessage, setProductMessage] = useState<string[]>([]);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const [form] = useForm();
  const { SHOW_ALL } = TreeSelect;
  const type: string = getQueryParam('type');

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
   * 获取产品列表
   */
  const getProductList = async () => {
    const res: any = await queryProductList();
    if (Array.isArray(res)) {
      setProductList(res);
    }
  };

  /**
   * 获取活动列表
   */
  const getActivityList = async () => {
    const res: any = await queryActivityList();
    if (Array.isArray(res)) {
      setActivityList(res);
    }
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
          activityId: +status === 3 ? undefined : activityId,
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
        productList: productList.map(({ productId, status }: Product) => ({
          productId: +status === 3 ? undefined : productId
        }))
      });
      if (+type === 0) {
        const activityMessages: string[] = [];
        const productMessages: string[] = [];
        activityList.forEach(({ status, activityName, activityId }: Activity) => {
          if (+status === 3) {
            activityMessages.push(`${activityName || activityId}已过期，请重新选择`);
          } else {
            activityMessages.push('请选择活动');
          }
        });
        productList.forEach(({ status, productName, productId }: Product) => {
          if (+status === 3) {
            productMessages.push(`${productName || productId}已过期，请重新选择`);
          } else {
            productMessages.push('请选择产品');
          }
        });
        setActivityMessage(activityMessages);
        setProductMessage(productMessages);
        form.validateFields();
      }
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

  /**
   * 异步加载数据
   * @param key
   * @param children
   * @param nodeData
   */
  /* const onLoadData = ({ key, children, nodeData }: any) => {
    return new Promise<void>((resolve) => {
      if (children) {
        resolve();
        return false;
      }
      getCorpOrgData(key).then((res: any) => {
        if (nodeData) {
          nodeData.children = res;
        }
        setOrganization((state) => [...state]);
        resolve();
      });
    });
  }; */

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
    getActivityList();
    getProductList();
  }, []);

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
                          fieldKey={[field.fieldKey, 'activityId']}
                          rules={[{ required: true, message: activityMessage[index] }]}
                          className={style.listFormItem}
                        >
                          <Select
                            disabled={+type === 1}
                            showSearch
                            filterOption={(input, option) =>
                              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            allowClear
                            placeholder="请选择"
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
                        fieldKey={[field.fieldKey, 'bannerUrl']}
                        rules={[{ required: true, message: '请上传图片' }]}
                        getValueFromEvent={normFile}
                        valuePropName="fileList"
                        extra="为确保最佳展示效果，请上传670*200像素高清图片，仅支持png/jpg格式"
                      >
                        <Upload
                          accept="image/*"
                          disabled={+type === 1}
                          listType="picture-card"
                          action="/tenacity-admin/api/file/upload"
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
                产品配置{' '}
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
                        fieldKey={[field.fieldKey, 'productId']}
                        rules={[{ required: true, message: productMessage[index] }]}
                        className={style.listFormItem}
                      >
                        <Select
                          disabled={+type === 1}
                          showSearch
                          filterOption={(input, option) =>
                            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          allowClear
                          placeholder="请选择"
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
