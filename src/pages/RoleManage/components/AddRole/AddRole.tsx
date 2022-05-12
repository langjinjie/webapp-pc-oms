import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { ChoosePrivilege } from 'src/pages/RoleManage/components';
import style from './style.module.less';

interface IRoleType {
  roleType: 1 | 2 | 3;
}

const AddRole: React.FC<IRoleType> = ({ roleType }) => {
  const breadCrumbsPathList = ['后管端权限管理', 'B端权限管理', 'A端权限管理'];
  const history = useHistory();
  const [form] = Form.useForm();
  const { Item } = Form;
  // 点击面包屑
  const clickBreadCrumbs = () => {
    history.goBack();
  };
  useEffect(() => {
    console.log('roleType', roleType);
    // 设置
  }, []);
  return (
    <div className={style.wrap}>
      <div className={style.breadcrumbs}>
        当前位置：
        <span className={style.goBack} onClick={clickBreadCrumbs}>
          {breadCrumbsPathList[roleType - 1]}
        </span>
        <span className={style.line}>/</span>
        <span className={style.current}>新增角色</span>
      </div>
      <div className={style.add}>
        <div className={style.title}>新增角色</div>
        <Form form={form} className={style.form}>
          <Item name="roleName" className={style.formItem} label="角色名称：">
            <Input className={style.smallInput} showCount={true} maxLength={20} placeholder="请输入" />
          </Item>
          <Item name="desc" className={style.formItem} label="角色说明：">
            <Input className={style.longInput} showCount={true} maxLength={200} placeholder="请输入" />
          </Item>
          <Item
            name="dataScopeGroup"
            className={style.formItem}
            label="管辖范围："
            initialValue={roleType === 1 ? '全部组织' : '全部下级'}
          >
            <Input disabled className={style.longInput} placeholder="请输入" />
          </Item>
          <Item name={'menuList'}>
            <ChoosePrivilege roleType={roleType} />
          </Item>
          <Button type="primary" onClick={() => console.log(form.getFieldsValue())}>
            保存
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default AddRole;
