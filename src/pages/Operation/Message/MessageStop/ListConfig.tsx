import { Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
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

const sendTypeOptions = [
  {
    id: '',
    name: '全部'
  },
  {
    id: '1',
    name: '群发朋友圈'
  },
  {
    id: '2',
    name: '群发消息'
  }
];
const sendStatusOptions = [
  {
    id: '',
    name: '全部'
  },
  {
    id: '1',
    name: '正常'
  },
  {
    id: '2',
    name: '停用'
  }
];
const stopTypeOptions = [
  {
    id: '',
    name: '全部'
  },
  {
    id: '1',
    name: '手工停用'
  },
  {
    id: '2',
    name: '系统停用'
  }
];
export const searchColsFun = (): SearchCol[] => [
  {
    type: 'input',
    label: '群发编码',
    name: 'keywords',
    placeholder: '请输入'
  },
  {
    type: 'select',
    label: '群发类型',
    name: 'createBy',
    options: sendTypeOptions,
    placeholder: '请输入'
  },
  {
    type: 'select',
    label: '群发状态',
    name: 'createBy',
    options: sendStatusOptions,
    placeholder: '请输入'
  },
  {
    type: 'select',
    label: '停用类型',
    name: 'createBy',
    options: stopTypeOptions,
    placeholder: '请输入'
  },
  {
    type: 'rangePicker',
    label: '创建时间',
    name: 'createTime'
  },
  {
    type: 'rangePicker',
    label: '功能来源',
    name: 'updateTime'
  },
  {
    type: 'select',
    label: '功能编码',
    name: 'auditStatus',
    width: '120px',
    options: auditStatus,
    placeholder: '请选择'
  },
  {
    type: 'select',
    label: '任务日期',
    name: 'wikiStatus',
    width: '120px',
    options: wikiStatus,
    placeholder: '请选择'
  },
  {
    type: 'input',
    label: '客户经理',
    name: 'wikiStatus',
    width: '120px',
    placeholder: '请输入'
  }
];

export interface MessageStopColumn {
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
  onOperate: (type: OperateType, record: MessageStopColumn, index?: number) => void
): ColumnsType<MessageStopColumn> => {
  return [
    {
      key: 'videoId',
      dataIndex: 'videoId',
      title: '群发编号',

      width: 100
    },
    {
      key: 'level1Name',
      dataIndex: 'level1Name',
      title: '群发类型',
      ellipsis: true,
      width: 100
    },
    {
      key: 'level2Name',
      dataIndex: 'level2Name',
      title: '群发状态',
      ellipsis: true,
      width: 100,
      render: (level2Name) => level2Name || UNKNOWN
    },
    {
      key: 'wikiStatus',
      dataIndex: 'wikiStatus',
      title: '停用类型',
      width: 110,
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
      title: '群发创建时间',
      render: (title) => (
        <Tooltip placement="topLeft" title={title || UNKNOWN}>
          {title || UNKNOWN}
        </Tooltip>
      ),
      ellipsis: {
        showTitle: false
      },

      width: 160
    },
    {
      key: 'auditStatus',
      dataIndex: 'auditStatus',
      title: '功能来源',
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
      title: '功能编码',
      width: 100,
      render: (createBy) => createBy || UNKNOWN
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '任务日期',
      width: 220
    },
    {
      key: 'updateTime',
      dataIndex: 'updateTime',
      title: '客户经理数量',
      render: (updateTime) => updateTime || UNKNOWN,
      width: 220
    },
    {
      key: 'updateTime',
      dataIndex: 'updateTime',
      title: '客户经理名称',
      render: (updateTime) => updateTime || UNKNOWN,
      width: 220
    },

    {
      key: 'operate',
      title: '操作',
      fixed: 'right',
      width: 290,
      render: (operate, record, index) => {
        return (
          <div>
            <AuthBtn path="/view">
              <Button type="link" onClick={() => onOperate('view', record)}>
                查看群发详情
              </Button>
            </AuthBtn>
            <AuthBtn path="/operate">
              <Button type="link" onClick={() => onOperate('edit', record, index)}>
                停用群发
              </Button>
            </AuthBtn>
          </div>
        );
      }
    }
  ];
};
