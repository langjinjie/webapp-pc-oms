import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { getQueryParam } from 'lester-tools';
import { SHA256 } from 'crypto-js';
import { Context } from 'src/store';
import { login, queryUserInfo } from 'src/apis';
import style from './style.module.less';

const { Password } = Input;
const { Item } = Form;

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { setUserInfo } = useContext(Context);

  const onSubmit = async ({ userName, password }: any) => {
    // @ts-ignore
    const res = await login({ userName: window.btoa(userName), password: window.btoa(SHA256(password)) });
    if (res) {
      const redirectUrl: string = getQueryParam('redirectUrl');
      if (redirectUrl) {
        window.location.replace(redirectUrl);
      } else {
        history.push('/index');
        const resInfo: any = (await queryUserInfo()) || {};
        setUserInfo(resInfo);
      }
    }
  };

  return (
    <div className={style.loginBg}>
      <h3 className={style.header}>
        <div className={style.brand} />
      </h3>
      <div className={style.loginWrap}>
        <h3 className={style.title}>账号登录</h3>
        <Form onFinish={onSubmit}>
          <Item name="userName" rules={[{ required: true, message: '请输入账号' }]}>
            <Input placeholder="账号" />
          </Item>
          <Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Password
              placeholder="密码"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Item>
          <Item>
            <Button type="primary" shape="round" htmlType="submit">
              登录
            </Button>
          </Item>
        </Form>
      </div>
      <footer className={style.footer}>
        <div className={style.copyright}>
          本服务由年高提供。年高，面向金融领域提供产业应用方案。
          <br /> Copyright @ 2021 Niangao All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default Login;
