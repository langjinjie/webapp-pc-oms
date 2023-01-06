import { Button, Card, Form, Input } from 'antd';
import React, { useContext, useState } from 'react';
import { connectionTransform } from 'src/apis/marketing';
import { copy } from 'tenacity-tools';
import { Context } from 'src/store/index';
const Connection: React.FC = () => {
  const [shortUrl, setShortUrl] = useState('');
  const { currentCorpId } = useContext(Context);

  const onFinish = async (values: any) => {
    console.log(values);
    const res = await connectionTransform({ ...values, base64encoded: 0, corpId: currentCorpId });
    console.log(res);
    setShortUrl(res);
  };
  return (
    <div className="container">
      <Card title="长链接转化短链接" bordered={false}>
        <Form className="edit" style={{ width: '600px' }} onFinish={onFinish}>
          <Form.Item label="链接地址" name={'url'} rules={[{ required: true }]}>
            <Input.TextArea placeholder="请输入"></Input.TextArea>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" style={{ marginLeft: '240px', width: '128px' }} type="primary" shape="round">
              确认转化
            </Button>
          </Form.Item>
          <Form.Item label="转换结果" rules={[{ required: true }]}>
            <Input.TextArea value={shortUrl}></Input.TextArea>
          </Form.Item>
          <Form.Item>
            <Button
              disabled={!shortUrl}
              onClick={() => copy(shortUrl)}
              style={{ marginLeft: '240px', width: '128px' }}
              type="primary"
              shape="round"
            >
              一键复制
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Connection;
