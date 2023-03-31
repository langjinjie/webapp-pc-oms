import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, message, Radio, Space, Spin } from 'antd';
import { BreadCrumbs } from 'src/components';
import { PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';
import { FilterTags, AddUserList } from 'src/pages/CrowdsPackage/TagPackage/component';
import { requestCreatePackageRule, requestGetPackageRule } from 'src/apis/CrowdsPackage';
import qs from 'qs';
import classNames from 'classnames';
import styles from './style.module.less';

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

  const [addForm] = Form.useForm();
  const { List, Item } = Form;

  // 添加规则
  const addRuleHandle = (add: (defaultValue?: any, insertIndex?: number | undefined) => void) => {
    add({});
  };

  // List自定义校验
  const validator = (_: any, value: any) => {
    if (value && value.length) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Should accept agreement'));
    }
  };

  const onFinishHandle = async (values?: any) => {
    setSubmitLoading(true);
    // 格式化提交的数据
    const { addUserList, excludeUserList, ruleList } = values;
    const params = {
      ...values,
      addUserList: addUserList?.map(
        ({ userId, userName, userType }: { userId: string; userName: string; userType: string }) => ({
          userId,
          userName,
          userType
        })
      ),
      excludeUserList: excludeUserList?.map(
        ({ userId, userName, userType }: { userId: string; userName: string; userType: string }) => ({
          userId,
          userName,
          userType
        })
      ),
      /*
      ruleList的结构
      [{tagList:[{ type: number; tagId: string; tagName: string; groupId: string; groupName: string }, ...]}, ...]
      */
      ruleList: ruleList?.map(({ tagList }: IReqRuleItem) => ({
        tagList: tagList?.map(({ type, tagId, tagName, groupId, groupName }) => ({
          type,
          tagId,
          tagName,
          tagGroupId: groupId,
          tagGroupName: groupName
        }))
      }))
    };
    const res = await requestCreatePackageRule(params);
    if (res) {
      message.success('人群包创建成功');
      history.push('/tagPackage');
    }
    setSubmitLoading(false);
  };

  // 获取详情
  const getDetail = async () => {
    const { packageId } = qs.parse(location.search, { ignoreQueryPrefix: true });
    if (!packageId) return;
    setLoading(true);
    const res = await requestGetPackageRule({ packageId });
    if (res) {
      // 处理ruleList
      const ruleList = res.ruleList.map((tagList: IResRuleItem) => ({
        tagList: [...tagList.interestTagList, ...tagList.factTagList, ...tagList.carTagList].map(
          (tagItem: IResTagListItem) => ({
            ...tagItem,
            groupId: tagItem.tagGroupId,
            groupName: tagItem.tagGroupName
          })
        )
      }));
      addForm.setFieldsValue({ ...res, ruleList });
    }
    setLoading(false);
    setReadOnly(true);
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <Spin spinning={loading} tip="加载中...">
      <div className="container">
        <BreadCrumbs />
        <Form form={addForm} className="mt20 edit" onFinish={onFinishHandle}>
          <div className="sectionTitle">基本信息</div>
          <Item label="分群名称" name="packageName" rules={[{ required: true, message: '请输入分群名称' }]}>
            <Input className="width320" placeholder="请输入" maxLength={30} showCount readOnly={readOnly} />
          </Item>
          <Item label="分群备注" name="remark">
            <Input.TextArea className="width420" placeholder="请输入" maxLength={200} showCount readOnly={readOnly} />
          </Item>
          <div className="sectionTitle">分群规则</div>
          <div className={styles.panel}>
            <div className={styles.panelTitle}>
              创建规则 <span className="color-danger ml20">备注：标签组内为交集，标签组与标签组之间为并集逻辑。</span>
            </div>
            <div className={styles.panelContent}>
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
                      onClick={() => addRuleHandle(add)}
                      disabled={readOnly}
                      icon={<PlusOutlined />}
                    >
                      新增标签组
                    </Button>
                    <Form.ErrorList errors={errors} />
                  </>
                )}
              </List>
            </div>
            <div className={styles.panelContent}>
              <Form.Item
                label="更新方式"
                style={{ marginBottom: '0' }}
                name="refreshType"
                rules={[{ required: true, message: '请选择更新方式' }]}
                extra={
                  <div className="color-danger flex">
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
              extra={<div className="color-danger ml20">备注：选择“是”，则会将假客户模型的客户进行排除计算。</div>}
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
