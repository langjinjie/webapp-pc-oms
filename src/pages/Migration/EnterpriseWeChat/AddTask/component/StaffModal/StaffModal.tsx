import React, { useEffect, useState } from 'react';
import { Modal, Icon } from 'src/components';
import { Checkbox, Input, Pagination } from 'antd';
import { CheckboxValueType, CheckboxOptionType } from 'antd/lib/checkbox/Group';
import style from './style.module.less';
import classNames from 'classnames';

interface IStaffModalProps {
  visible: boolean;
  onClose: () => void;
  onChange?: (param: any[]) => void;
  showCheckbox?: boolean;
}

interface IStaffList {
  total: number;
  list: CheckboxOptionType[];
}

const StaffModal: React.FC<IStaffModalProps> = ({ visible, onClose, onChange, showCheckbox }) => {
  const [staffList, setStaffList] = useState<IStaffList>({ total: 0, list: [] });
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 18 });
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<any[]>([]);

  const CheckboxGroup = Checkbox.Group;
  // 获取执行人员列表
  const getStaffList = () => {
    const list = [
      { value: '1', label: '李斯（产研中心-研发部）' },
      { value: '2', label: '张珊（策略中心-策略部）' },
      { value: '3', label: '李斯（产研中心-研发部）' },
      { value: '4', label: '张珊（策略中心-策略部）' },
      { value: '5', label: '李斯（产研中心-研发部）' },
      { value: '6', label: '张珊（策略中心-策略部）' },
      { value: '7', label: '李斯（产研中心-研发部）' },
      { value: '8', label: '张珊（策略中心-策略部）' },
      { value: '9', label: '李斯（产研中心-研发部）' },
      { value: '10', label: '张珊（策略中心-策略部）' },
      { value: '11', label: '李斯（产研中心-研发部）' },
      { value: '12', label: '张珊（策略中心-策略部）' },
      { value: '13', label: '李斯（产研中心-研发部）' },
      { value: '14', label: '张珊（策略中心-策略部）' },
      { value: '15', label: '李斯（产研中心-研发部）' },
      { value: '16', label: '张珊（策略中心-策略部）' },
      { value: '17', label: '张珊（策略中心-策略部）' },
      { value: '18', label: '张珊（策略中心-策略部）' }
    ];
    setStaffList({ total: 66, list });
  };
  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? staffList.list.map((item) => item.value) : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  const onChangeHandle = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < staffList.list.length);
    setCheckAll(list.length === staffList.list.length);
  };
  const paginationOnchange = (pageNum: number) => {
    setPaginationParam((param) => ({ ...param, pageNum }));
  };
  const onOk = () => {
    onChange?.(checkedList);
    onClose();
  };
  useEffect(() => {
    getStaffList();
  }, [paginationParam]);
  return (
    <Modal
      width={680}
      centered
      className={style.wrap}
      onClose={onClose}
      visible={visible}
      title="选择执行人员"
      onOk={onOk}
    >
      <div className={style.inputWrp}>
        <Input className={style.input} placeholder="搜索成员" />
        <Icon className={style.inputIcon} name="icon_common_16_seach" />
      </div>
      <div className={style.checkAllWrap}>
        {showCheckbox && (
          <>
            <Checkbox
              className={style.checkAll}
              indeterminate={indeterminate}
              onChange={onCheckAllChange}
              checked={checkAll}
            >
              全选
            </Checkbox>
            {!!checkedList.length && (
              <>
                <span>已选{checkedList.length}人</span>
                <span>（共{staffList.total}人）</span>
              </>
            )}
          </>
        )}
      </div>
      <CheckboxGroup
        className={classNames(style.checkboxGroupWrap, { [style.hideCheckbox]: !showCheckbox })}
        options={staffList.list}
        value={checkedList}
        onChange={onChangeHandle}
      />
      <div className={style.paginationWrap}>
        <Pagination
          size="small"
          simple
          total={staffList.total}
          pageSize={paginationParam.pageSize}
          onChange={paginationOnchange}
          showSizeChanger={false}
        />
      </div>
    </Modal>
  );
};
export default StaffModal;
