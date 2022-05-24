import { Breadcrumb, Button, Form, Input, InputNumber, message, Radio, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { addOrEditMenu } from 'src/apis/orgManage';
import { btnTypes, MenuProps, systemList } from './Config';

interface S {
  sysType: number;
  type: string;
  pathList?: MenuProps[];
}
const MenuEdit: React.FC<RouteComponentProps<any, any, S>> = ({ history, location }) => {
  const [menu, setMenu] = useState<MenuProps>();
  const [formParams, setFormParams] = useState<MenuProps>();
  const [menuForm] = Form.useForm();
  useEffect(() => {
    const { sysType, type, pathList } = location.state;
    setMenu((menu) => ({
      ...menu!,
      sysType,
      pathList,
      writeType: type,
      parentId:
        type === 'add' && pathList && pathList.length > 0
          ? pathList[pathList.length - 1].menuId
          : type === 'edit' && pathList && pathList.length > 1
            ? pathList[pathList.length - 2].menuId
            : '',
      parentTitle:
        type === 'add' && pathList && pathList?.length > 0
          ? pathList.map((item) => item.menuName).join(' / ')
          : type === 'edit' && pathList && pathList.length > 1
            ? pathList
              .slice(0, pathList.length - 1)
              .map((item) => item.menuName)
              .join(' / ')
            : '一级目录'
    }));
    if (type === 'edit') {
      const currentItem = pathList?.slice(pathList.length - 1)[0];
      console.log(currentItem);
      setFormParams((formParams) => ({ ...formParams!, ...currentItem }));
      menuForm.setFieldsValue({
        ...currentItem
      });
    }
  }, []);

  const navigatorToList = () => {
    history.push('/menu');
  };

  const onValuesChange = (changeValues: any, values: any) => {
    const { menuType } = values;
    setFormParams((formParams) => ({ ...formParams!, menuType }));
  };

  const onFinish = async (values: any) => {
    console.log(values, menu);
    const { menuType, menuName, menuIcon, path, buttonType, sortId, menuCode } = values;
    const res = await addOrEditMenu({
      sysType: menu?.sysType,
      menuId: menu?.writeType === 'add' ? null : formParams?.menuId,
      menuType,
      menuName,
      menuIcon,
      path,
      buttonType,
      menuCode: menuCode,
      parentId: menu?.parentId,
      sortId
    });
    if (res) {
      message.success('保存成功', 1, () => {
        history.replace('/menu?menuId=' + (menu?.parentId || '0'));
      });
    }
  };

  const onCancel = () => {
    history.replace('/menu');
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
        <Form
          wrapperCol={{ span: 8 }}
          className="edit"
          form={menuForm}
          onFinish={onFinish}
          initialValues={formParams}
          onValuesChange={onValuesChange}
        >
          <Form.Item label="系统端">
            {systemList.filter((system) => system.value === menu?.sysType)[0]?.label}
          </Form.Item>

          <Form.Item label="菜单类型" name={'menuType'} rules={[{ required: true }]}>
            <Radio.Group disabled={menu?.writeType === 'edit'}>
              <Radio value={1}>菜单</Radio>
              <Radio value={2}>按钮</Radio>
            </Radio.Group>
          </Form.Item>
          {formParams?.menuType === 2 && (
            <Form.Item label="按钮类型" name={'buttonType'} rules={[{ required: true }]}>
              <Radio.Group>
                {btnTypes.map((btn) => (
                  <Radio value={btn.value} key={btn.value}>
                    {btn.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          )}
          <Form.Item label={formParams?.menuType === 2 ? '按钮级别' : '菜单级别'}>{menu?.parentTitle}</Form.Item>
          <Form.Item
            label={formParams?.menuType === 2 ? '按钮名称' : '菜单名称'}
            name={'menuName'}
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入" className="width480" maxLength={30} />
          </Form.Item>
          <Form.Item label="路由地址" name={'path'}>
            <Input placeholder="请输入" className="width480" maxLength={60} />
          </Form.Item>

          {formParams?.menuType !== 2 && (
            <>
              <Form.Item label="菜单图标" name={'menuIcon'}>
                <Input placeholder="请输入" className="width480" />
              </Form.Item>
              <Form.Item label="排序" extra="序号越低，排序越靠前" name={'sortId'}>
                <InputNumber controls={false} min={0} placeholder="请输入" />
              </Form.Item>
              <Form.Item label="菜单编码权限标识" name={'menuCode'}>
                <Input placeholder="请输入" className="width480" maxLength={60} />
              </Form.Item>
            </>
          )}

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space size={40} className="formFooter">
              <Button shape="round" onClick={() => onCancel()}>
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
