import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { OperateType } from 'src/utils/interface';

const statusOptions = [
  { id: 1, name: '未上架' },
  { id: 2, name: '已上架' },
  { id: 3, name: '已下架' }
];
export const searchColsFun = (options: any[]): SearchCol[] => [
  {
    type: 'input',
    label: '视频ID',
    name: 'videoId',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: '视频标题',
    name: 'videoName',
    placeholder: '请输入'
  },
  // {
  //   type: 'input',
  //   label: '创建人',
  //   name: 'key1',
  //   placeholder: '请输入'
  // },
  // {
  //   type: 'rangePicker',
  //   label: '创建时间',
  //   name: 'key1'
  // },
  {
    type: 'select',
    label: '分类',
    name: 'typeId',
    width: '100px',
    options: options
  }
];

export interface VideoColumn {
  videoId: string;
  [prop: string]: any;
}
export const tableColumnsFun = (
  onOperate: (type: OperateType, record: VideoColumn, index?: number) => void
): ColumnsType<VideoColumn> => {
  return [
    {
      key: 'videoId',
      dataIndex: 'videoId',
      title: '视频ID',
      width: 200
    },
    {
      key: 'videoName',
      dataIndex: 'videoName',
      title: '视频标题',
      ellipsis: true,
      width: 200
    },
    {
      key: 'typeName',
      dataIndex: 'typeName',
      title: '分类'
    },
    {
      key: 'onlineTime',
      dataIndex: 'onlineTime',
      title: '上架时间',
      width: 160
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '创建时间',
      width: 160
    },
    {
      key: 'createBy',
      dataIndex: 'createBy',
      title: '创建人',
      render: (createBy) => createBy || UNKNOWN
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '上架状态',
      width: 95,
      render: (status) => {
        return (
          <div>
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': status === 1,
                  'status-point-green': status === 2,
                  'status-point-red': status === 3
                }
              ])}
            ></i>
            <span>{statusOptions.filter((item) => item.id === status)[0]?.name}</span>
          </div>
        );
      }
    },
    {
      key: 'operate',
      title: '操作',
      fixed: 'right',
      width: 320,
      render: (operate, record, index) => {
        return (
          <div>
            {record.isTop
              ? (
              <Button type="link" onClick={() => onOperate('unTop', record)}>
                取消置顶
              </Button>
                )
              : (
              <Button type="link" onClick={() => onOperate('top', record)}>
                置顶
              </Button>
                )}
            <Button type="link" onClick={() => onOperate('edit', record)}>
              编辑
            </Button>
            {record.status === 2
              ? (
              <Popconfirm title="确定下架？" onConfirm={() => onOperate('outline', record, index)}>
                <Button type="link">下架</Button>
              </Popconfirm>
                )
              : (
              <Popconfirm title="确定上架？" onConfirm={() => onOperate('putAway', record, index)}>
                <Button type="link">上架</Button>
              </Popconfirm>
                )}
            <Popconfirm title="确定要删除当前视频?" onConfirm={() => onOperate('delete', record, index)}>
              <Button type="link">删除</Button>
            </Popconfirm>
            <Popconfirm title="确定要配置可见范围?" onConfirm={() => onOperate('other', record)}>
              <Button type="link">配置可见范围</Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];
};
