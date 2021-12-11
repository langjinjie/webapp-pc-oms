import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { NgTable } from 'src/components';
import { TableColumns, TablePagination } from './Config';
import style from './style.module.less';

const StaffList: React.FC = () => {
  const [staffList, setStaffList] = useState<{ [key: string]: any }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationParam, setPaginationParam] = useState({ current: 1, pageSize: 10 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [disabledColumnType, setDisabledColumnType] = useState(-1);

  // 获取员工列表
  const getStaffList = () => {
    console.log(selectedRowKeys);
    const staffItem = {
      name: '李思',
      account: 'lisisi',
      number: '0',
      department: '深圳团队',
      post: '客户经理',
      business: '电销',
      area: '上海',
      location: '上海',
      openingTime: '2021-04-30 11:23',
      downTime: '2021-04-30 11:23',
      status: 0
    };
    const staffLsit = [];
    for (let i = 0; i < 20; i++) {
      const initalStaffItem = { ...staffItem };
      initalStaffItem.number = i + '';
      i % 2 === 0 ? (initalStaffItem.status = 0) : (initalStaffItem.status = 1);
      staffLsit.push(initalStaffItem);
    }
    setStaffList(staffLsit);
  };
  useEffect(() => {
    setIsLoading(true);
    getStaffList();
    setIsLoading(false);
  }, []);
  return (
    <div className={style.wrap}>
      <div className={style.operation}>
        <Button type="primary" className={style.btn}>
          批量设置信息
        </Button>
        <Button type="primary" className={style.btn}>
          批量导入信息
        </Button>
        <Button type="primary" className={style.btn}>
          批量导出信息
        </Button>
        <Button type="primary" className={style.btn}>
          删除
        </Button>
      </div>
      <NgTable
        className={style.tableWrap}
        setRowKey={(record: any) => record.number}
        dataSource={staffList}
        columns={TableColumns()}
        loading={isLoading}
        {...TablePagination({
          staffList,
          paginationParam,
          setPaginationParam,
          setSelectedRowKeys,
          disabledColumnType,
          setDisabledColumnType
        })}
        // pagination={pagination}
        // rowSelection={rowSelection}
        // paginationChange={paginationChange}
      />
    </div>
  );
};

export default StaffList;
