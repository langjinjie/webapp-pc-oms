import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import React from 'react';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { OperateType } from 'src/utils/interface';

const auditStatus = [
  // 0-审核中；1-审批通过；2-审批不通过；3-撤回；4-自动审批通过
  {
    id: 0,
    name: '审批中'
  },
  {
    id: 1,
    name: '审批通过'
  },
  {
    id: 2,
    name: '审批不通过'
  },
  {
    id: 3,
    name: '撤回'
  },
  {
    id: 4,
    name: '自动审批通过'
  }
];
const wikiStatus = [
  {
    id: 1,
    name: '未上架'
  },
  {
    id: 2,
    name: '已上架'
  },
  {
    id: 3,
    name: '已下架'
  }
];
export const searchColsFun = (): SearchCol[] => [
  {
    type: 'input',
    label: '关键词搜索',
    name: 'keywords',
    placeholder: '请输入'
  },
  {
    type: 'input',
    label: '创建人',
    name: 'createBy',
    placeholder: '请输入'
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
  },
  {
    type: 'select',
    label: '审批状态',
    name: 'auditStatus',
    width: '120px',
    options: auditStatus,
    placeholder: '请选择'
  },
  {
    type: 'select',
    label: '知识库状态',
    name: 'wikiStatus',
    width: '120px',
    options: wikiStatus,
    placeholder: '请选择'
  }
];

export interface WikiColumn {
  wikiId: string;
  level1CategroyId: string;
  level1Name: string;
  level2CategroyId: string;
  level2Name: string;
  wikiStatus: number;
  title: string;
  auditStatus: number;
  createBy: string;
  createTime: string;
  updateTime: string;
  openCount: number;
  [prop: string]: any;
}

export const tableColumnsFun = (
  onOperate: (type: OperateType, record: WikiColumn, index?: number) => void
): ColumnsType<WikiColumn> => {
  return [
    {
      key: 'videoId',
      dataIndex: 'videoId',
      title: '序号',
      render: (text, record, index) => {
        return index + 1;
      },
      width: 80
    },
    {
      key: 'level1Name',
      dataIndex: 'level1Name',
      title: '一级目录',
      ellipsis: true,
      width: 200
    },
    {
      key: 'level2Name',
      dataIndex: 'level2Name',
      title: '二级目录',
      width: 200,
      render: (level2Name) => level2Name || UNKNOWN
    },
    {
      key: 'wikiStatus',
      dataIndex: 'wikiStatus',
      title: '知识库状态',
      width: 120,
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
            <span>{wikiStatus.filter((item) => item.id === status)[0]?.name}</span>
          </div>
        );
      }
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: '知识库标题',
      render: (onlineTime) => onlineTime || UNKNOWN,
      width: 160
    },
    {
      key: 'auditStatus',
      dataIndex: 'auditStatus',
      title: '知识库状态',
      width: 120,
      render: (status) => {
        return (
          <div>
            <span>{auditStatus.filter((item) => item.id === status)[0]?.name}</span>
          </div>
        );
      }
    },
    {
      key: 'createBy',
      dataIndex: 'createBy',
      title: '创建人',
      width: 100,
      render: (createBy) => createBy || UNKNOWN
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '创建时间',
      width: 160
    },
    {
      key: 'updateTime',
      dataIndex: 'updateTime',
      title: '更新时间',
      render: (updateTime) => updateTime || UNKNOWN,
      width: 160
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
            {record.wikiStatus === 2
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

            <Button type="link" onClick={() => onOperate('other', record)}>
              配置可见范围
            </Button>
          </div>
        );
      }
    }
  ];
};