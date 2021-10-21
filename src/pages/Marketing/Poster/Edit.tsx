import React from 'react';
import { Button, Form, Input } from 'antd';

import styles from './style.modules.less';

const PosterEdit: React.FC = () => {
  return (
    <div className={styles.pa20}>
      <Form labelCol={{ span: 3 }} wrapperCol={{ span: 8 }}>
        <Form.Item label="海报名称">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="文章ID">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="海报样式">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="分类">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="标签">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="营销话术">
          <Input.TextArea placeholder="待输入" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button type="primary" shape="round">
            添加
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default PosterEdit;
