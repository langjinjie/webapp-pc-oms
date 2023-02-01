import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

const statusOptions = [
  { id: 1, name: '未上架' },
  { id: 2, name: '已上架' },
  { id: 2, name: '已下架' }
];
export const searchCols: SearchCol[] = [
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
    options: statusOptions
  }
];

interface VideoColumn {
  [prop: string]: any;
}
export const tableColumnsFun = (): ColumnsType<VideoColumn> => {
  return [
    {
      key: 'videoId',
      dataIndex: 'videoId',
      title: '视频ID'
    },
    {
      key: 'videoName',
      dataIndex: 'videoName',
      title: '视频标题'
    },
    {
      key: 'typeName',
      dataIndex: 'typeName',
      title: '分类'
    },
    {
      key: 'onlineTime',
      dataIndex: 'onlineTime',
      title: '上架机构'
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '创建时间'
    },
    {
      key: 'createBy',
      dataIndex: 'createBy',
      title: '创建人'
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '上架状态',
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
      render: (operate, record) => {
        return (
          <div>
            <Button type="link">置顶</Button>
            <Button type="link">编辑</Button>
            {record.key3 === 1 ? <Button type="link">下架</Button> : <Button type="link">上架</Button>}

            <Button type="link">配置可见范围</Button>
          </div>
        );
      }
    }
  ];
};
