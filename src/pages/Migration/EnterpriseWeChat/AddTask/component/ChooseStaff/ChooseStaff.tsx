import React, { useEffect, useState } from 'react';
import { Icon } from 'src/components';
import { StaffModal, TaskDetail } from 'src/pages/Migration/EnterpriseWeChat/AddTask/component';
import style from './style.module.less';

interface IChoosedStaffListProps {
  value?: any[];
  onChange?: (value: any[]) => void;
}

const ChoosedStaffList: React.FC<IChoosedStaffListProps> = ({ value, onChange }) => {
  const [selectedStaff, setSelectedStaff] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  // 点击添加按钮
  const clickAddHandle = () => {
    setVisible(true);
  };
  const onChangeHandle = (staffList: any[]) => {
    onChange?.(staffList);
  };
  // 查看任务明细
  const clickTaskDetail = () => {
    setDetailVisible(true);
  };
  useEffect(() => {
    console.log(value);
    setSelectedStaff(value || []);
  }, [value]);
  return (
    <div className={style.addStaffWrap}>
      <Icon className={style.addStaff} name="xinjian" onClick={clickAddHandle} />
      {!selectedStaff.length || (
        <div className={style.selected} onClick={clickTaskDetail}>
          已选中{selectedStaff.length}人
          <Icon className={style.clearSelected} name="biaoqian_quxiao" onClick={() => onChangeHandle([])} />
        </div>
      )}
      <StaffModal visible={visible} showCheckbox onClose={() => setVisible(false)} onChange={onChangeHandle} />
      <TaskDetail visible={detailVisible} onClose={() => setDetailVisible(false)} />
    </div>
  );
};
export default ChoosedStaffList;
