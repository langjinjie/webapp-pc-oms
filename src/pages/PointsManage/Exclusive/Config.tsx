import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { OptionProps, SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { Button, Image, Tooltip } from 'antd';
import { UNKNOWN } from 'src/utils/base';
import classNames from 'classnames';
const sendStatusOptions = [
  { id: 0, name: '未发放' },
  { id: 1, name: '已发放' }
];
export const setSearchCols = (options: OptionProps[]): SearchCol[] => [
  {
    name: 'likeStaffName',
    type: 'input',
    label: '客户经理姓名',
    placeholder: '请输入',
    width: 200
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
    width: 200,
    options: options
  },
  {
    name: 'sendStatus',
    type: 'select',
    label: '积分发放状态',
    placeholder: '请输入',
    width: 200,
    options: sendStatusOptions
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
  checkedItem: (record: ExclusiveProps) => void,
  typeOptions: OptionProps[],
  previewPic: (taskUrls: string[]) => void
): ColumnsType<ExclusiveProps> => {
  return [
    {
      title: '客户经理姓名',
      dataIndex: 'staffName',
      width: 120
    },
    {
      title: '客户经理id',
      dataIndex: 'staffId',
      width: 180,
      ellipsis: { showTitle: false },
      render: (text) => {
        return (
          <Tooltip placement="topLeft" title={text}>
            {text || UNKNOWN}
          </Tooltip>
        );
      }
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
      dataIndex: 'spconfId',
      width: 180,
      render: (text: string) => {
        return typeOptions.filter((item) => item.id === text)[0]?.name;
      }
    },
    {
      title: '案例内容',
      dataIndex: 'taskContent',
      width: 250,
      render: (text) => {
        return (
          <>
            {text
              ? (
              <div className="flex">
                <div className="cell ellipsis">{text}</div>
                <Button className="ml10" type="primary" ghost size="small" onClick={() => viewContent(text)}>
                  查看
                </Button>
              </div>
                )
              : (
              <span>{UNKNOWN}</span>
                )}
          </>
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
              <Image
                preview={{ visible: false }}
                width={20}
                height={30}
                src={taskUrls[0]}
                onClick={() => previewPic(taskUrls)}
              />
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
      width: 180
    },
    {
      title: '积分发放状态',
      dataIndex: 'sendStatus',
      width: 120,
      render: (sendStatus) => {
        return (
          <>
            <i
              className={classNames('status-point', sendStatus === 1 ? 'status-point-green' : 'status-point-gray')}
            ></i>
            {sendStatusOptions.filter((status) => status.id === sendStatus)[0]?.name}
          </>
        );
      }
    },
    {
      title: '奖励积分',
      dataIndex: 'pointsCount',
      width: 120,
      render: (pointsCount) => {
        return pointsCount || 0;
      }
    },
    {
      title: '操作人',
      dataIndex: 'sender',
      width: 120,
      render: (text) => <span>{text || UNKNOWN}</span>
    },
    {
      title: '积分发放时间',
      dataIndex: 'sendDate',
      width: 180,
      render: (text) => <span>{text || UNKNOWN}</span>
    },
    {
      title: '操作',
      fixed: 'right',
      width: 120,
      render: (text, record) => {
        return (
          <Button
            disabled={record.sendStatus === 1}
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
