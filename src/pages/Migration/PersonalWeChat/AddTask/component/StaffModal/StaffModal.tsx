import React, { Key, useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Modal, Icon, Empty } from 'src/components';
import { Checkbox, Input, Pagination } from 'antd';
import { CheckboxValueType, CheckboxOptionType } from 'antd/lib/checkbox/Group';
import { requestGetWechatTransferStaffScope } from 'src/apis/migration';
import { debounce } from 'src/utils/base';
import style from './style.module.less';
import classNames from 'classnames';

interface IStaffModalProps {
  value?: CheckboxValueType[];
  visible: boolean;
  onClose: () => void;
  onChange?: (param: any[]) => void;
  showCheckbox?: boolean;
  setBtnDisabled?: Dispatch<SetStateAction<boolean>>;
}

interface IStaffList {
  total: number;
  list: CheckboxOptionType[];
}

interface IStaffInfo {
  staffId: string;
  staffName: string;
  deptName: string;
  targetStaffId: string;
}
// let timerId: NodeJS.Timeout;

const StaffModal: React.FC<IStaffModalProps> = ({
  value,
  visible,
  onClose,
  onChange,
  showCheckbox,
  setBtnDisabled
}) => {
  const [staffList, setStaffList] = useState<IStaffList>({ total: 0, list: [] });
  const [name, setName] = useState('');
  const [paginationParam, setPaginationParam] = useState({ pageNum: 1, pageSize: 18 });
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);

  const CheckboxGroup = Checkbox.Group;
  // 获取执行人员列表
  const getStaffList = async () => {
    const res = await requestGetWechatTransferStaffScope({ name, ...paginationParam });
    if (res) {
      const list = res.list.map((item: IStaffInfo) => {
        return {
          value: item.staffId,
          label: `${item.staffName}${item.deptName ? '（' + item.deptName + '）' : ''}`
        };
      });
      setBtnDisabled?.(!list.length);
      setStaffList({ total: res.total, list });
    }
  };
  const inputOnchange = (value: React.ChangeEvent<HTMLInputElement>) => {
    setName(value.target.value.trim());
    setPaginationParam((param) => ({ ...param, pageNum: 1 }));
  };
  const searchStaffList = debounce(inputOnchange, 300);
  // 全选
  const onCheckAllChange = (e: any) => {
    const currentList = staffList.list.filter((filterItem) => !filterItem.disabled).map((item) => item.value);
    if (e.target.checked) {
      setCheckedList((checkedList) => Array.from(new Set([...checkedList, ...currentList])));
    } else {
      setCheckedList((checkedList) => checkedList.filter((item) => !currentList.includes(item)));
    }
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  // 选中
  const onChangeHandle = (list: CheckboxValueType[]) => {
    const unCheckedList = staffList.list
      .filter((filterItem) => !filterItem.disabled)
      .map((item) => item.value)
      .filter((item) => !list.includes(item));
    setCheckedList((checkedList) =>
      Array.from(new Set([...checkedList, ...list])).filter((item) => !unCheckedList.includes(item))
    );
    setIndeterminate(!!list.length && list.length < staffList.list.filter((filterItem) => !filterItem.disabled).length);
    setCheckAll(list.length === staffList.list.filter((filterItem) => !filterItem.disabled).length);
  };
  const paginationOnchange = (pageNum: number) => {
    setPaginationParam((param) => ({ ...param, pageNum }));
  };
  // 提交;
  const onOk = () => {
    onChange?.(checkedList);
    onClose();
  };
  useEffect(() => {
    // 重置参数
    if (visible) {
      setPaginationParam((param) => ({ ...param, pageNum: 1 }));
      setName('');
      setCheckedList(value || []);
      // 清空执行人员时取消已选中
      if (!(value && value?.length)) {
        setCheckAll(false);
        setIndeterminate(false);
      }
      // 判断当前的
    }
  }, [visible]);
  useEffect(() => {
    getStaffList();
  }, [paginationParam]);

  useEffect(() => {
    // 全选样式控制
    if (showCheckbox) {
      const checkAll = staffList.list
        .filter((filterItem) => !filterItem.disabled)
        .every((item) => checkedList.includes(item.value));
      const indeterminate = staffList.list
        .filter((filterItem) => !filterItem.disabled)
        .some((item) => checkedList.includes(item.value));
      setCheckAll(!!staffList.list.length && checkAll);
      setIndeterminate(!checkAll && indeterminate);
    }
  }, [staffList]);
  return (
    <Modal
      width={680}
      centered
      destroyOnClose
      className={style.wrap}
      onClose={onClose}
      visible={visible}
      closable
      title={showCheckbox ? '选择执行人员' : '查看可见范围'}
      onOk={onOk}
      // onChange={inputOnchange}
    >
      <div className={style.inputWrp}>
        <Input
          // value={name}
          className={style.input}
          placeholder="搜索成员"
          onChange={searchStaffList}
        />
        <Icon className={style.inputIcon} name="icon_common_16_seach" />
      </div>
      {!staffList.list.length || (
        <div className={style.checkAllWrap}>
          {showCheckbox && (
            <>
              <Checkbox
                className={style.checkAll}
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                {checkAll ? '取消全选' : '全选'}
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
      )}
      {staffList.list.length
        ? (
        <>
          <CheckboxGroup
            className={classNames(style.checkboxGroupWrap, { [style.hideCheckbox]: !showCheckbox })}
            onChange={onChangeHandle}
            value={checkedList}
          >
            {staffList.list.map((item) => (
              <div key={item.value as Key} title={item.label as string} className={style.checkboxItemWrap}>
                <Checkbox className={style.checkboxItem} value={item.value} disabled={item.disabled}>
                  {item.label}
                </Checkbox>
              </div>
            ))}
          </CheckboxGroup>
          <Pagination
            className={'flex justify-center'}
            size="small"
            simple
            total={staffList.total}
            current={paginationParam.pageNum}
            pageSize={paginationParam.pageSize}
            onChange={paginationOnchange}
            showSizeChanger={false}
          />
        </>
          )
        : (
        <div className={classNames(style.emptyWrap, { [style.hideCheckboxEmptyWrap]: !showCheckbox })}>
          <Empty />
        </div>
          )}
    </Modal>
  );
};
export default StaffModal;
