import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components';
import { UNKNOWN } from 'src/utils/base';
import { Avatar } from 'antd';
import classNames from 'classnames';

const memberTypeOptions = [
  {
    id: 1,
    name: '企业成员'
  },
  {
    id: 2,
    name: '外部联系人'
  }
];

const joinTypeOptions = [
  {
    id: 1,
    name: '直接邀请入群'
  },
  {
    id: 2,
    name: '通过邀请链接入群'
  },
  {
    id: 3,
    name: '通过扫描群二维码入群'
  }
];
export const searchCols: SearchCol[] = [
  {
    type: 'select',
    name: 'type',
    label: '成员类型',
    placeholder: '请选择',
    width: '120px',
    options: memberTypeOptions
  },
  {
    type: 'select',
    name: 'joinScene',
    label: '入群方式',
    placeholder: '请选择',
    width: '140px',
    options: joinTypeOptions
  },

  {
    type: 'rangePicker',
    name: 'createTimeBegin-createTimeEnd',
    label: '入群时间'
  }
];

export type memberColType = {
  groupNickname: string;
  type: number;
  joinScene: string;
  joinTime: string;
  avatar: string;
};
export const tableCols: ColumnsType<memberColType> = [
  {
    key: 'groupNickname',
    dataIndex: 'groupNickname',
    title: '群成员',
    ellipsis: true,
    render: (text, record) => (
      <div>
        <Avatar size={36} src={record.avatar} />
        <span className="ml10">{text}</span>
        <span className={classNames({ 'color-success': record.type === 2, 'color-warning': record.type === 1 })}>
          {record.type === 2 ? ' @微信' : '  @企业微信'}
        </span>
      </div>
    ),
    width: 160
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: '成员类型',
    width: 160,
    render: (text) => memberTypeOptions.filter((type) => type.id === text)[0]?.name || UNKNOWN
  },
  {
    key: 'joinScene',
    dataIndex: 'joinScene',
    title: '入群方式',
    render: (text) => joinTypeOptions.filter((type) => type.id === text)[0]?.name || UNKNOWN,
    width: 160
  },

  {
    key: 'joinTime',
    dataIndex: 'joinTime',
    title: '入群时间',
    ellipsis: true,
    width: 160
  }
];
