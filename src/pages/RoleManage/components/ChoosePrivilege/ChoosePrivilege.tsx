import React, { useState, useEffect, useContext } from 'react';
import { Icon, NgModal } from 'src/components';
import { PricilegeItem } from 'src/pages/RoleManage/components';
import { queryCompanyFeature } from 'src/apis/company';
import { requesetGetRoleList } from 'src/apis/roleMange';
import { Context } from 'src/store';
import { Select } from 'antd';
import style from './style.module.less';

interface IChoosePrivilege {
  value?: { menuId: string; fullMenuId: string }[];
  onChange?: (menuList: { menuId: string; fullMenuId: string }[]) => void;
  readOnly?: boolean;
  roleType: 1 | 2 | 3;
}

const ChoosePrivilege: React.FC<IChoosePrivilege> = ({ value, onChange, readOnly, roleType }) => {
  const { currentCorpId: corpId } = useContext<{ currentCorpId: string }>(Context);
  const [modalParam, setModalParam] = useState<{ [key: string]: any }>({ visible: false });
  const [list, setList] = useState<any>([]);
  const [roleList, setRoleList] = useState<any[]>([]);
  const { Option } = Select;
  // 获取所有得权限列表
  const getAllMenuList = async () => {
    const res = await queryCompanyFeature({ corpId, roleType });
    if (res) {
      setList(res);
    }
  };
  // 复制权限
  const copyPrivilege = async () => {
    const res = await requesetGetRoleList({ roleType, pageSize: 999 });
    console.log(res);
    if (res) {
      setRoleList(res.list);
      setModalParam({ visible: true });
    }
  };
  const onCancel = () => {
    setModalParam({ visible: false });
  };
  const onOk = () => {
    onCancel();
  };
  const selectOnchange = (values: any) => {
    console.log(values);
  };
  useEffect(() => {
    corpId && getAllMenuList();
  }, [corpId]);
  return (
    <div className={style.wrap}>
      <div className={style.titleWrap}>
        <div className={style.title}>选择权限</div>
        <div className={style.copy} onClick={copyPrivilege}>
          <Icon name="a-icon_common_16_modelcharge" />
          复制已有权限
        </div>
      </div>
      <div className={style.privilege}>功能权限</div>
      <div className={style.menuList}>
        {list.map((item: any) => (
          <PricilegeItem value={value} onChange={onChange} key={item.menuName} item={item} disabled={readOnly} />
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
