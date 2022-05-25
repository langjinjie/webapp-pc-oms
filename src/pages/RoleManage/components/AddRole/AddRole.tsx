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
  roleType: 1 | 2 | 3; // 后管端 | B端 | A端
}

const AddRole: React.FC<IRoleType> = ({ roleType }) => {
  const [readOnly, setReadOnly] = useState(false);
  const [addMenu, setAddMenu] = useState(false); // 默认角色只能添加菜单功能
  const [rangeParam, setRangeParam] = useState<{ visible: boolean; groupId: string }>({ visible: false, groupId: '' });
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
        setRangeParam((param) => ({ ...param, groupId: res.dataScopeGroup }));
      }
    }
  };
  // 设置B端管辖范围
  const setRangeHangle = () => {
    setRangeParam((param) => ({ ...param, visible: true }));
  };
  // 取消
  const rangeOnCancel = () => {
    setRangeParam((param) => ({ ...param, visible: false }));
  };
  // 管辖范围onOk
  const rageScopeOnOk = (value: { isBatch?: boolean; groupId: string; isSet: boolean }) => {
    setRangeParam((param) => ({ ...param, visible: false, groupId: value.groupId }));
  };
  const onFinish = async (values: any) => {
    console.log('values', values);
    const res = await (addMenu ? requestAddDefaultMenuList : requestAddOrEditRole)({
      ...values,
      menuList: values.menuList?.map((mapItem: any) => ({ menuId: mapItem.menuId, fullMenuId: mapItem.fullMenuId })),
      roleType,
      defaultDataScope: roleType === 2 ? (rangeParam.groupId ? 1 : 0) : 1, // A端后管端默认为1 B端需要配置
      dataScopeGroup: roleType === 2 ? rangeParam.groupId : roleType === 1 ? '全部组织' : undefined, // A端不需要该字段 后管端为全部组织
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
        <span className={style.current}>
          {URLSearchParams(location.search).type
            ? URLSearchParams(location.search).type === 'view'
              ? '查看'
              : '编辑'
            : '新增'}
          角色
        </span>
      </div>
      <div className={style.add}>
        <div className={style.title}>
          {URLSearchParams(location.search).type
            ? URLSearchParams(location.search).type === 'view'
              ? '查看'
              : '编辑'
            : '新增'}
          角色
        </div>
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
          {roleType !== 3 && (
            <Item className={style.formItem} label="管辖范围：">
              {roleType !== 2 ? (
                <Input value={'全部组织'} disabled className={style.longInput} placeholder="请输入" />
              ) : (
                <div className={style.rangeWrap}>
                  <div className={style.scope}>{rangeParam.groupId ? '已配置管辖范围' : '未配置管辖范围'}</div>
                  <Button className={style.setScropBtn} onClick={setRangeHangle}>
                    {rangeParam.groupId ? '修改' : '添加'}
                  </Button>
                  <SetUserRight
                    groupId={rangeParam.groupId}
                    visible={rangeParam.visible}
                    onOk={rageScopeOnOk}
                    onCancel={rangeOnCancel}
                  />
                </div>
              )}
            </Item>
          )}
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
