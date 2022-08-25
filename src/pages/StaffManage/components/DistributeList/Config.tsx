import React from 'react';
import { /* Button, */ Form } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { SelectStaff, TagModal } from 'src/pages/StaffManage/components';
import { TagItem } from 'src/utils/interface';
import style from './style.module.less';
import classNames from 'classnames';

export const transferStatusList = [
  { id: 1, name: '转接中（发起在职转接，但是客户还未接受）' },
  { id: 2, name: '已转接（客户已经接受转接或者自动转接成功）' },
  { id: 3, name: '已拒绝（客户手工点击拒绝接受转接）' },
  { id: 4, name: '已转接（90天无法转接）' },
  { id: 5, name: '已拒绝（成员已超过最大客户数）' }
];

export const contentSourceList = [
  { id: 1, name: '公有库' },
  { id: 2, name: '私有库' }
];

export const searchCols: (reasonCodeList: any[], distributeLisType: 1 | 2) => SearchCol[] = (
  reasonCodeList,
  distributeLisType
) => {
  const searchColsList: SearchCol[] = [
    {
      name: 'clientName',
      type: 'input',
      label: '客户昵称',
      width: '140px',
      placeholder: '请输入'
    },
    {
      name: 'staffList',
      type: 'custom',
      label: '所属客户经理',
      placeholder: '请输入',
      customNode: (
        <Form.Item key={'staffList'} name="staffList" label="所属客户经理">
          <SelectStaff key={1} />
        </Form.Item>
      )
    },
    // 搜索自定义Form表单
    {
      name: 'filterTag',
      type: 'custom',
      width: 140,
      label: '客户标签',
      customNode: (
        <Form.Item key={'filterTag'} name="filterTag" label="客户标签">
          <TagModal key={1} />
        </Form.Item>
      )
    },
    {
      name: 'addTime',
      type: 'rangePicker',
      width: '140px',
      label: '添加时间'
    },
    {
      name: 'staffStatus',
      type: 'select',
      width: '140px',
      label: '账号状态',
      options: [
        { id: 1, name: '已激活' },
        { id: 2, name: '已禁用' },
        { id: 4, name: '未激活' }
      ]
    },
    {
      name: 'transferStatus',
      type: 'select',
      width: '140px',
      label: '转接状态',
      options: transferStatusList
    },
    {
      name: 'takeoverTime',
      type: 'rangePicker',
      width: '140px',
      label: '转接时间'
    },
    {
      name: 'reasonCode',
      type: 'select',
      width: '140px',
      label: '转接原因',
      options: reasonCodeList
    }
  ];
  if (distributeLisType === 2) {
    searchColsList.pop();
  }
  return searchColsList;
};
export const searchCols1: SearchCol[] = [
  {
    name: 'title',
    type: 'input',
    label: '客户姓名',
    width: '180px',
    placeholder: '请输入'
  },
  {
    name: 'syncBank',
    type: 'select',
    width: 180,
    label: '联系情况',
    placeholder: '请选择',
    options: [
      { id: 0, name: '近3天有联系' },
      { id: 1, name: '近7天有联系' },
      { id: 2, name: '近30天有联系' }
    ]
  }
];

export interface IClientColumns {
  externalUserid: string;
  avatar: string;
  nickName: string;
  staffId: string;
  staffName: string;
  staffStatus: number;
  tagList: TagItem[];
  transferStatus: number;
  takeoverTime: string;
  addTime: string;
  reasonName: string;
}

interface OperateProps {
  distributeLisType: 1 | 2;
}

const assginStaffStatus = {
  1: '已激活',
  2: '已禁用',
  4: '未激活'
};

export const tableColumnsFun = (args: OperateProps): ColumnsType<IClientColumns> => {
  const columnList: ColumnsType<IClientColumns> = [
    { title: '员工昵称', dataIndex: 'nickName' },
    {
      title: '所属客户经理',
      dataIndex: 'staffName'
    },
    {
      title: '账号状态',
      dataIndex: 'staffStatus',
      render: (staffStatus: string) =>
        assginStaffStatus[staffStatus as keyof { '1': string; '2': string; '4': string }] || UNKNOWN
    },
    {
      title: '客户标签',
      dataIndex: 'tagList',
      render: (tagList: TagItem[]) => {
        return (
          <span
            className={classNames(style.clientTagList, 'ellipsis')}
            title={tagList
              ?.map((tagItem) => (tagItem.displayType ? tagItem.groupName + ' ' + tagItem.tagName : tagItem.tagName))
              .toString()}
          >
            {tagList
              ?.map((tagItem) => (tagItem.displayType ? tagItem.groupName + ' ' + tagItem.tagName : tagItem.tagName))
              .toString()}
          </span>
        );
      }
    },
    {
      title: '转接状态',
      dataIndex: 'transferStatus',
      render (transferStatus: number) {
        return <>{transferStatusList.find((statusItem) => statusItem.id === transferStatus)?.name || UNKNOWN}</>;
      }
    },
    {
      title: '转接时间',
      dataIndex: 'takeoverTime',
      render (takeoverTime: string) {
        return <>{takeoverTime || UNKNOWN}</>;
      }
    },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      render (addTime: string) {
        return <>{addTime || UNKNOWN}</>;
      }
    },
    {
      title: '转接原因',
      dataIndex: 'reasonName',
      render (reasonName: string) {
        return <>{reasonName || UNKNOWN}</>;
      }
    }
  ];
  if (args.distributeLisType === 2) {
    columnList.filter((filterItem) => filterItem.title !== '转接原因');
  }
  return columnList;
};

export const clientTypeList = [
  {
    key: 'key1',
    title: '全部客户',
    value: 12
  },
  {
    key: 'key2',
    title: '商业险到期客户',
    value: 4
  },
  {
    key: 'key3',
    title: '交强险到期客户',
    value: 7
  },
  {
    key: 'key4',
    title: '医疗险到期客户',
    value: 1
  }
];