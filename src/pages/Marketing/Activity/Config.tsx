import React from 'react';
import classNames from 'classnames';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import moment from 'moment';
import { Button, Popconfirm, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UNKNOWN } from 'src/utils/base';
import { AuthBtn } from 'src/components';

export const SearchCols: SearchCol[] = [
  {
    name: 'activityName',
    type: 'input',
    label: '活动名称',
    width: '268px',
    placeholder: '请输入'
  },
  {
    name: 'status',
    type: 'select',
    width: 160,
    label: '状态',

    options: [
      { id: 1, name: '未上架' },
      { id: 2, name: '已上架' },
      { id: 3, name: '已下架' }
    ]
  }
];
const statusHandle = (status: number | undefined | null) => {
  switch (status) {
    case 1:
      return '未上架';
    case 2:
      return '已上架';
    case 3:
      return '已下架';
    default:
      return UNKNOWN;
  }
};
interface OperateProps {
  viewItem: (id: string) => void;
  copyItem: (id: string) => void;
  handleSort: (record: ActivityProps) => void;
  handleOperate: (operateType: number, activityId: string, index: number) => void;
  setRight: (record: ActivityProps) => void;
}
export interface ActivityProps {
  activityName: string;
  status: number;
  createTime: string;
  onlineTime: string;
  offlineTime: string;
  isOwner: string;
  createBy: string;
  activityId: string;
  isTop: string;
  groupId: string;
}
export const columns = (args: OperateProps): ColumnsType<ActivityProps> => {
  const { viewItem, handleOperate, handleSort, setRight, copyItem } = args;
  return [
    {
      title: '活动名称',
      dataIndex: 'activityName',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name || UNKNOWN}
        </Tooltip>
      )
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      align: 'center',
      width: 120,
      render: (text: String) => {
        return text || UNKNOWN;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: string) => {
        return <span>{(text && moment(text).format('YYYY-MM-DD HH:mm')) || UNKNOWN}</span>;
      }
    },
    {
      title: '上架时间',
      dataIndex: 'onlineTime',
      render: (text: string) => {
        return <span>{(text && moment(text).format('YYYY-MM-DD HH:mm')) || UNKNOWN}</span>;
      }
    },
    {
      title: '下架时间',
      dataIndex: 'offlineTime',
      render: (text: string) => {
        return <span>{(text && moment(text).format('YYYY-MM-DD HH:mm')) || UNKNOWN}</span>;
      }
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      className: 'status-color',
      render: (status: number) => {
        return (
          <a className="status-color">
            <i
              className={classNames(
                'status-point',
                status === 1 ? 'status-point' : status === 2 ? 'status-point-green' : 'status-point-gray'
              )}
            ></i>
            {statusHandle(status)}
          </a>
        );
      }
    },
    {
      title: '操作',
      dataIndex: 'status',
      width: 320,
      align: 'left',
      fixed: 'right',
      render: (status: number, record: any, index: number) => (
        <Space size={10} className="spaceWrap">
          <AuthBtn path="/top">
            <Button type="link" onClick={() => handleSort(record)}>
              {record.isTop === '1' ? '取消置顶' : '置顶'}
            </Button>
          </AuthBtn>
          <AuthBtn path="/view">
            <Button type="link" onClick={() => viewItem(record.activityId)}>
              查看
            </Button>
          </AuthBtn>
          <AuthBtn path="/add">
            <Button type="link" onClick={() => copyItem(record.activityId)}>
              复制
            </Button>
          </AuthBtn>
          {[1, 2].includes(status) && (
            <AuthBtn path="/edit">
              <Button type="link" onClick={() => handleOperate(0, record.activityId, index)}>
                编辑
              </Button>
            </AuthBtn>
          )}
          <AuthBtn path="/operate">
            {(status === 3 || status === 1) && (
              <Popconfirm title="确定要上架?" onConfirm={() => handleOperate(1, record.activityId, index)}>
                <Button type="link">上架</Button>
              </Popconfirm>
            )}
            {status === 2 && (
              <Popconfirm title="确定要下架?" onConfirm={() => handleOperate(2, record.activityId, index)}>
                <Button type="link">下架</Button>
              </Popconfirm>
            )}
          </AuthBtn>
          <AuthBtn path="/delete">
            {status === 3 && (
              <Popconfirm title="确定要删除?" onConfirm={() => handleOperate(3, record.activityId, index)}>
                <Button type="link">删除</Button>
              </Popconfirm>
            )}
          </AuthBtn>
          <AuthBtn path="/set">
            <Button type="link" onClick={() => setRight(record)}>
              配置可见范围
            </Button>
          </AuthBtn>
        </Space>
      )
    }
  ];
};
