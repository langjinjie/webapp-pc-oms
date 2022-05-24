import React, { useState, useEffect, useContext } from 'react';
import { Icon, NgModal } from 'src/components';
import { PricilegeItem } from 'src/pages/RoleManage/components';
import { queryCompanyFeature } from 'src/apis/company';
import { requesetGetRoleList, requestGetRoleDetail } from 'src/apis/roleMange';
import { Context } from 'src/store';
import { message, Select } from 'antd';
import { tree2Arry } from 'src/utils/base';
import style from './style.module.less';

interface IChoosePrivilege {
  value?: { menuId: string; fullMenuId: string }[];
  onChange?: (menuList: { menuId: string; fullMenuId: string }[]) => void;
  readOnly?: boolean;
  addMenu?: boolean;
  roleType: 1 | 2 | 3;
}

const ChoosePrivilege: React.FC<IChoosePrivilege> = ({ value, onChange, readOnly, roleType, addMenu }) => {
  const { currentCorpId: corpId } = useContext<{ currentCorpId: string }>(Context);
  const [modalParam, setModalParam] = useState<{ [key: string]: any }>({ visible: false });
  const [list, setList] = useState<any>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const [roleId, setRoleId] = useState('');
  const { Option } = Select;
  // 获取所有得权限列表
  const getAllMenuList = async () => {
    const res = await queryCompanyFeature({ corpId, roleType });
    if (res) {
      setList(res);
    }
  };
  // 获取角色列表
  const copyPrivilege = async () => {
    if (readOnly) return;
    const res = await requesetGetRoleList({ roleType, pageSize: 999 });
    if (res) {
      setRoleList(res.list);
      setModalParam({ visible: true });
    }
  };
  const onCancel = () => {
    setModalParam({ visible: false });
  };
  // 复制已有权限
  const onOk = async () => {
    const res = await requestGetRoleDetail({ roleType, roleId });
    if (res) {
      const menuList = tree2Arry(res.list)
        .filter((filterItem) => filterItem.enable)
        .map((mapItem) => ({ menuId: mapItem.menuId, fullMenuId: mapItem.fullMenuId }));
      onChange?.(menuList);
      onCancel();
      message.success('权限复制成功');
    }
  };
  const selectOnchange = (value: string) => {
    setRoleId(value);
  };
  useEffect(() => {
    corpId && getAllMenuList();
  }, [corpId]);
  useEffect(() => {
    if (addMenu) {
      tree2Arry(list).forEach((item) => {
        if (value?.map((mapItem) => mapItem.menuId).includes(item.menuId)) {
          item.disabled = true;
        }
      });
      setList((list: any) => [...list]);
    }
  }, [addMenu]);
  return (
    <div className={style.wrap}>
      <div className={style.titleWrap}>
        <div className={style.title}>选择权限</div>
        {addMenu || (
          <div className={style.copy} onClick={copyPrivilege}>
            <Icon name="a-icon_common_16_modelcharge" />
            复制已有权限
          </div>
        )}
      </div>
      <div className={style.privilege}>功能权限</div>
      <div className={style.menuList}>
        {list.map((item: any) => (
          <PricilegeItem
            value={value}
            onChange={onChange}
            key={item.menuName}
            item={item}
            disabled={readOnly}
            addMenu={addMenu}
          />
        ))}
      </div>
      <NgModal
        className={style.modalWrap}
        title="复制已有角色权限"
        visible={modalParam.visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <Select className={style.select} onChange={selectOnchange}>
          {roleList.map((item) => (
            <Option key={item.roleId} value={item.roleId}>
              {item.roleName}
            </Option>
          ))}
        </Select>
      </NgModal>
    </div>
  );
};
export default ChoosePrivilege;
