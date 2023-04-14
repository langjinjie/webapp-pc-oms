import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Space } from 'antd';
import classNames from 'classnames';
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { editSqlConfig, getSqlConfigDetail } from 'src/apis/dashboard';
import { BreadCrumbs } from 'src/components';
import { urlSearchParams } from 'src/utils/base';

import styles from './add.module.less';

const FetchDataAdd: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [addForm] = Form.useForm();

  const getDetail = async () => {
    const { id } = urlSearchParams<{ id: string }>(location.search);
    if (id) {
      const res = await getSqlConfigDetail({ sqlId: id });

      res &&
        addForm.setFieldsValue({
          ...res
        });
    } else {
      addForm.setFieldsValue({
        params: []
      });
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  const onFinish = async (values: any) => {
    const { params, content, ...otherValues } = values;
    const paramsFilter = params.filter((item: any) => item.paramName) || [];
    const res = await editSqlConfig({
      ...otherValues,
      content: window.btoa(encodeURI(content)),
      params: paramsFilter.length > 0 ? paramsFilter : undefined
    });
    if (res) {
      message.success('保存成功');
      history.goBack();
    }
  };
  return (
    <div className="container">
      <BreadCrumbs navList={[{ name: '通用取数', path: '/fetchData' }, { name: '创建' }]} />

      <Form className="mt20 edit" form={addForm} onFinish={onFinish}>
        <div className="sectionTitle">基本配置</div>
        <Form.Item label="模板名称" name={'name'} rules={[{ required: true }]}>
          <Input placeholder="请输入" className="width400"></Input>
        </Form.Item>
        <Form.Item label="模板ID" hidden name={'sqlId'}>
          <Input placeholder="请输入" className="width400"></Input>
        </Form.Item>
        <Form.Item label="模板描述" name={'des'} rules={[{ required: true }]}>
          <Input placeholder="请输入" className="width400"></Input>
        </Form.Item>
        <Form.Item label="模板内容" name={'content'} rules={[{ required: true }]}>
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
                    <Form.Item label="参数名称" rules={[{ required: true }]} name={[name, 'paramName']} {...restFiled}>
                      <Input className="width400" placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="参数id" hidden name={[name, 'paramId']} {...restFiled}>
                      <Input className="width400" placeholder="请输入" />
                    </Form.Item>
                    <Form.Item label="参数描述" rules={[{ required: true }]} name={[name, 'paramDesc']} {...restFiled}>
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
            <Button
              shape="round"
              type="primary"
              ghost
              onClick={() => {
                history.goBack();
              }}
            >
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
