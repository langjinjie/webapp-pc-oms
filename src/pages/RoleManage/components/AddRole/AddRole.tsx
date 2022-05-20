import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { ChoosePrivilege } from 'src/pages/RoleManage/components';
import { requestGetRoleDetail, requestAddOrEditRole } from 'src/apis/roleMange';
import { URLSearchParams, tree2Arry } from 'src/utils/base';
import style from './style.module.less';

interface IRoleType {
  roleType: 1 | 2 | 3;
}

const AddRole: React.FC<IRoleType> = ({ roleType }) => {
  const [readOnly, setReadOnly] = useState(false);
  const breadCrumbsPathList = ['后管端权限管理', 'B端权限管理', 'A端权限管理'];
  const history = useHistory();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Item } = Form;
  // 点击面包屑
  const clickBreadCrumbs = () => {
    history.goBack();
  };
  // 获取角色详情
  const getRoleDetail = async () => {
    const { type, roleId } = URLSearchParams(location.search);
    if (type === 'view') {
      setReadOnly(true);
    }
    if (roleId) {
      console.log('roleId', roleId);
      const res = await requestGetRoleDetail({ roleType, roleId });
      console.log(res);
      if (res) {
        console.log(tree2Arry(res.list).filter((filterItem) => filterItem.enable));
        form.setFieldsValue({
          ...res,
          menuList: tree2Arry(res.list)
            .filter((filterItem) => filterItem.enable)
            .map((mapItem) => ({ menuId: mapItem.menuId, fullMenuId: mapItem.fullMenuId }))
        });
      }
    }
  };
  const onFinish = async (values: any) => {
    console.log('values', values);
    const res = await requestAddOrEditRole({
      ...values,
      roleType,
      defaultDataScope: 1,
      roleId: URLSearchParams(location.search).roleId
    });
    console.log(res);
  };
  useEffect(() => {
    getRoleDetail();
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
        <Form form={form} className={style.form} onFinish={onFinish}>
          <Item name="roleName" className={style.formItem} label="角色名称：">
            <Input
              className={style.smallInput}
              showCount={true}
              maxLength={20}
              placeholder="请输入"
              readOnly={readOnly}
            />
          </Item>
          <Item name="desc" className={style.formItem} label="角色说明：">
            <Input
              className={style.longInput}
              showCount={true}
              maxLength={200}
              placeholder="请输入"
              readOnly={readOnly}
            />
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
            <ChoosePrivilege roleType={roleType} readOnly={readOnly} />
          </Item>
          {readOnly || (
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};
export default AddRole;
