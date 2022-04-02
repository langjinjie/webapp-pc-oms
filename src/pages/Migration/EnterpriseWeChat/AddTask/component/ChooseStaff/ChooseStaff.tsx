import React, { useEffect, useState } from 'react';
import { Icon } from 'src/components';
import { StaffModal } from 'src/pages/Migration/EnterpriseWeChat/AddTask/component';
import style from './style.module.less';

interface IChoosedStaffListProps {
  value?: any[];
  onChange?: (value: any[]) => void;
}

const ChoosedStaffList: React.FC<IChoosedStaffListProps> = ({ value, onChange }) => {
  const [selectedStaff, setSelectedStaff] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  // 点击添加按钮
  const clickAddHandle = () => {
    setVisible(true);
  };
  const onChangeHandle = (staffList: any[]) => {
    onChange?.(staffList);
  };
  useEffect(() => {
    console.log(value);
    setSelectedStaff(value || []);
  }, [value]);
  return (
    <div className={style.addStaffWrap}>
      <Icon className={style.addStaff} name="xinjian" onClick={clickAddHandle} />
      {!selectedStaff.length || (
        <div className={style.selected}>
          已选中{selectedStaff.length}人
          <Icon className={style.clearSelected} name="biaoqian_quxiao" onClick={() => onChangeHandle([])} />
        </div>
      )}
      <StaffModal visible={visible} onClose={() => setVisible(false)} onChange={onChangeHandle} />
    </div>
  );
};
export default ChoosedStaffList;
