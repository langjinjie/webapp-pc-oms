import React from 'react';
import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol, AuthBtn } from 'src/components';
import classNames from 'classnames';
import { UNKNOWN } from 'src/utils/base';

export interface ICrowdsPackageRow {
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
  packageType: number; // 分群类型，1-标签属性；2-人员属性；3-手工导入文件
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
  { id: 2, name: '计算成功' },
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
    name: 'createTimeBegin-createTimeEnd'
  },
  {
    type: 'rangePicker',
    label: '更新时间',
    name: 'updateTimeBegin-updateTimeEnd'
  }
];

interface VideoColumn {
  [prop: string]: any;
}

type TTableColumnsFun = (param: {
  btnLoadingPackageId: {
    export: string; // 导出按钮
    compute: string; // 计算按钮
  };
  viewDetail: (row: ICrowdsPackageRow) => void;
  manageHandle: (row: ICrowdsPackageRow) => void;
  deleteHandle: (row: ICrowdsPackageRow) => void;
  computeHandle: (row: ICrowdsPackageRow) => void;
  exportGroup: (row: ICrowdsPackageRow) => void;
}) => ColumnsType<VideoColumn>;

export const tableColumnsFun: TTableColumnsFun = ({
  btnLoadingPackageId,
  viewDetail,
  manageHandle,
  deleteHandle,
  computeHandle,
  exportGroup
}) => {
  return [
    {
      key: 'packageId',
      dataIndex: 'packageId',
      title: '分群ID',
      width: 200
    },
    {
      key: 'packageName',
      dataIndex: 'packageName',
      title: '分群名称',
      width: 300,
      ellipsis: true
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
              'status-point-gray': text === 1,
              'status-point-green': text === 2,
              'status-point-red': text === 3
            })}
          />
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
      width: 150,
      title: '创建人',
      render: (opName: string) => <span>{opName || UNKNOWN}</span>
    },
    {
      dataIndex: 'runStatus',
      title: '运行状态',
      width: 100,
      render: (text) => (
        <span>
          <i
            className={classNames('status-point', {
              'status-point-red': text === 3
            })}
          />
          {statusOptions.filter((item) => item.id === text)[0]?.name}
        </span>
      )
    },
    {
      dataIndex: 'clientNum',
      width: 100,
      title: '客户数量'
    },
    {
      dataIndex: 'staffNum',
      width: 120,
      title: '对应坐席数量'
    },
    {
      dataIndex: 'updateTime',
      width: 200,
      title: '更新时间'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 320,
      render: (record: ICrowdsPackageRow) => {
        return (
          <div>
            <AuthBtn path="/viewPackageDetail">
              <Button type="link" onClick={() => viewDetail(record)}>
                分群详情
              </Button>
            </AuthBtn>
            <AuthBtn path="/manage">
              {/* 每日更新方式对应的是：开启/暂停 */}
              {record.refreshType === 1 && (
                <Popconfirm
                  title={`确定要${record.runStatus === 2 ? '开启' : '暂停'}该人群包吗？`}
                  onConfirm={() => manageHandle(record)}
                >
                  <Button type="link">{record.runStatus === 2 ? '开启' : '暂停'}</Button>
                </Popconfirm>
              )}
            </AuthBtn>
            <AuthBtn path="/export">
              <Button
                type="link"
                loading={btnLoadingPackageId.export === record.packageId}
                onClick={() => exportGroup(record)}
              >
                导出人群包
              </Button>
            </AuthBtn>
            {/* 手工更新方式对应的是：点击计算/点击计算（置灰） */}
            <AuthBtn path="/computed">
              {record.refreshType === 2 && (
                <Button
                  type="link"
                  loading={btnLoadingPackageId.compute === record.packageId}
                  // 手工导入文件的人群包不支持点击计算
                  disabled={record.packageType === 3 || record.computeStatus === 1}
                  onClick={() => computeHandle(record)}
                >
                  点击计算
                </Button>
              )}
            </AuthBtn>
            <AuthBtn path="/delete">
              <Popconfirm title="确定要删除该人群包吗？" onConfirm={() => deleteHandle(record)}>
                <Button type="link">删除</Button>
              </Popconfirm>
            </AuthBtn>
          </div>
        );
      }
    }
  ];
};
