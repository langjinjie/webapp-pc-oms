import React, { useState } from 'react';
import { Button, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN, exportFile } from 'src/utils/base';
import { requestDownloadPackageFile } from 'src/apis/CrowdsPackage';
import classNames from 'classnames';

const statusOptions = [
  { id: 0, name: '生成中' },
  { id: 1, name: '生成成功' },
  { id: 2, name: '生成失败' }
];

export interface IPackageDownLoadRow {
  dlId: string; // 是 下载ID
  packageId: string; // 否 分群ID
  packageName: string; // 否 分群名称
  opName: string; // 否 处理人
  runStatus: number; // 否 生成状态(0-生成中，1-生成成功，2-生成失败)
  clientNum: number; // 否 客户数量
  staffNum: number; // 否 对应坐席数量
  updateTime: string; // 否 人群包更新时间
  runTime: string; // 否 生成时间
}

export const searchCols: SearchCol[] = [
  {
    type: 'input',
    label: '分群ID',
    name: 'packageId',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: '分群名称',
    name: 'packageName',
    placeholder: '请输入'
  },

  {
    type: 'input',
    label: '处理人',
    name: 'opName',
    width: '140px',
    placeholder: '请选择'
  },
  {
    type: 'select',
    label: '生成状态',
    name: 'runStatus',
    width: '100px',
    options: statusOptions
  },
  {
    type: 'rangePicker',
    label: '更新时间',
    width: '140px',
    name: 'updateTime',
    placeholder: '请选择'
  },
  {
    type: 'rangePicker',
    label: '生成时间',
    name: 'runTime'
  }
];

export const tableColumnsFun = (): ColumnsType<IPackageDownLoadRow> => {
  const [dowLoadDlId, setDowLoadDlId] = useState('');

  // 下载文件
  const downLoadHandle = async (row: IPackageDownLoadRow) => {
    if (row.runStatus !== 1) {
      return message.warning(`人群包${statusOptions.find((findItem) => findItem.id === row.runStatus)?.name}`);
    }
    const { dlId, packageId } = row;
    setDowLoadDlId(dlId);
    const res = await requestDownloadPackageFile({ dlId, packageId });
    if (res && res.headers['content-disposition']?.split('=')[1]) {
      const fileName = decodeURI(res.headers['content-disposition']?.split('=')[1]);
      exportFile(res.data, fileName.split('.')[0], fileName.split('.')[1]);
    } else {
      message.warning('下载文件异常');
    }
    setDowLoadDlId('');
  };
  return [
    {
      dataIndex: 'dlId',
      title: '下载ID',
      width: 200
    },
    {
      dataIndex: 'packageId',
      title: '分群ID',
      width: 200
    },
    {
      dataIndex: 'packageName',
      title: '分群名称',
      width: 300,
      ellipsis: true
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
      // title: '人群包更新时间'
      title: '更新时间'
    },
    {
      dataIndex: 'runStatus',
      title: '生成状态',
      width: 140,
      render: (text) => (
        <span>
          <i
            className={classNames('status-point', {
              'status-point-green': text === 0,
              // 'status-point-gray': text === 2,
              'status-point-red': text === 2
            })}
          />
          {statusOptions.find((item) => item.id === text)?.name}
        </span>
      )
    },
    {
      dataIndex: 'runTime',
      title: '生成时间',
      width: 200
    },
    // {
    //   dataIndex: 'updateTime',
    //   width: 200,
    //   title: '更新时间'
    // },
    {
      dataIndex: 'opName',
      title: '处理人',
      width: 150,
      render: (opName: string) => <span>{opName || UNKNOWN}</span>
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (row: IPackageDownLoadRow) => {
        return (
          <Button
            type="link"
            className={classNames({ disabled: row.runStatus !== 1 })}
            loading={dowLoadDlId === row.dlId}
            onClick={() => downLoadHandle(row)}
          >
            下载文件
          </Button>
        );
      }
    }
  ];
};
