import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { ChoosePrivilege, DataRangeModal } from 'src/pages/RoleManage/components';
import { requestGetRoleDetail, requestAddOrEditRole, requestAddDefaultMenuList } from 'src/apis/roleMange';
import { urlSearchParams, tree2Arry } from 'src/utils/base';
import { roleTypeRouteList } from 'src/utils/commonData';

import style from './style.module.less';

interface IRoleType {
  roleType: 1 | 2 | 3; // 后管端 | B端 | A端
}

const AddRole: React.FC<IRoleType> = ({ roleType }) => {
  const [readOnly, setReadOnly] = useState(false);
  const [addMenu, setAddMenu] = useState(false); // 默认角色只能添加菜单功能
  const [rangeParam, setRangeParam] = useState<{ visible: boolean; groupId: string; defaultDataScope: 0 | 1 }>({
    visible: false,
    groupId: '',
    defaultDataScope: 1
  });
  const breadCrumbsPathList = ['后管端角色管理', 'B端角色管理', 'A端角色管理'];
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
    const { type, roleId } = urlSearchParams(location.search);
    setReadOnly(type === 'view');
    if (roleId) {
      const res = await requestGetRoleDetail({ roleType, roleId });
      if (res) {
        form.setFieldsValue({
          ...res,
          menuList: tree2Arry(res.list)
            .filter((filterItem) => filterItem.enable)
            .map((mapItem) => ({ menuId: mapItem.menuId, fullMenuId: mapItem.fullMenuId }))
        });
        setAddMenu(type === 'addMenu');
        setRangeParam((param) => ({ ...param, groupId: res.dataScopeGroup, defaultDataScope: res.defaultDataScope }));
      }
    }
  };
  // 设置B端管辖范围
  const setRangeHangle = () => {
    if (readOnly) return;
    setRangeParam((param) => ({ ...param, visible: true }));
  };
  // 取消
  const rangeOnCancel = () => {
    setRangeParam((param) => ({ ...param, visible: false }));
  };
  // 管辖范围onOk
  const rageScopeOnOk = (value: { groupId: string; isSet: boolean; defaultDataScope: 0 | 1 }) => {
    setRangeParam((param) => ({
      ...param,
      visible: false,
      groupId: value.groupId,
      defaultDataScope: value.defaultDataScope
    }));
  };
  const onFinish = async (values: any) => {
    const res = await (addMenu ? requestAddDefaultMenuList : requestAddOrEditRole)({
      ...values,
      roleType,
      defaultDataScope: rangeParam.defaultDataScope,
      dataScopeGroup: rangeParam.groupId || '',
      roleId: urlSearchParams(location.search).roleId
    });
    if (res) {
      message.success(urlSearchParams(location.search).roleId ? '角色修改成功' : '角色新增成功');
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
          {urlSearchParams(location.search).type
            ? urlSearchParams(location.search).type === 'view'
              ? '查看'
              : '编辑'
            : '新增'}
          角色
        </span>
      </div>
      <div className={style.add}>
        <div className={style.title}>
          {urlSearchParams(location.search).type
            ? urlSearchParams(location.search).type === 'view'
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
              {roleType !== 2
                ? (
                <Input value={'全部组织'} disabled className={style.longInput} placeholder="请输入" />
                  )
                : (
                <div className={style.rangeWrap}>
                  <div className={style.scope}>
                    {rangeParam.groupId
                      ? '已配置管辖范围'
                      : rangeParam.defaultDataScope
                        ? '全部下级'
                        : '已关闭管辖范围'}
                  </div>
                  <Button className={style.setScropBtn} onClick={setRangeHangle}>
                    {rangeParam.groupId ? '修改' : '添加'}
                  </Button>
                  <DataRangeModal {...rangeParam} onOk={rageScopeOnOk} onCancel={rangeOnCancel} />
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
