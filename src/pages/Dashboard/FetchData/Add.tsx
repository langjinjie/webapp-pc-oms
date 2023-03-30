import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { BreadCrumbs } from 'src/components';

import styles from './add.module.less';

const FetchDataAdd: React.FC = () => {
  const [addForm] = Form.useForm();

  useEffect(() => {
    addForm.setFieldsValue({
      params: [{}]
    });
  }, []);

  return (
    <div className="container">
      <BreadCrumbs navList={[{ name: '通用取数', path: '/fetchData' }, { name: '创建' }]} />

      <Form className="mt20 edit" form={addForm}>
        <div className="sectionTitle">基本配置</div>
        <Form.Item label="模板名称" name={'name'} rules={[{ required: true }]}>
          <Input placeholder="请输入" className="width400"></Input>
        </Form.Item>
        <Form.Item label="模板描述" name={'name'} rules={[{ required: true }]}>
          <Input placeholder="请输入" className="width400"></Input>
        </Form.Item>
        <Form.Item label="模板内容" name={'name'} rules={[{ required: true }]}>
          <Input.TextArea placeholder="请输入" className={styles.width650} rows={8}></Input.TextArea>
        </Form.Item>

        <div className="sectionTitle">参数配置</div>

        <Form.List name={'params'}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restFiled }, index) => (
                <div key={key} className={styles.formItem}>
                  <div className={classNames('flex justify-between align-center', styles.itemTitle)}>
                    <span>参数{index + 1}</span>{' '}
                    <Button type="primary" ghost shape="round" className="smallBtn" onClick={() => remove(index)}>
                      删除
                    </Button>
                  </div>
                  <div className={styles.itemContent}>
                    <Form.Item label="参数名称" name={[name, 'name']} {...restFiled}>
                      <Input className="width400" placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="参数描述" name={[name, 'desc']} {...restFiled}>
                      <Input className={styles.width650} placeholder="请输入" />
                    </Form.Item>
                  </div>
                </div>
              ))}

              <Button
                ghost
                type="primary"
                className="smallBtn"
                shape="round"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                新增
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item className="formFooter mt40" style={{ marginLeft: '240px' }}>
          <Space size={36}>
            <Button shape="round" type="primary" ghost>
              取消
            </Button>
            <Button shape="round" type="primary" htmlType="submit">
              保存
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FetchDataAdd;
