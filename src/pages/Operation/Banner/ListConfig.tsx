import React from 'react';
import { Button, Image, Popconfirm, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import { OperateType } from 'src/utils/interface';

interface OperateProps {
  onOperate: (operateType: OperateType, record: IBanner, index: number) => void;
}
// 0=文章; 1=活动;2=产品3=海报 4=视频

export const bannerTypeOptions = [
  { id: 1, name: '文章', recommendType: 0 },
  { id: 2, name: '周报' },
  { id: 3, name: '专题' },
  { id: 4, name: '活动', recommendType: 1 },
  { id: 5, name: '其他' }
];

export interface IBanner {
  bannerId: string;
  type: string;
  content: string;
  itemId: string;
  imgUrl: string;
  linkUrl: string;
  showTime: string;
  status: string;
  sortId: string;
  startTime: string;
  endTime: string;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<IBanner> => {
  return [
    {
      title: '排序',
      render (_, __, index) {
        return <>{index + 1}</>;
      },
      width: 60
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text) => bannerTypeOptions.filter((option) => option.id === +text)[0]?.name
    },

    {
      title: '内容',
      dataIndex: 'content',
      width: 180,
      key: 'content',
      render (value, record) {
        return value || (record.type === '2' && '系统自动取每周最新的周报内容');
      }
    },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      width: 180,
      key: 'imgUrl',
      ellipsis: true,
      render: (imgUrl: string) => <Image src={imgUrl} style={{ maxHeight: '70px' }} />
    },
    {
      title: '展示时间',
      dataIndex: 'showTime',
      width: 260
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status) => {
        return (
          <span>
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': +status === 1,
                  'status-point-green': +status === 2
                }
              ])}
            ></i>
            {status === '2' ? '已上架' : '已下架'}
          </span>
        );
      }
    },
    {
      title: '操作',
      width: 180,
      align: 'center',
      dataIndex: 'status',
      fixed: 'right',
      render: (status, record, index) => {
        return (
          <Space>
            <Button type="link" onClick={() => args.onOperate('edit', record, index)}>
              编辑
            </Button>
            {status === '1'
              ? (
              <Popconfirm title="是否确认上架?" onConfirm={() => args.onOperate('putAway', record, index)}>
                <Button type="link">上架</Button>
              </Popconfirm>
                )
              : (
              <Popconfirm title="是否确定下架?" onConfirm={() => args.onOperate('outline', record, index)}>
                <Button type="link">下架</Button>
              </Popconfirm>
                )}
            {/* <Button type="link" onClick={() => args.onOperate('add', record, index)}>
              配置内容
            </Button> */}
            {status === 1 && (
              <Popconfirm title="是否确定置顶?" onConfirm={() => args.onOperate('other', record, index)}>
                <Button type="link">置顶</Button>
              </Popconfirm>
            )}
          </Space>
        );
      }
    }
  ];
};
