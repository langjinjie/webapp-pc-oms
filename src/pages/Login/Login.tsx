import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
// import { getQueryParam } from 'tenacity-tools';
import md5 from 'js-md5';
import { Context } from 'src/store';
import { login, queryUserInfo } from 'src/apis';
import style from './style.module.less';

const { Password } = Input;
const { Item } = Form;

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { setUserInfo, setIsMainCorp, setCurrentCorpId } = useContext(Context);

  const onSubmit = async ({ userName, password }: any) => {
    // @ts-ignore
    const res = await login({ userName, password: md5(password).slice(8, 24) });
    if (res) {
      window.localStorage.setItem('envName', res.env);
      history.push('/chooseInst');
      const resInfo: any = (await queryUserInfo()) || {};
      setUserInfo(resInfo);
      setIsMainCorp(resInfo.isMainCorp === 1);
      setCurrentCorpId(resInfo.corpId);
      /* const redirectUrl: string = getQueryParam('redirectUrl');
      if (redirectUrl) {
        window.location.replace(redirectUrl);
      } else {
        history.push('/chooseInst');
        const resInfo: any = (await queryUserInfo()) || {};
        setUserInfo(resInfo);
        setIsMainCorp(resInfo.isMainCorp === 1);
        setCurrentCorpId(resInfo.corpId);
      } */
    }
  };

  return (
    <div className={style.loginBg}>
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
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Item>
        </Form>
      </div>
      <footer className={style.footer}>
        <div className={style.copyright}>
          本服务由年高提供。年高，面向金融领域提供产业应用方案。
          <br />
          Copyright @ 2021 Niangao All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default Login;
