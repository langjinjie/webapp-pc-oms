import React, { Key } from 'react';
import { Button, Table, Form, Input, Popconfirm } from 'antd';
import { SelectStaff } from 'src/pages/StaffManage/components';
import style from './style.module.less';
import classNames from 'classnames';

interface IStaffListProps {
  dataSource: any[];
  pagination: any;
  searchStaffList: () => void;
  rowSelection: any;
  assignType: number;
  staffRowKeys: Key[];
  sortHandle: (type: -1 | 1 | 0, currentSort: number) => void;
  batchDelStaff: (keys: Key[]) => void;
  disabled?: boolean;
}

const StaffList: React.FC<IStaffListProps> = ({
  dataSource,
  pagination,
  searchStaffList,
  rowSelection,
  assignType,
  staffRowKeys,
  sortHandle,
  batchDelStaff,
  disabled
}) => {
  const { Item } = Form;
  return (
    <div className={style.tableWrap}>
      <div className={style.searchWrap}>
        <Item label="员工名称" name="staffName">
          <Input className={style.staffListInput} placeholder="待输入" />
        </Item>
        <Item label="选择部门" name="dept">
          <SelectStaff type="dept" className={style.staffListSelect} />
        </Item>
        <Button className={style.staffListSearch} type="primary" onClick={searchStaffList}>
          搜索
        </Button>
      </div>
      <Table
        rowKey={(record: any) => record.staffId + record.sort}
        className={style.staffList}
        scroll={{ x: 760 }}
        dataSource={dataSource}
        pagination={pagination}
        columns={[
          {
            title: '序号',
            render (value: any) {
              return <>{value.sort}</>;
            }
          },
          { title: '员工姓名', dataIndex: 'staffName' },
          { title: '部门', dataIndex: 'deptName' },
          {
            title: '操作',
            render (value: any) {
              return (
                <>
                  {assignType === 2 && value.sort !== 1 && (
                    <span
                      className={classNames('text-primary mr5 pointer', { disabled: disabled })}
                      onClick={() => sortHandle(-1, value.sort)}
                    >
                      上移
                    </span>
                  )}
                  {assignType === 2 && value.sort !== (pagination.total || 0) && (
                    <span
                      className={classNames('text-primary mr5 pointer', { disabled: disabled })}
                      onClick={() => sortHandle(1, value.sort)}
                    >
                      下移
                    </span>
                  )}
                  <Popconfirm title="确定删除该员工吗？" onConfirm={() => batchDelStaff([value.id])}>
                    <span className={classNames('text-primary mr5 pointer', { disabled: disabled })}>删除</span>
                  </Popconfirm>
                  {assignType === 2 && value.sort !== 1 && (
                    <span
                      className={classNames('text-primary mr5 pointer', { disabled: disabled })}
                      onClick={() => sortHandle(0, value.sort)}
                    >
                      置顶
                    </span>
                  )}
                </>
              );
            }
          }
        ]}
        rowSelection={!disabled && rowSelection}
      />
      <span>
        已选中 {staffRowKeys.length}/{pagination.total || 0} 个员工
      </span>
      <Button
        className={style.batchDel}
        disabled={disabled || staffRowKeys.length === 0}
        onClick={() => batchDelStaff(staffRowKeys)}
      >
        批量删除
      </Button>
    </div>
  );
};
export default StaffList;
