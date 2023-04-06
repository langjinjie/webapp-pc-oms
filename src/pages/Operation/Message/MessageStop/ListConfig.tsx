import { Button, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';
import { AuthBtn } from 'src/components';
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
  // {
  //   id: 3,
  //   name: '撤回'
  // },
  {
    id: 4,
    name: '自动审批通过'
  }
];

const sendTypeOptions = [
  {
    id: '',
    name: '全部'
  },
  {
    id: 1,
    name: '群发朋友圈'
  },
  {
    id: 2,
    name: '群发消息'
  }
];
const sendStatusOptions = [
  {
    id: '',
    name: '全部'
  },
  {
    id: 1,
    name: '正常'
  },
  {
    id: 2,
    name: '停用'
  },
  {
    id: 3,
    name: '已执行'
  }
];
const stopTypeOptions = [
  {
    id: '',
    name: '全部'
  },
  {
    id: 2,
    name: '手工停用'
  },
  {
    id: 1,
    name: '系统停用'
  }
];
export const searchColsFun = (): SearchCol[] => [
  {
    type: 'input',
    label: '群发编码',
    name: 'batchNo',
    placeholder: '请输入'
  },
  {
    type: 'select',
    label: '群发类型',
    name: 'batchType',
    width: '120px',
    options: sendTypeOptions,
    placeholder: '请输入'
  },
  {
    type: 'select',
    label: '群发状态',
    width: '120px',
    name: 'status',
    options: sendStatusOptions,
    placeholder: '请输入'
  },
  {
    type: 'select',
    label: '停用类型',
    name: 'stopType',
    width: '120px',
    options: stopTypeOptions,
    placeholder: '请输入'
  },
  {
    type: 'rangePicker',
    label: '创建时间',
    name: 'createTimeBegin-createTimeEnd'
  },
  {
    type: 'select',
    label: '功能来源',
    name: 'source',
    placeholder: '请选择',
    width: '120px',
    options: [
      { id: '', name: '全部' },
      { id: 1, name: '任务系统' }
    ]
  },
  {
    type: 'input',
    label: '功能编码',
    name: 'taskCode',
    width: '120px',
    placeholder: '请输入'
  },
  {
    type: 'date',
    label: '任务日期',
    name: 'taskDate',
    width: '120px',
    placeholder: '请选择'
  },
  {
    type: 'input',
    label: '客户经理',
    name: 'staffName',
    width: '120px',
    placeholder: '请输入'
  }
];

export interface MessageStopColumn {
  batchId: string;
  batchNo: string;
  batchType: number;
  status: number;
  stopType: number;
  createTime: string;
  soruce: number;
  taskCode: string;
  taskDate: string;
  staffNum: string;
  staffNames: string;
  [prop: string]: any;
}

export const tableColumnsFun = (
  onOperate: (type: OperateType, record: MessageStopColumn, index?: number) => void
): ColumnsType<MessageStopColumn> => {
  return [
    {
      key: 'batchNo',
      dataIndex: 'batchNo',
      title: '群发编号',
      width: 225
    },
    {
      key: 'batchType',
      dataIndex: 'batchType',
      title: '群发类型',
      width: 120,
      render: (batchType) => sendTypeOptions.filter((item) => item.id === batchType)[0]?.name
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '群发状态',
      ellipsis: true,
      width: 100,
      render: (status) => sendStatusOptions.filter((item) => item.id === status)[0].name || UNKNOWN
    },
    {
      key: 'stopType',
      dataIndex: 'stopType',
      title: '停用类型',
      width: 110,
      render: (status) => {
        return (
          <div>
            <span>{stopTypeOptions.filter((item) => item.id === status)[0]?.name || UNKNOWN}</span>
          </div>
        );
      }
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '群发创建时间',
      render: (createTime) => createTime || UNKNOWN,
      width: 200
    },
    {
      key: 'soruce',
      dataIndex: 'soruce',
      title: '功能来源',
      width: 120,

      render: (soruce) => {
        return (
          <div>
            <span>{auditStatus.filter((item) => item.id === soruce)[0]?.name || UNKNOWN}</span>
          </div>
        );
      }
    },
    {
      key: 'taskCode',
      dataIndex: 'taskCode',
      title: '功能编码',
      width: 200,
      render: (taskCode) => taskCode || UNKNOWN
    },
    {
      key: 'taskDate',
      dataIndex: 'taskDate',
      title: '任务日期',
      width: 160
    },
    {
      key: 'staffNum',
      dataIndex: 'staffNum',
      title: '客户经理数量',
      render: (staffNum) => staffNum || 0,
      width: 180
    },
    {
      key: 'staffNames',
      dataIndex: 'staffNames',
      title: '客户经理名称',
      render: (staffNames) => staffNames || UNKNOWN,
      width: 150
    },

    {
      key: 'operate',
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (operate, record, index) => {
        return (
          <div>
            <AuthBtn path="/view">
              <Button type="link" onClick={() => onOperate('view', record)}>
                查看群发详情
              </Button>
            </AuthBtn>
            {record.status === 1 && (
              <AuthBtn path="/operate">
                <Popconfirm title="确定要停用？" onConfirm={() => onOperate('outline', record, index)}>
                  <Button type="link">停用群发</Button>
                </Popconfirm>
              </AuthBtn>
            )}
          </div>
        );
      }
    }
  ];
};
