import { Breadcrumb, Button, Form, Input, InputNumber, Radio, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { btnTypes, MenuProps, systemList } from './Config';

interface S {
  sysType: number;
  type: string;
  pathList?: MenuProps[];
}
const MenuEdit: React.FC<RouteComponentProps<any, any, S>> = ({ history, location }) => {
  const [menu, setMenu] = useState<MenuProps>();
  useEffect(() => {
    const { sysType, type, pathList } = location.state;
    console.log(sysType, type, pathList);
    console.log(location);
    setMenu((menu) => ({
      ...menu!,
      sysType,
      pathList,
      writeType: type
    }));
  }, []);
  const [formParams, setFormParams] = useState({
    menuType: 1,
    menuName: ''
  });

  const navigatorToList = () => {
    console.log('jump');
    history.push('/menu');
  };

  useEffect(() => {
    setFormParams(formParams);
  }, []);

  const onValuesChange = (changeValues: any, values: any) => {
    const { menuType } = values;
    setFormParams((formParams) => ({ ...formParams, menuType }));
  };

  return (
    <div className="container">
      <div className="breadcrumbWrap">
        <span>当前位置：</span>
        <Breadcrumb>
          <Breadcrumb.Item className="pointer" onClick={navigatorToList}>
            系统菜单管理
          </Breadcrumb.Item>
          <Breadcrumb.Item>添加菜单/按钮</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="mt30">
        <Form wrapperCol={{ span: 8 }} className="edit" initialValues={formParams} onValuesChange={onValuesChange}>
          <Form.Item label="系统端">
            {systemList.filter((system) => system.value === menu?.sysType)[0]?.label}
          </Form.Item>

          <Form.Item label="菜单类型" name={'menuType'}>
            <Radio.Group>
              <Radio value={1}>菜单</Radio>
              <Radio value={2}>按钮</Radio>
            </Radio.Group>
          </Form.Item>
          {formParams.menuType === 2 && (
            <Form.Item label="按钮类型" name={'buttonType'}>
              <Radio.Group>
                {btnTypes.map((btn) => (
                  <Radio value={btn.value} key={btn.value}>
                    {btn.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          )}
          <Form.Item label="菜单级别">{menu?.pathList?.length || '一级菜单'}</Form.Item>
          <Form.Item label="菜单名称" name={'menuName'}>
            <Input placeholder="请输入" className="width480" />
          </Form.Item>
          <Form.Item label="路由地址" name={'path'}>
            <Input placeholder="请输入" className="width480" />
          </Form.Item>
          <Form.Item label="菜单图标" name={'menuIcon'}>
            <Input placeholder="请输入" className="width480" />
          </Form.Item>
          <Form.Item label="排序" extra="序号越低，排序越靠前" name={'sortId'}>
            <InputNumber controls={false} min={0} placeholder="请输入" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space size={40} className="formFooter">
              <Button shape="round" htmlType="reset">
                取消
              </Button>
              <Button shape="round" htmlType="submit" type="primary">
                确认
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default MenuEdit;
