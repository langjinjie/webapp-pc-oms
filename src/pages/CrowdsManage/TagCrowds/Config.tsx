import React, { useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { Toast } from 'tenacity-tools';
import { useHistory } from 'react-router';
import {
  requestManagePackageRun,
  requestExportPackage,
  requestGetDelPackage,
  requestGetPackageCompute
} from 'src/apis/CrowdsManage';
import classNames from 'classnames';

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

export const tableColumnsFun = ({ getList }: { getList: () => void }): ColumnsType<VideoColumn> => {
  const [btnLoadingPackageId, setBtnLoadingPackageId] = useState<{
    manage: string; // 暂停/开启按钮
    export: string; // 导出按钮
    compute: string; // 计算按钮
  }>({ manage: '', export: '', compute: '' });

  const history = useHistory();

  // 导出人群包
  const exportGroup = async (row: ICrowdsPackageRow) => {
    setBtnLoadingPackageId((param) => ({ ...param, export: row.packageId }));
    const { packageId, computeRecordId } = row;
    const res = await requestExportPackage({ packageId, computeRecordId });
    if (res) {
      Toast.info('去查看下载人群包进行查看');
    }
    setBtnLoadingPackageId((param) => ({ ...param, export: '' }));
  };
  // 查看分群详情
  const viewDetail = () => {
    history.push('/tagCrowds/detail');
  };
  // 开启/暂停 status： 1-开启；2-暂停
  const manageHandle = async (row: ICrowdsPackageRow) => {
    setBtnLoadingPackageId((param) => ({ ...param, manage: row.packageId }));
    const { packageId, runStatus } = row;
    const res = await requestManagePackageRun({ packageId, status: runStatus === 1 ? 2 : 1 });
    if (res) {
      message.error(`人群包${runStatus === 1 ? '暂停' : '开启'}成功`);
      getList();
    } else {
      message.error(`人群包${runStatus === 1 ? '暂停' : '开启'}失败`);
    }
    setBtnLoadingPackageId((param) => ({ ...param, manage: '' }));
  };
  // 删除人群包
  const deleteHandle = async (row: ICrowdsPackageRow) => {
    const { packageId } = row;
    const res = await requestGetDelPackage({ list: [packageId] });
    if (res) {
      message.success('人群包删除成功');
      getList();
    } else {
      message.error('人群包删除失败');
    }
  };
  // 计算人群包
  const computeHandle = async (row: ICrowdsPackageRow) => {
    setBtnLoadingPackageId((param) => ({ ...param, compute: row.packageId }));
    const { packageId } = row;
    const res = await requestGetPackageCompute({ packageId });
    if (res) {
      message.success('计算成功');
    }
    setBtnLoadingPackageId((param) => ({ ...param, compute: '' }));
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
              // 'status-point-gray': text === 2,
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
      width: 100,
      title: '创建人'
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
      width: 180,
      title: '更新时间'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 320,
      render: (record: ICrowdsPackageRow) => {
        return (
          <div>
            <Button type="link" onClick={viewDetail}>
              分群详情
            </Button>
            {/* 每日更新方式对应的是：开启/暂停 */}
            {record.refreshType === 1 && (
              <>
                {record.runStatus === 2
                  ? (
                  <Button
                    type="link"
                    loading={btnLoadingPackageId.manage === record.packageId}
                    onClick={() => manageHandle(record)}
                  >
                    开启
                  </Button>
                    )
                  : (
                  <Button
                    type="link"
                    loading={btnLoadingPackageId.manage === record.packageId}
                    onClick={() => manageHandle(record)}
                  >
                    暂停
                  </Button>
                    )}
              </>
            )}
            <Button
              type="link"
              loading={btnLoadingPackageId.export === record.packageId}
              onClick={() => exportGroup(record)}
            >
              导出人群包
            </Button>
            {/* 手工更新方式对应的是：点击计算/点击计算（置灰） */}
            {record.refreshType === 2 && (
              <Button
                type="link"
                loading={btnLoadingPackageId.compute === record.packageId}
                disabled={record.computeStatus === 1}
                onClick={() => computeHandle(record)}
              >
                点击计算
              </Button>
            )}
            <Popconfirm title="确定要删除?" onConfirm={() => deleteHandle(record)}>
              <Button type="link">删除</Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
};
