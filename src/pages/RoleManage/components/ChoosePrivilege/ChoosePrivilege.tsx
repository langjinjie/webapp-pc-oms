import React, { useState, useEffect, useContext } from 'react';
import { Icon } from 'src/components';
import { PricilegeItem } from 'src/pages/RoleManage/components';
import { queryCompanyFeature } from 'src/apis/company';
import style from './style.module.less';
import { Context } from 'src/store';

interface IChoosePrivilege {
  value?: { menuId: string; fullMenuId: string }[];
  onChange?: (menuList: { menuId: string; fullMenuId: string }[]) => void;
  readOnly?: boolean;
  roleType: 1 | 2 | 3;
}

const ChoosePrivilege: React.FC<IChoosePrivilege> = ({ value, onChange, readOnly, roleType }) => {
  const { currentCorpId: corpId } = useContext<{ currentCorpId: string }>(Context);
  const [list, setList] = useState<any>([]);
  // 获取所有得权限列表
  const getAllMenuList = async () => {
    const res = await queryCompanyFeature({ corpId, roleType });
    console.log(res);
    if (res) {
      setList(res);
    }
  };
  useEffect(() => {
    corpId && getAllMenuList();
  }, [corpId]);
  return (
    <div className={style.wrap}>
      <div className={style.titleWrap}>
        <div className={style.title}>选择权限</div>
        <div className={style.copy}>
          <Icon name="a-icon_common_16_modelcharge" />
          复制已有权限
        </div>
      </div>
      <div className={style.privilege}>功能权限</div>
      <div className={style.menuList}>
        {list.map((item: any) => (
          <PricilegeItem value={value} onChange={onChange} key={item.menuName} item={item} readonly={readOnly} />
        ))}
      </div>
    </div>
  );
};
export default ChoosePrivilege;
