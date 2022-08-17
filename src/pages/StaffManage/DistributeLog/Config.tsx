import React from 'react';
import { Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import classNames from 'classnames';

export const searchCols: SearchCol[] = [
  {
    name: 'title',
    type: 'input',
    label: '客户姓名',
    width: 180,
    placeholder: '请输入'
  },
  {
    name: 'title1',
    type: 'input',
    label: '员工姓名',
    width: 180,
    placeholder: '请输入'
  },
  {
    name: 'syncBank',
    type: 'select',
    width: 160,
    label: '接替状态',
    placeholder: '请选择',
    options: [
      { id: 0, name: '已拒绝' },
      { id: 1, name: '已接替' }
    ]
  }
];
export const searchCols1: SearchCol[] = [
  {
    name: 'title',
    type: 'input',
    label: '客户姓名',
    width: '180px',
    placeholder: '请输入'
  },
  {
    name: 'syncBank',
    type: 'select',
    width: 180,
    label: '联系情况',
    placeholder: '请选择',
    options: [
      { id: 0, name: '近3天有联系' },
      { id: 1, name: '近7天有联系' },
      { id: 2, name: '近30天有联系' }
    ]
  }
];

export interface StaffColumns {
  key1: string;
  key2: string;
  key3: string;
  key4: string;
  key5: string;
  key6: string;
  key7: string;
}

export const tableColumns: ColumnsType<StaffColumns> = [
  { title: '客户姓名', dataIndex: 'key1', key: 'key1', width: 100 },
  {
    title: '原员工姓名',
    dataIndex: 'key2',
    key: 'key2',
    width: 200
  },
  {
    title: '接替员工',
    dataIndex: 'key3',
    width: 160,
    key: 'key3',
    align: 'center',
    render: (nodeName: string) => nodeName || UNKNOWN
  },
  {
    title: '转接状态',
    dataIndex: 'key4',
    width: 260,
    align: 'center',
    render: (status) => (
      <span>
        {' '}
        <span>
          <i
            className={classNames(
              'status-point',
              status === '1' ? 'status-point' : status === '2' ? 'status-point-green' : 'status-point-red'
            )}
          ></i>
          {status === '0' ? '已拒绝' : status === '1' ? '待接收' : '已接收'}
        </span>{' '}
      </span>
    )
  },
  {
    title: '操作人',
    dataIndex: 'key5',
    width: 260,
    align: 'center'
  },
  {
    title: '分配时间',
    dataIndex: 'key6',
    width: 260,
    align: 'center'
  },
  {
    title: '分配原因',
    dataIndex: 'key7',
    width: 260,
    align: 'center',
    ellipsis: { showTitle: false },
    render: (corpNames: string) => (
      <Tooltip title={corpNames} placement="topLeft">
        {corpNames || UNKNOWN}
      </Tooltip>
    )
  }
];
export const tableColumns2: ColumnsType<StaffColumns> = [
  {
    title: '客户姓名',
    dataIndex: 'key1',
    key: 'key1',
    width: 150
  },
  {
    title: '原员工姓名',
    dataIndex: 'key2',
    key: 'key2',
    width: 200
  },
  {
    title: '接替员工',
    dataIndex: 'key3',
    width: 160,
    key: 'key3',
    align: 'center',
    render: (nodeName: string) => nodeName || UNKNOWN
  },
  {
    title: '操作人',
    dataIndex: 'key5',
    width: 260,
    align: 'center'
  },
  {
    title: '转接状态',
    dataIndex: 'key4',
    width: 260,
    align: 'center',
    render: (status) => (
      <span>
        <i
          className={classNames(
            'status-point',
            status === '1' ? 'status-point' : status === '2' ? 'status-point-green' : 'status-point-red'
          )}
        ></i>
        {status === '0' ? '已拒绝' : status === '1' ? '待接收' : '已接收'}
      </span>
    )
  },

  {
    title: '分配时间',
    dataIndex: 'key6',
    width: 260,
    align: 'center'
  }
];

export const clientTypeList = [
  {
    key: 'key1',
    title: '在职分配记录'
  },
  {
    key: 'key2',
    title: '离职分配记录'
  }
];
