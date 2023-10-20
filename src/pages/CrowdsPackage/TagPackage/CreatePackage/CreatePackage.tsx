import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, message, Radio, Space, Spin } from 'antd';
import { BreadCrumbs } from 'src/components';
import { PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';
import { FilterTags, AddUserList, FilterClientAttr, UploadExcel } from 'src/pages/CrowdsPackage/TagPackage/component';
import {
  getAttrConfigOptions,
  requestCreatePackageRule,
  requestGetPackageRule,
  requestGetPackageDetail,
  requestGetDelPackageExcel
} from 'src/apis/CrowdsPackage';
import qs from 'qs';
import classNames from 'classnames';
import styles from './style.module.less';
import { computedOptions } from '../Config';

interface IReqRuleItem {
  tagList: IReqTagListItem[];
}

interface IResRuleItem {
  groupId: string;
  factTagList: IResTagListItem[];
  interestTagList: IResTagListItem[];
  carTagList: IResTagListItem[];
}

interface IReqTagListItem {
  type: number;
  tagId: string;
  tagName: string;
  groupId: string;
  groupName: string;
}

interface IResTagListItem {
  type: number;
  tagId: string;
  tagName: string;
  tagGroupId: string;
  tagGroupName: string;
}

const CreateGroup: React.FC<RouteComponentProps> = ({ history }) => {
  const [readOnly, setReadOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [attrOptions, setAttrOptions] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>({
    type: 1,
    attrList: [{}]
  });
  const [excelDetail, setExcelDetail] = useState<any>();
  const [addForm] = Form.useForm();
  const { List, Item } = Form;

  // List自定义校验
  const validator = (_: any, value: any) => {
    if (value && value.length) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Should accept agreement'));
    }
  };

  const { packageId, packageType } = qs.parse(location.search, { ignoreQueryPrefix: true }) as {
    [key: string]: string;
  };

  const onFinishHandle = async (values?: any) => {
    setSubmitLoading(true);
    // 格式化提交的数据
    const {
      addUserList,
      excludeUserList,
      ruleList,
      type,
      attrList,
      fakeClientComputed,
      distinctClient,
      leaderComputed,
      ...otherValue
    } = values;
    let params = {};
    // type === 1
    if (type === 1) {
      params = {
        ...otherValue,
        ruleInfo: {
          ruleList: ruleList?.map(({ tagList }: IReqRuleItem) => ({
            tagList: tagList?.map(({ type, tagId, tagName, groupId, groupName }) => ({
              type,
              tagId,
              tagName,
              tagGroupId: groupId,
              tagGroupName: groupName
            }))
          })),
          excludeUserList: excludeUserList?.map(
            ({ userId, userName, userType }: { userId: string; userName: string; userType: string }) => ({
              userId,
              userName,
              userType
            })
          ),
          addUserList: addUserList?.map(
            ({ userId, userName, userType }: { userId: string; userName: string; userType: string }) => ({
              userId,
              userName,
              userType
            })
          ),
          fakeClientComputed,
          distinctClient,
          leaderComputed
        },
        type
      };
      // type === 2
    } else if (type === 2) {
      params = {
        ...otherValue,
        type,
        attrInfo: {
          attrList
        }
      };
      // type === 3
    } else {
      params = {
        ...otherValue,
        type,
        importInfo: otherValue.importInfo && { filePath: otherValue.importInfo },
        refreshType: 2,
        packageId
      };
    }
    const res = await requestCreatePackageRule(params);
    if (res) {
      message.success('人群包创建成功');
      history.push('/tagPackage');
    }
    setSubmitLoading(false);
  };

  // 获取详情
  const getDetail = async () => {
    if (!packageId || packageType === '3') return;
    setLoading(true);
    const res = await requestGetPackageRule({ packageId });
    if (res) {
      // 处理ruleList
      const { ruleInfo, type, attrInfo, ...otherValues } = res;
      if (type === 1) {
        const ruleList = ruleInfo.ruleList.map((tagList: IResRuleItem) => ({
          tagList: [...tagList.interestTagList, ...tagList.factTagList, ...tagList.carTagList].map(
            (tagItem: IResTagListItem) => ({
              ...tagItem,
              groupId: tagItem.tagGroupId,
              groupName: tagItem.tagGroupName
            })
          )
        }));
        addForm.setFieldsValue({ ...otherValues, ruleList, type });
      } else {
        addForm.setFieldsValue({ ...otherValues, attrList: attrInfo.attrList, type });
        setFormValues(res);
      }
    }
    setLoading(false);
    setReadOnly(true);
  };

  // 获取人群包详情
  const getExcelDetail = async () => {
    if (!packageId || packageType !== '3') return;
    setLoading(true);
    const res = await requestGetPackageDetail({ packageId });
    if (res) {
      const { packageType, ...otherValues } = res;
      setExcelDetail(res);
      setFormValues({ ...otherValues, type: packageType });
      addForm.setFieldsValue({ ...otherValues, type: packageType });
    }
    setLoading(false);
  };

  const getAttrOptions = async () => {
    const res = await getAttrConfigOptions({});
    setAttrOptions(res || []);
  };

  // 删除人群包已上传的文件
  const delExcel = async () => {
    const res = await requestGetDelPackageExcel({ packageId });
    if (res) {
      message.success('人群包文件删除成功');
      getExcelDetail();
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getDetail();
      getExcelDetail();
      getAttrOptions();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const onValuesChange = (changedValues: any, values: any) => {
    setFormValues(values);
    // 对form进行重置法
    if (changedValues.type === 1) {
      addForm.setFieldsValue({
        attrList: [{}]
      });
    }
  };
  return (
    <Spin spinning={loading} tip="加载中...">
      <div className="container">
        <BreadCrumbs />
        <Form
          form={addForm}
          className="mt20 edit"
          onFinish={onFinishHandle}
          scrollToFirstError={{ block: 'center', behavior: 'smooth' }}
          onValuesChange={onValuesChange}
          initialValues={formValues}
        >
          <div className="sectionTitle">基本信息</div>
          <Item label="分群名称" name="packageName" rules={[{ required: true, message: '请输入分群名称' }]}>
            <Input className="width320" placeholder="请输入" maxLength={30} showCount readOnly={readOnly} />
          </Item>
          <Item label="分群备注" name="remark">
            <Input.TextArea className="width420" placeholder="请输入" maxLength={200} showCount readOnly={readOnly} />
          </Item>
          <Item label="选择分群类型" name="type">
            <Radio.Group disabled={readOnly || !!packageId}>
              <Radio value={1}>标签属性</Radio>
              <Radio value={2}>人员属性</Radio>
              <Radio value={3}>手工导入文件</Radio>
            </Radio.Group>
          </Item>

          <div className="sectionTitle">分群规则</div>
          {formValues.type !== 3 && (
            <>
              <div className={styles.panel}>
                <div className={styles.panelTitle}>
                  创建规则{' '}
                  <span className="color-danger ml20">
                    备注：
                    {formValues.type === 1
                      ? '标签组内为交集，标签组与标签组之间为并集逻辑。'
                      : '下方选择的属性逻辑上交集'}{' '}
                  </span>
                </div>
                <div className={styles.panelContent}>
                  {formValues.type === 1
                    ? (
                    <List
                      name="ruleList"
                      initialValue={[{ tagList: [] }]}
                      rules={[{ validator, message: '请添加任务推送规则' }]}
                    >
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field: any, index) => (
                            <div key={field.key + index}>
                              <Item name={[field.name, 'tagList']} rules={[{ validator, message: '请添加筛选标签' }]}>
                                <FilterTags removeHandle={remove} fieldIndex={index} isTagFlat readOnly={readOnly} />
                              </Item>
                            </div>
                          ))}
                          <Button
                            className={classNames(styles.addTagGroup, 'mt20')}
                            onClick={() => add({})}
                            disabled={readOnly}
                            icon={<PlusOutlined />}
                          >
                            新增标签组
                          </Button>
                          <Form.ErrorList errors={errors} />
                        </>
                      )}
                    </List>
                      )
                    : (
                    <List name="attrList" initialValue={[{}]}>
                      {(fields, { add, remove }, { errors }) => (
                        <div className={styles.attrWrap}>
                          <p className="f14">选择人员</p>
                          {fields.map(({ name }, index) => (
                            <FilterClientAttr
                              key={index + 'attr'}
                              disabled={readOnly}
                              formValues={formValues}
                              index={index}
                              name={name}
                              options={attrOptions}
                              remove={fields.length > 1 ? () => remove(index) : undefined}
                            ></FilterClientAttr>
                          ))}
                          {
                            <Button
                              type="primary"
                              className={classNames(styles.addTagGroup, 'mt20')}
                              onClick={() => add({})}
                              disabled={readOnly}
                              icon={<PlusOutlined />}
                              ghost
                            >
                              添加字段
                            </Button>
                          }
                          <Form.ErrorList errors={errors} />
                        </div>
                      )}
                    </List>
                      )}
                </div>
                <div className={styles.panelContent}>
                  <Form.Item
                    label="更新方式"
                    style={{ marginBottom: '0' }}
                    name="refreshType"
                    rules={[{ required: true, message: '请选择更新方式' }]}
                    extra={
                      <div className="color-text-placeholder flex mt10">
                        <div>备注：</div>
                        <ul>
                          <li>1、手动更新 当人群包生效后，点击更新进行数据更新</li>
                          <li>2、每日更新 每日晚上均会进行更新</li>
                        </ul>
                      </div>
                    }
                  >
                    <Radio.Group disabled={readOnly}>
                      <Radio value={2}>手动更新</Radio>
                      <Radio value={1}>每日更新</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>

              {formValues.type === 1 && (
                <>
                  {/* 手工添加 */}
                  <div className="sectionTitle mt40">手工新增</div>
                  <div className={classNames(styles.panelContent, 'ml20')} style={{ width: '980px' }}>
                    <div className="flex justify-between align-center">
                      <span>手工新增</span>
                    </div>
                    <Divider style={{ margin: '14px 0' }}></Divider>
                    <Item name="addUserList">
                      <AddUserList readOnly={readOnly} />
                    </Item>
                  </div>
                  <div className={classNames(styles.panelContent, 'ml20 mt20')} style={{ width: '980px' }}>
                    <div className="flex justify-between align-center">
                      <span>手工排除</span>
                    </div>
                    <Divider style={{ margin: '14px 0' }}></Divider>
                    <Item name="excludeUserList">
                      <AddUserList readOnly={readOnly} />
                    </Item>
                  </div>
                  <div className={classNames(styles.panelContent, 'ml20 mt20')} style={{ width: '980px' }}>
                    <Form.Item
                      label="假客户模型是否参与计算"
                      labelCol={{ span: 24 }}
                      name="fakeClientComputed"
                      initialValue={1}
                      rules={[{ required: true, message: '请选择假客户模型是否参与计算' }]}
                      extra={
                        <div className="color-danger ml20">备注：选择“是”，则会将假客户模型的客户进行排除计算。</div>
                      }
                    >
                      <Radio.Group style={{ marginLeft: '20px' }} disabled={readOnly}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Divider style={{ margin: 0 }} />
                    <Form.Item
                      label="是否去重客户，一个客户仅给一个客户经理处理 "
                      name="distinctClient"
                      initialValue={1}
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: '请选择是否去重客户' }]}
                      extra={
                        <div className="color-danger ml20">
                          备注：选择“是”，如果有多个客户经理对应一个客户，会通过规则留下一个客户对应一个客户经理，不会正对一个客户生成多个客户经理的任务
                        </div>
                      }
                    >
                      <Radio.Group style={{ marginLeft: '20px' }} disabled={readOnly}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Divider style={{ margin: 0 }} />
                    <Form.Item
                      label="人群包是否计算领导（上级领导计算在内）："
                      name="leaderComputed"
                      initialValue={0}
                      labelCol={{ span: 24 }}
                      rules={[{ required: true, message: '请选择是否计算领导' }]}
                    >
                      <Radio.Group style={{ marginLeft: '20px' }} disabled={readOnly}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否，仅计算客户经理</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </>
              )}
            </>
          )}

          {formValues.type === 3 && (
            <>
              <Form.Item name="importInfo" noStyle>
                <UploadExcel
                  onDownload={() =>
                    (location.href =
                      'https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/file/pack/%E4%BA%BA%E7%BE%A4%E5%8C%85%E5%AF%BC%E5%85%A5%E6%96%87%E4%BB%B6%E6%A8%A1%E6%9D%BF.xlsx')
                  }
                />
              </Form.Item>
              <span className="inline-block ml10">{formValues.importInfo}</span>
              {excelDetail && (
                <>
                  <div className="flex align-center mt10">
                    <i
                      className={classNames('status-point', {
                        'status-point-gray': excelDetail.computeStatus === 1,
                        'status-point-green': excelDetail.computeStatus === 2,
                        'status-point-red': excelDetail.computeStatus === 3
                      })}
                    />
                    {computedOptions.find((item) => item.id === excelDetail.computeStatus)?.name}
                    <div className="ml10">{excelDetail?.computeMsg}</div>
                    <Button className="ml10" disabled={excelDetail.computeStatus !== 2} onClick={delExcel}>
                      删除
                    </Button>
                  </div>
                  <div className="mt10">此次导入共计: {`${excelDetail?.clientNum || 0}行数据`}</div>
                </>
              )}
            </>
          )}

          <Form.Item className="formFooter mt40">
            <Space size={36} style={{ marginLeft: '20px' }}>
              <Button shape="round" type="primary" htmlType="submit" loading={submitLoading} disabled={readOnly}>
                保存运行
              </Button>
              <Button
                shape="round"
                type="primary"
                ghost
                onClick={() => {
                  history.goBack();
                }}
              >
                {readOnly ? '返回' : '取消'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default CreateGroup;
