import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, Input, Radio, Space } from 'antd';
import { BreadCrumbs } from 'src/components';
import { PlusOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';
import { changeNumber } from 'src/utils/base';
import { SelectOrg } from 'src/pages/CustomerManage/components';
import { FilterTags } from '../component';
import SelectStaff from 'src/pages/CrowdsManage/TagCrowds/component/AddUserList/AddUserList';
import classNames from 'classnames';
import styles from './style.module.less';

const CreateGroup: React.FC<RouteComponentProps> = ({ history }) => {
  const [readOnly, setReadOnly] = useState(false);

  const [addForm] = Form.useForm();
  const { List, Item } = Form;
  // const onChange = () => {
  //   console.log('a');
  // };
  // 添加规则
  const addRuleHandle = (add: (defaultValue?: any, insertIndex?: number | undefined) => void) => {
    add({ taskRuleName: '规则' + changeNumber(1) });
    // setRuleIndex((param) => ++param);
  };
  // 自定义校验
  const validator = (_: any, value: any) => {
    if (value && value.length) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error('Should accept agreement'));
    }
  };

  useEffect(() => {
    setReadOnly(false);
  }, []);

  return (
    <div className="container">
      <BreadCrumbs navList={[{ name: '标签分群', path: '/tagCrowds' }, { name: '创建分群' }]} />
      <Form form={addForm} className="mt20 edit">
        <div className="sectionTitle">基本信息</div>
        <Item label="分群名称">
          <Input className="width320" placeholder="请输入" maxLength={30} showCount />
        </Item>
        <Item label="分群备注">
          <Input.TextArea className="width420" placeholder="请输入" maxLength={200} showCount />
        </Item>

        <div className="sectionTitle">分群规则</div>

        <div className={styles.panel}>
          <div className={styles.panelTitle}>
            创建规则 <span className="color-danger ml20">备注：标签组内为交集，标签组与标签组之间为并集逻辑。</span>
          </div>

          <div className={styles.panelContent}>
            <List name="taskRuleList" initialValue={[{}]} rules={[{ validator, message: '请添加任务推送规则' }]}>
              {(fields, { add, remove }, { errors }) => (
                <>
                  {fields.map((field: any, index) => (
                    <div key={field.key + index}>
                      <Item name="filterTags" noStyle>
                        <FilterTags removeHandle={remove} fieldIndex={index} />
                      </Item>
                    </div>
                  ))}
                  <Button
                    className={classNames(styles.addTagGroup, 'mt20')}
                    onClick={() => addRuleHandle(add)}
                    icon={<PlusOutlined />}
                  >
                    新增标签组
                  </Button>
                  <div className={styles.errers}>
                    <Form.ErrorList errors={errors} />
                  </div>
                </>
              )}
            </List>
          </div>
          <div className={styles.panelContent}>
            <Form.Item
              label="更新方式"
              style={{ marginBottom: '0' }}
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
              <Radio.Group defaultValue={'e'}>
                <Radio value={'e'}>手动更新</Radio>
                <Radio value={'f'}>每日更新</Radio>
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
            <SelectStaff />
          </Item>
        </div>
        <div className={classNames(styles.panelContent, 'ml20 mt20')} style={{ width: '980px' }}>
          <div className="flex justify-between align-center">
            <span>手工排除</span>
          </div>
          <Divider style={{ margin: '14px 0' }}></Divider>
          <Item name="excludeUserList">
            <SelectStaff />
          </Item>
        </div>
        <div className={classNames(styles.panelContent, 'ml20 mt20')} style={{ width: '980px' }}>
          <Form.Item
            label="假客户模型是否参与计算"
            labelCol={{ span: 24 }}
            name="fakeClientComputed"
            extra={<div className="color-danger ml20">备注：选择“是”，则会将假客户模型的客户进行排除计算。</div>}
          >
            <Radio.Group style={{ marginLeft: '20px' }} defaultValue={'a'}>
              <Radio value={'a'}>是</Radio>
              <Radio value={'b'}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Divider style={{ margin: 0 }} />
          <Form.Item
            label="是否去重客户，一个客户仅给一个客户经理处理 "
            name="distinctClient"
            labelCol={{ span: 24 }}
            extra={
              <div className="color-danger ml20">
                备注：选择“是”，如果有多个客户经理对应一个客户，会通过规则留下一个客户对应一个客户经理，不会正对一个客户生成多个客户经理的任务
              </div>
            }
          >
            <Radio.Group style={{ marginLeft: '20px' }} defaultValue={'a'}>
              <Radio value={'a'}>是</Radio>
              <Radio value={'b'}>否</Radio>
            </Radio.Group>
          </Form.Item>
          <Divider style={{ margin: 0 }} />
          <Form.Item label="人群包是否计算领导（上级领导计算在内）：" name="leaderComputed" labelCol={{ span: 24 }}>
            <Radio.Group style={{ marginLeft: '20px' }} defaultValue={'a'}>
              <Radio value={'a'}>是</Radio>
              <Radio value={'b'}>否，仅计算客户经理</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <Form.Item className="formFooter mt40">
          <Space size={36} style={{ marginLeft: '20px' }}>
            <Button shape="round" type="primary">
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
      <SelectOrg />
    </div>
  );
};

export default CreateGroup;
