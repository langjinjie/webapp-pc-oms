import { Form, Radio, Select } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';
import { Icon, NgFormSearch, NgModal, NgTable } from 'src/components';

import styles from './style.module.less';

type RuleActionSetModalProps = React.ComponentProps<typeof NgModal> & {
  onCancel: () => void;
};
const RuleActionSetModal: React.FC<RuleActionSetModalProps> = ({ onCancel, ...props }) => {
  const [values, setValues] = useState<any>({});
  const [actionForm] = Form.useForm();
  const handleOk = () => {
    actionForm.validateFields().then(() => {
      actionForm.submit();
      onCancel();
    });
  };

  const onValuesChange = (changedValues: any, values: any) => {
    setValues(values);
  };

  const onSearch = (values: any) => {
    console.log(values);
  };

  const removeItem = () => {
    console.log('remove');
  };
  return (
    <NgModal width={808} {...props} title="内容选择" onOk={handleOk} onCancel={() => onCancel()}>
      <Form form={actionForm} onValuesChange={onValuesChange} labelCol={{ span: 3 }}>
        <Form.Item label="内容来源" name={'contentSource'} rules={[{ required: true }]}>
          <Select className="width320">
            <Select.Option value={1}>公有库</Select.Option>
            <Select.Option value={2}>机构库</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="动作类型" name={'contentType'}>
          <Radio.Group>
            <Radio value={1}>文章</Radio>
            <Radio value={2}>海报</Radio>
            {/* <Radio value={3}>产品</Radio>
            <Radio value={4}>活动</Radio> */}
            <Radio value={5}>话术</Radio>
          </Radio.Group>
        </Form.Item>
        {values.contentSource === 2 && (
          <Form.Item label="选择内容">
            <Form.Item name={'contentCategory'}>
              <Radio.Group>
                <Radio value={1}>机构自定义配置</Radio>
                <Radio value={2}>按照规则配置</Radio>
              </Radio.Group>
            </Form.Item>
            {values.contentCategory === 2 && (
              <div className={styles.categoryWrap}>
                <div className={styles.tipText}>按照</div>
                <Form.Item className={styles.categoryItem} rules={[{ required: true }]} name="categoryId">
                  <Select placeholder="请选择类目">
                    <Select.Option value={1}>公有库</Select.Option>
                    <Select.Option value={2}>机构库</Select.Option>
                  </Select>
                </Form.Item>
                <div className={styles.tipText}>最新发布的类型</div>
              </div>
            )}
          </Form.Item>
        )}
      </Form>
      <div>
        <div className={classNames(styles.marketingWarp, 'container')}>
          <NgFormSearch
            onSearch={onSearch}
            searchCols={[
              {
                name: 'title',
                type: 'input',
                label: '文章名称',
                width: '200px',
                placeholder: '待输入'
              },
              {
                name: 'title1',
                type: 'select',
                label: '文章分类',
                width: '200px',
                placeholder: '待输入'
              }
            ]}
            hideReset
          />
          <NgTable
            className="mt20"
            size="small"
            scroll={{ x: 600 }}
            bordered
            columns={[
              { title: '策略任务模板编号', dataIndex: 'newsId', key: 'newsId', width: 100 },
              {
                title: '策略任务模板名称',
                dataIndex: 'title',
                key: 'title',
                width: 300
              },
              {
                title: '详情',
                dataIndex: 'title',
                key: 'title',
                width: 80
              }
            ]}
          ></NgTable>
        </div>

        {/* 已经选择的 */}
        <div>
          <div className="color-text-primary mt22">已选择</div>
          <div className={classNames(styles.marketingWarp, 'mt12')}>
            <div className={classNames(styles.customTag)}>
              <span>保险到期日前14天</span>
              <Icon className={styles.closeIcon} name="biaoqian_quxiao" onClick={() => removeItem()}></Icon>
            </div>
            <div className={classNames(styles.customTag)}>
              <span>保险到期日前14天</span>
              <Icon className={styles.closeIcon} name="biaoqian_quxiao"></Icon>
            </div>
            <div className={classNames(styles.customTag)}>
              <span>保险到期日前14天</span>
              <Icon className={styles.closeIcon} name="biaoqian_quxiao"></Icon>
            </div>
          </div>
        </div>
      </div>
    </NgModal>
  );
};

export default RuleActionSetModal;
