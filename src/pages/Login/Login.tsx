import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
// import { getQueryParam } from 'tenacity-tools';
import md5 from 'js-md5';
import { Context } from 'src/store';
import { chooseInst, login, queryUserInfo, requestGetMstatus } from 'src/apis';
import style from './style.module.less';
import { TOKEN_KEY } from 'src/utils/config';
import Update from '../Update/Update';

const { Password } = Input;
const { Item } = Form;

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const { setUserInfo, setIsMainCorp, setCurrentCorpId } = useContext(Context);
  const [updating, setUpdating] = useState(false);

  const onSubmit = async ({ userName, password }: any) => {
    // @ts-ignore
    const res = await login({ userName, password: md5(password).slice(8, 24) });
    if (res) {
      const { token } = res;
      window.localStorage.setItem(TOKEN_KEY, token);
      window.localStorage.setItem('envName', res.env);

      const resInfo = (await queryUserInfo()) || {};
      setUserInfo(resInfo);
      if (resInfo.desc) {
        setUserInfo({ ...resInfo, isMainCorp: 0 });
        const res: any = await chooseInst({ corpId: resInfo.desc });
        if (res) {
          localStorage.setItem(TOKEN_KEY, res);
          sessionStorage.removeItem('tagOptions');
          history.push('/index');
        }
      } else {
        history.push('/chooseInst');
        const resInfo: any = (await queryUserInfo()) || {};
        setUserInfo(resInfo);
        setCurrentCorpId(resInfo.corpId);
        setIsMainCorp(resInfo.isMainCorp === 1);
      }
    }
  };

  // 获取系统状态是否处于更新中
  const getMStatus = async () => {
    // 判断是否处于系统更新中
    const updateRes = await requestGetMstatus();
    // 999 维护中
    if (updateRes === '999') {
      setUpdating(true);
    }
  };

  useEffect(() => {
    getMStatus();
  }, []);

  return (
    <>
      {updating || (
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
              本服务由腾银提供。腾银，面向金融领域提供产业应用方案。
              <br />
              Copyright @ 2021 Tencent-TengYin All Rights Reserved
            </div>
          </footer>
        </div>
      )}
      {updating && <Update />}
    </>
  );
};

export default Login;
