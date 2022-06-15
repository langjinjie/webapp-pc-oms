import React, { useContext, useEffect, useState } from 'react';
import { Icon } from 'src/components';
import { StaffModal } from 'src/pages/Migration/PersonalWeChat/AddTask/component';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import style from './style.module.less';
import { Context } from 'src/store';

interface IChoosedStaffListProps {
  value?: CheckboxValueType[];
  onChange?: (value: any[]) => void;
}

const ChoosedStaffList: React.FC<IChoosedStaffListProps> = ({ value, onChange }) => {
  const { setConfirmModalParam } = useContext(Context);
  const [selectedStaff, setSelectedStaff] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);
  // 点击添加按钮
  const clickAddHandle = () => {
    setVisible(true);
  };
  const onChangeHandle = (staffList: any[]) => {
    setConfirmModalParam({
      visible: true,
      title: '温馨提示',
      tips: '是否需要全部删除已选中的执行人员？',
      onOk () {
        onChange?.(staffList);
        setConfirmModalParam({ visible: false });
      }
    });
  };
  useEffect(() => {
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
      <StaffModal value={value} visible={visible} showCheckbox onClose={() => setVisible(false)} onChange={onChange} />
    </div>
  );
};
export default ChoosedStaffList;
