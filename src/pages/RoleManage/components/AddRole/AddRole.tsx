import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { ChoosePrivilege } from 'src/pages/RoleManage/components';
import { requestGetRoleDetail, requestAddOrEditRole, requestAddDefaultMenuList } from 'src/apis/roleMange';
import { URLSearchParams, tree2Arry } from 'src/utils/base';
import { roleTypeRouteList } from 'src/utils/commonData';
import { SetUserRight } from 'src/pages/Marketing/Components/ModalSetUserRight/SetUserRight';
import style from './style.module.less';

interface IRoleType {
  roleType: 1 | 2 | 3;
}

const AddRole: React.FC<IRoleType> = ({ roleType }) => {
  const [readOnly, setReadOnly] = useState(false);
  const [addMenu, setAddMenu] = useState(false); // 默认角色只能添加菜单功能
  const breadCrumbsPathList = ['后管端权限管理', 'B端权限管理', 'A端权限管理'];
  const history = useHistory();
  const location = useLocation();
  const [form] = Form.useForm();
  const { Item } = Form;
  // 点击面包屑
  const clickBreadCrumbs = () => {
    history.push(roleTypeRouteList[roleType - 1].replace('/add', ''));
  };
  // 获取角色详情
  const getRoleDetail = async () => {
    const { type, roleId } = URLSearchParams(location.search);
    setReadOnly(type === 'view');
    if (roleId) {
      const res = await requestGetRoleDetail({ roleType, roleId });
      if (res) {
        form.setFieldsValue({
          ...res,
          dataScopeGroup: res.dataScopeGroup || roleType === 1 ? '全部组织' : '全部下级',
          menuList: tree2Arry(res.list)
            .filter((filterItem) => filterItem.enable)
            .map((mapItem) => ({ menuId: mapItem.menuId, fullMenuId: mapItem.fullMenuId }))
        });
        setAddMenu(type === 'addMenu');
      }
    }
  };
  const onFinish = async (values: any) => {
    const res = await (addMenu ? requestAddDefaultMenuList : requestAddOrEditRole)({
      ...values,
      roleType,
      defaultDataScope: 1,
      roleId: URLSearchParams(location.search).roleId
    });
    if (res) {
      message.success(URLSearchParams(location.search).roleId ? '角色修改成功' : '角色新增成功');
      history.push(roleTypeRouteList[roleType - 1].replace('/add', ''));
    }
  };
  const onReset = () => {
    history.push(roleTypeRouteList[roleType - 1].replace('/add', ''));
  };
  useEffect(() => {
    getRoleDetail();
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
        <Form form={form} className={style.form} onFinish={onFinish} onReset={onReset}>
          <Item name="roleName" className={style.formItem} label="角色名称：">
            <Input
              className={style.smallInput}
              showCount={true}
              maxLength={20}
              placeholder="请输入"
              readOnly={readOnly || addMenu}
            />
          </Item>
          <Item name="desc" className={style.formItem} label="角色说明：">
            <Input
              className={style.longInput}
              showCount={true}
              maxLength={200}
              placeholder="请输入"
              readOnly={readOnly || addMenu}
            />
          </Item>
          <Item
            name="dataScopeGroup"
            className={style.formItem}
            label="管辖范围："
            {...(roleType !== 2 && { initialValue: roleType === 1 ? '全部组织' : '全部下级' })}
          >
            {roleType !== 2
              ? (
              <Input disabled className={style.longInput} placeholder="请输入" />
                )
              : (
              <SetUserRight onOk={() => console.log(1)} />
                )}
          </Item>
          <Item name={'menuList'}>
            <ChoosePrivilege roleType={roleType} readOnly={readOnly} addMenu={addMenu} />
          </Item>
          {readOnly || (
            <>
              <Button className={style.submit} type="primary" htmlType="submit">
                保存
              </Button>
              <Button className={style.cancel} htmlType="reset">
                取消
              </Button>
            </>
          )}
        </Form>
      </div>
    </div>
  );
};
export default AddRole;
