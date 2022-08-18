import React from 'react';
import classNames from 'classnames';
import { Breadcrumb, Button, Divider, Form, Input, Radio, Select, Space } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

import styles from './style.module.less';

const HotSpecialEdit: React.FC<RouteComponentProps> = ({ history }) => {
  const navigatorToList = () => {
    history.goBack();
  };
  return (
    <div className="edit container">
      <div className={'breadcrumbWrap'}>
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigatorToList()}>热门专题</Breadcrumb.Item>
          <Breadcrumb.Item>配置内容</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className={styles.content}>
        <h3 className={classNames(styles.contentTitle, 'flex justify-between align-center')}>
          <div className="f18">配置内容</div>
          <Button type="primary" shape="round" className={styles.btn}>
            提交
          </Button>
        </h3>
        <Divider className={styles.divider} />

        <Form>
          <Form.List name={'list'}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ name, key, ...restFiled }, index) => (
                  <Form.Item key={key + name} className={styles.formBlock} {...restFiled}>
                    <div className={classNames('flex justify-between', styles.lineWrap)}>
                      <Space size={10}>
                        <span>序号{index + 1}</span>
                        <Form.Item label="展示模板">
                          <Select placeholder="请选择">
                            <Select.Option value={1}>海报</Select.Option>
                            <Select.Option value={2}>文章</Select.Option>
                          </Select>
                        </Form.Item>
                      </Space>
                      <Button type="primary" shape="round" ghost onClick={() => remove(index)}>
                        删除
                      </Button>
                    </div>

                    <Form.Item label="小贴士">
                      <Form.Item>
                        <Radio.Group>
                          <Radio value={0}>无</Radio>
                          <Radio value={1}>有</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item>
                        <Input></Input>
                      </Form.Item>
                    </Form.Item>
                  </Form.Item>
                ))}

                <Button onClick={() => add()}>添加</Button>
              </>
            )}
          </Form.List>
        </Form>
      </div>
    </div>
  );
};

export default HotSpecialEdit;
