import React, { useState } from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { Button, Image } from 'antd';
import { UNKNOWN } from 'src/utils/base';

export const searchCols: SearchCol[] = [
  {
    name: 'staffName',
    type: 'input',
    label: '客户经理姓名',
    placeholder: '请输入',
    width: 320
  },
  {
    name: 'dateList',
    type: 'rangePicker',
    label: '案例提交时间',
    placeholder: '请输入',
    width: 320
  },
  {
    name: 'spconfId',
    type: 'select',
    label: '案例类型',
    placeholder: '请输入',
    width: 200
  },
  {
    name: 'sendStatus',
    type: 'select',
    label: '积分发放状态',
    placeholder: '请输入',
    width: 200,
    options: [
      { id: 0, name: '未发放' },
      { id: 1, name: '已发放' }
    ]
  }
];

interface ExclusiveProps {
  trecordId: string;
  spconfId: string;
  corpId: string;
  staffId: string;
  staffName: string;
  taskContent: string;
  sendStatus: number;
  sendDate?: string;
  sender?: string;
  taskResponse?: string;
  pointsCount: number;
  taskUrls?: string[];
  leaderName?: string;
  bossName?: string;
  dateCreated: string;
}

export const tableColumns = (
  viewContent: (text: string) => void,
  checkedItem: (record: ExclusiveProps) => void
): ColumnsType<ExclusiveProps> => {
  const [visible, setVisible] = useState(false);
  return [
    {
      title: '客户经理姓名',
      dataIndex: 'staffName',
      width: 120
    },
    {
      title: '客户经理id',
      dataIndex: 'staffId',
      width: 120
    },
    {
      title: '团队长姓名',
      dataIndex: 'leaderName',
      width: 120
    },
    {
      title: '区域经理姓名',
      dataIndex: 'bossName',
      width: 120
    },
    {
      title: '案例类型',
      dataIndex: 'sendStatus',
      width: 120
    },
    {
      title: '案例内容',
      dataIndex: 'taskContent',
      width: 250,
      render: (text) => {
        return (
          <div className="flex">
            <div className="cell ellipsis">{text}</div>
            <Button className="ml10" type="primary" ghost size="small" onClick={() => viewContent(text)}>
              查看
            </Button>
          </div>
        );
      }
    },
    {
      title: '案例图片',
      dataIndex: 'taskUrls',
      width: 100,
      render: (taskUrls: string[]) => {
        return (
          <div>
            {taskUrls
              ? (
              <>
                <Image preview={{ visible: false }} width={80} src={taskUrls[0]} onClick={() => setVisible(true)} />
                <div style={{ display: 'none' }}>
                  <Image.PreviewGroup preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}>
                    {taskUrls.map((taskUrl, index) => (
                      <Image key={index} src={taskUrl} />
                    ))}
                  </Image.PreviewGroup>
                </div>
              </>
                )
              : (
                  UNKNOWN
                )}
          </div>
        );
      }
    },
    {
      title: '案例提交时间',
      dataIndex: 'dateCreated',
      width: 120
    },
    {
      title: '积分发放状态',
      dataIndex: 'sendStatus',
      width: 120
    },
    {
      title: '操作人',
      dataIndex: 'sender',
      width: 120
    },
    {
      title: '积分发放时间',
      dataIndex: 'sendDate',
      width: 180
    },
    {
      title: '操作',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <Button
            type="link"
            key={record.trecordId}
            onClick={() => {
              checkedItem(record);
            }}
          >
            发放积分与评价
          </Button>
        );
      }
    }
  ];
};
