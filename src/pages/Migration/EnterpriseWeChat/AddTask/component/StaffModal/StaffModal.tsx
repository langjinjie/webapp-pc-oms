import React, { useEffect, useState } from 'react';
import { Modal, Icon } from 'src/components';
import { Checkbox, Input, Pagination } from 'antd';
import { CheckboxValueType, CheckboxOptionType } from 'antd/lib/checkbox/Group';
import { queryTransferStaffList } from 'src/apis/migration';
import style from './style.module.less';
import classNames from 'classnames';

interface IStaffModalProps {
  value?: CheckboxValueType[];
  visible: boolean;
  onClose: () => void;
  onChange?: (param: any[]) => void;
  showCheckbox?: boolean;
}

interface IStaffList {
  total: number;
  list: CheckboxOptionType[];
}

const StaffModal: React.FC<IStaffModalProps> = ({ value, visible, onClose, onChange, showCheckbox }) => {
  const [staffList, setStaffList] = useState<IStaffList>({ total: 0, list: [] });
  const [name, setName] = useState('');
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 18 });
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);

  const CheckboxGroup = Checkbox.Group;
  // 获取执行人员列表
  const getStaffList = async () => {
    const res = await queryTransferStaffList({ name, ...paginationParam });
    if (res) {
      res.list = res.list.map((item: { staffId: string; staffName: string }) => ({
        value: item.staffId,
        label: item.staffName
      }));
      setStaffList(res);
    }
  };
  const inputOnchange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setName(value.target.value.trim());
  };
  // 输入框按下回车键
  const inputOnKeyDownHandle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPaginationParam((param) => ({ ...param }));
    }
  };
  const onCheckAllChange = (e: any) => {
    const currentList = staffList.list.map((item) => item.value);
    if (e.target.checked) {
      setCheckedList((checkedList) => Array.from(new Set([...checkedList, ...currentList])));
    } else {
      setCheckedList((checkedList) => checkedList.filter((item) => !currentList.includes(item)));
    }
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  const onChangeHandle = (list: CheckboxValueType[]) => {
    const unCheckedList = staffList.list.map((item) => item.value).filter((item) => !list.includes(item));
    setCheckedList((checkedList) =>
      Array.from(new Set([...checkedList, ...list])).filter((item) => !unCheckedList.includes(item))
    );
    setIndeterminate(!!list.length && list.length < staffList.list.length);
    setCheckAll(list.length === staffList.list.length);
  };
  const paginationOnchange = (pageNum: number) => {
    setPaginationParam((param) => ({ ...param, pageNum }));
  };
  // 关闭
  const onCloseHandle = () => {
    onClose();
  };
  const onOk = () => {
    onChange?.(checkedList);
    onClose();
  };
  useEffect(() => {
    if (value && value?.length) {
      setCheckedList(value);
    } else {
      setCheckedList([]);
      setCheckAll(false);
    }
  }, [value]);
  useEffect(() => {
    getStaffList();
  }, [paginationParam]);
  useEffect(() => {
    // 全选样式控制
    if (showCheckbox) {
      const checkAll = staffList.list.every((item) => checkedList.includes(item.value));
      const indeterminate = staffList.list.some((item) => checkedList.includes(item.value));
      setCheckAll(checkAll);
      setIndeterminate(!checkAll && indeterminate);
    }
  }, [staffList]);
  return (
    <Modal
      width={680}
      centered
      className={style.wrap}
      onClose={onCloseHandle}
      visible={visible}
      closable
      title="选择执行人员"
      onOk={onOk}
    >
      <div className={style.inputWrp}>
        <Input
          value={name}
          className={style.input}
          placeholder="搜索成员"
          onChange={inputOnchange}
          onKeyDown={inputOnKeyDownHandle}
        />
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
