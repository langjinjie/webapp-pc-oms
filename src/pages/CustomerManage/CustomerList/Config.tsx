import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { Avatar, Button, Form } from 'antd';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { TagModal } from 'src/pages/StaffManage/components';
import { SelectOrg } from 'src/pages/CustomerManage/components';
import { UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { UNKNOWN } from 'src/utils/base';
import { TagItem } from 'src/utils/interface';
import classNames from 'classnames';
import style from './style.module.less';

/**
 * 部门类型id及名称对照
 * 团队部门id,dtype:5
 * 区域部门id,dtype:4
 * 大区部门id,dtype:3
 * 中心部门id,dtype:2
 */
export const orgDeptType2Name: { [key: string]: number } = {
  leaderDeptIds: 5,
  bossDeptIds: 4,
  areaDeptIds: 3,
  centerDepId: 2
};

export interface IList {
  avatar: string;
  detailId: string;
  externalUserid: string;
  nickName: string;
  staffId: string;
  staffName: string;
  staffStatus: number;
  tagList: TagItem[];
  transferStatus?: number;
  takeoverTime?: string;
  addTime?: string;
  reasonName?: string;
  fullDeptName?: string;
  channleTagName?: string;
}

export const searchCols: SearchCol[] = [
  { type: 'input', label: '客户名称', placeholder: '请输入', name: 'clientName' },
  {
    name: 'filterTag',
    type: 'custom',
    width: 100,
    label: '客户标签',
    customNode: (
      <Form.Item key={'filterTag'} name="filterTag" label="客户标签">
        <TagModal key={1} />
      </Form.Item>
    )
  },
  {
    type: 'rangePicker',
    name: 'addTime',
    label: '加好友时间'
  },
  {
    name: 'staffList',
    type: 'custom',
    label: '所属客户经理',
    placeholder: '请输入',
    customNode: (
      <Form.Item key={'staffList'} name="staffList" label="所属客户经理">
        <SelectOrg key={1} />
      </Form.Item>
    )
  },
  {
    name: 'staffList',
    type: 'custom',
    label: '',
    placeholder: '请输入',
    customNode: (
      <Form.Item key={'orgDept'} name="orgDept" label="所属客户经理组织架构">
        <SelectOrg key={2} type="dept" checkabledDTypeKeys={[2, 3, 4, 5]} />
      </Form.Item>
    )
  }
];

export const TableColumnsFun = (): ColumnsType<IList> => {
  const history = useHistory();
  // 查看客户信息
  const viewDetail = (record: any) => {
    history.push(
      '/customerManage/clientDetail?externalUserid=' + record.externalUserid + '&followStaffId=' + record.staffId,
      {
        navList: [
          {
            name: '客户信息',
            path: '/customerManage'
          },
          {
            name: '客户详情'
          }
        ]
      }
    );
  };
  // 去转接好友
  const transferCustomer = () => {
    history.push('/onjob');
  };
  return [
    {
      title: '客户名称',
      dataIndex: 'nickName',
      render: (nickName, record) => {
        return (
          <div>
            <Avatar size={36} src={record.avatar} icon={<UserOutlined />} /> {nickName}
          </div>
        );
      }
    },
    {
      title: '所属客户经理',
      dataIndex: 'staffName'
    },
    {
      title: '组织架构',
      dataIndex: 'fullDeptName',
      render (fullDeptName: string) {
        return (
          <span className={classNames(style.fullDeptName, 'ellipsis')} title={fullDeptName}>
            {fullDeptName}
          </span>
        );
      }
    },
    {
      title: '渠道来源',
      dataIndex: 'channleTagName',
      render (channleTagName: string) {
        return <>{channleTagName || UNKNOWN}</>;
      }
    },
    {
      title: '客户标签',
      dataIndex: 'tagList',
      render: (tagList: TagItem[]) => {
        return (
          <span
            className={'ellipsis'}
            title={tagList
              ?.map((tagItem) =>
                tagItem.displayType ? tagItem.groupName?.replace(/兴趣|意愿/g, '') + tagItem.tagName : tagItem.tagName
              )
              .toString()
              .replace(/,/g, '，')}
          >
            {tagList?.slice(0, 2).map((mapItem) => (
              <span
                key={mapItem.tagId}
                className={classNames(style.tagItem, {
                  [style.yellow]: mapItem.modified === 1,
                  [style.blue]: mapItem.modified === 0
                })}
              >
                {mapItem.displayType === 1 ? mapItem.groupName!.replace(/兴趣|意愿/g, '') : ''}
                {mapItem.tagName}
              </span>
            ))}
            {tagList?.length > 2 && '...'}
            {!tagList && UNKNOWN}
          </span>
        );
      }
    },
    {
      title: '加好友时间',
      dataIndex: 'addTime'
    },
    {
      title: '操作',
      fixed: 'right',
      width: 210,
      render: (text, record) => {
        return (
          <>
            <Button type="link" onClick={() => viewDetail(record)}>
              查看客户详情
            </Button>
            <Button type="link" onClick={transferCustomer}>
              去转接好友
            </Button>
          </>
        );
      }
    }
  ];
};
