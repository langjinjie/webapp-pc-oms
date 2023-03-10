import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import classNames from 'classnames';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { OperateType } from 'src/utils/interface';
import { Toast } from 'tenacity-tools';

interface ICrowdsPackageRow {
  packageId: string; // 是 分群ID
  packageName: string; // 是 分群名称
  computeStatus: number; // 是 计算状态（1-计算中、2-计算成功、3-计算失败）
  refreshType: number; // 是 更新方式（1-每日更新、2-手工更新）
  createTime: string; // 是 创建时间
  opName: string; // 是 创建人
  runStatus: number; // 是 运行状态（1-正常、2-已暂停）
  computeRecordId: string; // 否 人群包计算记录ID
  clientNum: number; // 否 客户数量
  staffNum: number; // 否 对应坐席数量
  updateTime: string; // 否 更新时间
}

const statusOptions = [
  { id: 1, name: '正常' },
  { id: 2, name: '已暂停' }
];

export const updateOptions = [
  { id: 1, name: '每日更新' },
  { id: 2, name: '手动更新' }
];
export const computedOptions = [
  { id: 1, name: '计算中' },
  { id: 2, name: '计算完成' },
  { id: 3, name: '计算失败' }
  // { id: 4, name: '新创建' }
];

export const searchCols: SearchCol[] = [
  {
    type: 'input',
    label: '分群名称',
    name: 'packageName',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: '分群ID',
    name: 'packageId',
    placeholder: '请输入'
  },
  {
    type: 'select',
    label: '计算状态',
    width: '140px',
    name: 'computeStatus',
    options: computedOptions,
    placeholder: '请选择'
  },
  {
    type: 'select',
    label: '运行状态',
    name: 'runStatus',
    width: '100px',
    options: statusOptions
  },
  {
    type: 'select',
    label: '更新方式',
    name: 'refreshType',
    width: '140px',
    options: updateOptions,
    placeholder: '请选择'
  },
  {
    type: 'rangePicker',
    label: '创建时间',
    name: 'createTime'
  },
  {
    type: 'rangePicker',
    label: '更新时间',
    name: 'updateTime'
  }
  // {
  //   type: 'input',
  //   label: '创建人',
  //   placeholder: '请输入',
  //   name: 'key7'
  // },
];

interface VideoColumn {
  [prop: string]: any;
}

export const tableColumnsFun = (onOperation: (type: OperateType) => void): ColumnsType<VideoColumn> => {
  // 导出人群包
  const exportGroup = () => {
    Toast.info('去查看下载人群包进行查看');
    console.log('导出人群包');
  };
  return [
    {
      key: 'packageId',
      dataIndex: 'packageId',
      title: '分群ID',
      width: 100
    },
    {
      key: 'packageName',
      dataIndex: 'packageName',
      title: '分群名称',
      width: 140
    },
    {
      key: 'refreshType',
      dataIndex: 'refreshType',
      title: '更新方式',
      render: (text) => updateOptions.filter((item) => item.id === text)[0]?.name,
      width: 100
    },
    {
      key: 'computeStatus',
      dataIndex: 'computeStatus',
      title: '计算状态',
      width: 120,
      render: (text) => (
        <span>
          <i
            className={classNames('status-point', {
              'status-point-green': text === 1,
              'status-point-red': text === 2,
              'status-point-gray': text === 3
            })}
          ></i>
          {computedOptions.find((item) => item.id === text)?.name}
        </span>
      )
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      width: 180,
      title: '创建时间'
    },
    {
      key: 'opName',
      dataIndex: 'opName',
      width: 100,
      title: '创建人'
    },
    {
      key: 'key7',
      dataIndex: 'key7',
      title: '运行状态',
      width: 100,
      render: (text) => statusOptions.filter((item) => item.id === text)[0]?.name
    },
    {
      key: 'runStatus',
      dataIndex: 'runStatus',
      width: 100,
      title: '客户数量'
    },
    {
      key: 'key9',
      dataIndex: 'key9',
      width: 120,
      title: '对应坐席数量'
    },
    {
      key: 'staffNum',
      dataIndex: 'staffNum',
      width: 180,
      title: '更新时间'
    },
    {
      key: 'key7',
      title: '操作',
      fixed: 'right',
      width: 330,
      render: (record: ICrowdsPackageRow) => {
        return (
          <div>
            <Button type="link" onClick={() => onOperation('view')}>
              分群详情
            </Button>
            {record.computeStatus === 1 ? <Button type="link">开启</Button> : <Button type="link">暂停</Button>}
            <Button type="link" onClick={exportGroup}>
              导出人群包
            </Button>
            {record.computeStatus !== 1 && (
              <Button type="link" disabled={record.computeStatus === 3}>
                点击计算
              </Button>
            )}
            <Button type="link">删除</Button>
          </div>
        );
      }
    }
  ];
};
