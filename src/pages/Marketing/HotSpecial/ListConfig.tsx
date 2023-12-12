import React from 'react';
import { Button, Image, Popconfirm, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components';
import classNames from 'classnames';
import { OperateType } from 'src/utils/interface';

export const searchColsFun = (): SearchCol[] => {
  return [
    {
      name: 'name',
      type: 'input',
      label: '专题名称',
      width: '180px',
      placeholder: '请输入'
    },
    {
      name: 'status',
      type: 'select',
      label: '状态',
      placeholder: '请输入',
      width: 180,

      options: [
        {
          id: 0,
          name: '已下架'
        },
        {
          id: 1,
          name: '已上架'
        }
      ]
    }
  ];
};

export interface HotColumns {
  topicId: string;
  topicImg: string;
  topicName: string;
  desc: string;
  createBy: string;
  contentNum: number;
  createTime: string;
  [prop: string]: any;
}

interface OperateProps {
  onOperate: (operateType: OperateType, record: HotColumns, index: number) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<HotColumns> => {
  return [
    {
      title: '排序',
      render (_, __, index) {
        return <>{index + 1}</>;
      },
      width: 60
    },
    { title: '专题名称', dataIndex: 'topicName', key: 'topicName', width: 200 },

    {
      title: '专题图片',
      dataIndex: 'topicImg',
      width: 180,
      key: 'topicImg',
      ellipsis: true,
      render: (topicImg: string) => <Image src={topicImg} style={{ maxHeight: '70px' }} />
    },
    {
      title: '内容数量',
      dataIndex: 'contentNum',
      width: 180,
      key: 'contentNum',
      ellipsis: true
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      width: 100
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 260
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 260,
      render: (status) => {
        return (
          <span>
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': status === 0,
                  'status-point-green': status === 1
                }
              ])}
            ></i>
            {status === 1 ? '已上架' : '已下架'}
          </span>
        );
      }
    },
    {
      title: '操作',
      width: 260,
      align: 'center',
      dataIndex: 'status',
      fixed: 'right',
      render: (status, record, index) => {
        return (
          <Space>
            {status === 0
              ? (
              <Popconfirm title="确认上架?" onConfirm={() => args.onOperate('putAway', record, index)}>
                <Button type="link">上架</Button>
              </Popconfirm>
                )
              : (
              <Popconfirm title="确定下架?" onConfirm={() => args.onOperate('outline', record, index)}>
                <Button type="link">下架</Button>
              </Popconfirm>
                )}

            <Button type="link" onClick={() => args.onOperate('edit', record, index)}>
              编辑
            </Button>
            <Button type="link" onClick={() => args.onOperate('add', record, index)}>
              配置内容
            </Button>
            <Button type="link" onClick={() => args.onOperate('other', record, index)}>
              置顶
            </Button>
          </Space>
        );
      }
    }
  ];
};
