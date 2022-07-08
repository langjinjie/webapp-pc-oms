import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { NgTable, BreadCrumbs } from 'src/components';
import { ColumnsType } from 'antd/lib/table';
import { requestGetTaskStaffExeclist } from 'src/apis/migration';
import { getQueryParam } from 'tenacity-tools';
import { UNKNOWN } from 'src/utils/base';
import { percentage } from 'src/utils/tools';
import style from './style.module.less';
import classNames from 'classnames';

interface ITaskItem {
  clientManageUserId?: string;
  clientManageName?: string;
  isSendTask?: number;
  execTime?: string;
  clientTotalNum?: number;
  transferSuccessNum?: number;
  transferSuccessRate?: string;
}
interface IStaffList {
  total: number;
  list: ITaskItem[];
}

interface IValues {
  clientManageName?: string;
  isSendTask?: number;
}

interface IPaginationParam {
  pageSize: number;
  pageNum: number;
}

const StaffList: React.FC = () => {
  const [staffList, setStaffList] = useState<IStaffList>({ total: 0, list: [] });
  const [searchParam, setSearchParam] = useState<IValues>();
  const [paginationParam, setPaginationParam] = useState<IPaginationParam>({ pageNum: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { Item } = Form;
  const { Option } = Select;
  // 表头
  const columns: ColumnsType<any> = [
    { title: '坐席ID', dataIndex: 'clientManageUserId' },
    { title: '坐席名称', dataIndex: 'clientManageName' },
    {
      title: '任务执行状态',
      dataIndex: 'isSendTask',
      render: (isSendTask: number) => <span>{isSendTask ? '已群发' : '未群发'}</span>
    },
    { title: '任务执行时间', dataIndex: 'execTime', render: (execTime: string) => <span>{execTime || UNKNOWN}</span> },
    {
      title: '迁移进度',
      render: ({ transferSuccessNum, clientTotalNum }: ITaskItem) => (
        <span>
          {transferSuccessNum}/{clientTotalNum}({percentage(transferSuccessNum as number, clientTotalNum as number)})
        </span>
      )
    }
  ];
  // 任务执行状态对照表
  const taskStatusList = [
    { value: 0, label: '未群发' },
    { value: 1, label: '已群发' }
  ];
  // 获取员工任务完成情况
  const getStaffList = async (param?: IValues & IPaginationParam) => {
    setLoading(true);
    const { taskId } = getQueryParam();
    const res = await requestGetTaskStaffExeclist({ taskId, ...param });
    if (res) {
      console.log('res', res);
      setStaffList({ total: res.total, list: res.list });
    }
    setLoading(false);
  };
  // 查询
  const onFinishHandle = (values: IValues) => {
    setSearchParam(values);
    getStaffList({ ...values, pageSize: paginationParam.pageSize, pageNum: 1 });
  };
  // 重置
  const onResetHandle = () => {
    setPaginationParam((param) => ({ ...param, pageNum: 1 }));
    getStaffList({ pageNum: 1, pageSize: paginationParam.pageSize });
  };
  // 翻页
  const onPaginationChange = (pageNum: number, pageSize?: number) => {
    console.log('pageNum', pageNum);
    console.log('pageSize', pageSize);
    setPaginationParam({ pageNum, pageSize: pageSize as number });
    getStaffList({ ...(searchParam as IValues), pageNum, pageSize: pageSize as number });
  };
  useEffect(() => {
    getStaffList();
  }, []);
  return (
    <div className={classNames(style.staffList, 'container')}>
      <BreadCrumbs navList={[{ name: '企微迁移' }, { name: '任务详情' }]} />
      <Form className={style.form} form={form} layout="inline" onFinish={onFinishHandle} onReset={onResetHandle}>
        <Item name="clientManageName" label="坐席名称">
          <Input className={style.textInput} />
        </Item>
        <Item name="isSendTask" label="任务执行状态">
          <Select className={style.select}>
            {taskStatusList.map((mapItem) => (
              <Option key={mapItem.value} value={mapItem.value}>
                {mapItem.label}
              </Option>
            ))}
          </Select>
        </Item>
        <Button className={style.submit} htmlType="submit" type="primary">
          查询
        </Button>
        <Button className={style.reset} htmlType="reset">
          重置
        </Button>
      </Form>
      <NgTable
        className={style.table}
        setRowKey={(record) => record.clientManageUserId}
        dataSource={staffList.list}
        columns={columns}
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          total: staffList.total,
          onChange (pageNum, pageSize) {
            setPaginationParam({ pageNum, pageSize });
          }
        }}
        paginationChange={onPaginationChange}
      />
    </div>
  );
};
export default StaffList;
