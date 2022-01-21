import React from 'react';
// import classNames from 'classnames';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { Button, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { UNKNOWN } from 'src/utils/base';
import classNames from 'classnames';
import { ExclamationCircleOutlined } from '@ant-design/icons';
export const sensitiveOptions = [
  { id: 0, name: '未知' },
  { id: 1, name: '是' },
  { id: 2, name: '否' }
];
export const speechContentTypes = [
  { id: 1, name: '纯文字' },
  { id: 2, name: '图片' },
  { id: 3, name: '名片' },
  { id: 4, name: '小站' },
  { id: 5, name: '图文链接' },
  { id: 6, name: '音频' },
  { id: 7, name: '视频' },
  { id: 9, name: '小程序' },
  { id: 10, name: 'PDF' }
];
export const excelDemoUrl =
  'https://insure-prod-server-1305111576.cos.ap-guangzhou.myqcloud.com/file/smart/%E5%90%8E%E7%AE%A1%E7%AB%AF%E8%AF%9D%E6%9C%AF%E6%A8%A1%E6%9D%BF.xlsx';

export const statusOptions = [
  { id: 0, name: '待上架' },
  { id: 1, name: '已上架' },
  { id: 2, name: '已下架' }
];

export const setSearchCols = (options: any[]): SearchCol[] => {
  return [
    {
      name: 'catalogIds',
      type: 'cascader',
      label: '选择目录',
      width: '320px',
      placeholder: '请输入',
      fieldNames: { label: 'name', value: 'catalogId', children: 'children' },
      cascaderOptions: options
    },
    {
      name: 'content',
      type: 'input',
      label: '话术内容',
      width: '280px',
      placeholder: '请输入'
    },
    {
      name: 'tip',
      type: 'input',
      label: '话术小贴士',
      width: '280px',
      placeholder: '请输入'
    },
    {
      name: 'contentType',
      type: 'select',
      width: 140,
      label: '话术格式',
      options: speechContentTypes
    },
    {
      name: 'status',
      type: 'select',
      width: 140,
      label: '上架状态',
      options: statusOptions
    },
    {
      name: 'sensitive',
      type: 'select',
      width: 140,
      label: '是否触发敏感词',
      options: sensitiveOptions
    },
    {
      name: 'times',
      type: 'rangePicker',
      width: 160,
      label: '更新时间'
    }
  ];
};

interface OperateProps {
  handleEdit: (record: SpeechProps) => void;
  handleSort: (record: SpeechProps, sortType: number) => void;
  lastCategory: any;
  pagination: any;
  formParams: any;
  isNew: boolean;
}
export const genderTypeOptions = [
  { id: 1, name: '男性' },
  { id: 2, name: '女性' }
];

export const ageTypeOptions = [
  { id: 1, name: '老年' },
  { id: 2, name: '中年' },
  { id: 3, name: '青年' }
];
export interface SpeechProps {
  sceneId: number; // 业务场景ID，1-车险流程，2-非车流程，3-异议处理，4-场景话术，5-问答知识，6-智能教练。
  contentId: string; // 话术id
  fullName: string; // 来源
  contentType: number; // 话术类型：1-文本、2-长图、3-名片、4-小站、5-单图文、6-单语音、7-单视频、8-第三方链接、9-小程序链接、9-小程序
  content: string; // 话术内容
  genderType?: number; // 话术内容对应的客户性别（空-不区分，1-男性；2-女性）
  ageType?: number; // 话术内容对应的客户年龄(空-不相关；1-老，2-中，3-青)
  tip?: string; // 小贴士
  sensitive?: number; // 是否触发敏感词，0-未知，1-是，2-否，默认0
  sensitiveWord?: string; // 触发的敏感词
  status: number; // 状态，0-待上架，1-已上架, 2-已下架
  dateCreated: string; // 创建时间;
  createBy?: string; // 创建人;
  lastUpdated?: string; // 更新时间;
  updateBy?: string; // 更新人;
  [propKey: string]: any;
}
export const columns = (args: OperateProps): ColumnsType<SpeechProps> => {
  const { handleEdit, handleSort, lastCategory, pagination, formParams, isNew } = args;
  const {
    content = '',
    contentType = '',
    sensitive = '',
    status = '',
    updateBeginTime = '',
    updateEndTime = '',
    tip = ''
  } = formParams;
  return [
    {
      title: '目录',
      dataIndex: 'fullName',
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
      title: '话术格式',
      dataIndex: 'contentType',
      width: 120,
      render: (contentType) => (
        <span>{speechContentTypes.filter((item) => item.id === contentType)?.[0]?.name || UNKNOWN}</span>
      )
    },
    {
      title: '话术内容',
      dataIndex: 'content',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (content) => (
        <Tooltip placement="topLeft" title={content}>
          {content || UNKNOWN}
        </Tooltip>
      )
    },
    {
      title: '客户分类',
      dataIndex: 'genderType',
      width: 100,
      render: (value, record) => {
        return (
          <span>
            {(genderTypeOptions.filter((item) => item.id === value)?.[0]?.name || '') +
              (ageTypeOptions.filter((ageType) => ageType.id === record.ageType)?.[0]?.name || '') || '全部'}
          </span>
        );
      }
    },
    {
      title: '话术小贴士',
      dataIndex: 'tip',
      width: 200,
      ellipsis: {
        showTitle: false
      },
      render: (name) => {
        return <span>{name || UNKNOWN}</span>;
      }
    },
    {
      title: '触发敏感词',
      dataIndex: 'sensitive',
      width: 120,
      ellipsis: {
        showTitle: false
      },
      render: (value, record: SpeechProps) => {
        return (
          <span>
            {sensitiveOptions.filter((sensitive) => sensitive.id === value)?.[0].name}
            {value === 1 && (
              <Tooltip title={record.sensitiveWord} className="ml10">
                <ExclamationCircleOutlined />
              </Tooltip>
            )}
          </span>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'dateCreated',
      width: 180,

      render: (name) => {
        return <span>{name || UNKNOWN}</span>;
      }
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdated',
      width: 180,

      render: (name) => {
        return <span>{name || UNKNOWN}</span>;
      }
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      width: 130,

      render: (name) => {
        return <span>{name || UNKNOWN}</span>;
      }
    },
    {
      title: '更新人',
      dataIndex: 'updateBy',
      width: 130,

      render: (name) => {
        return <span>{name || UNKNOWN}</span>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'left',
      fixed: 'right',
      render: (value) => {
        return (
          <span>
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': value === 0,
                  'status-point-green': value === 1,
                  'status-point-red': value === 2
                }
              ])}
            ></i>
            {statusOptions.filter((status) => status.id === value)?.[0].name}
          </span>
        );
      }
    },
    {
      title: '操作',
      align: 'left',
      fixed: 'right',
      width: 140,
      render: (value, record: SpeechProps, index: number) => {
        return (
          <Space className="spaceWrap">
            <Button disabled={record.status === 1} type="link" onClick={() => handleEdit(record)}>
              编辑
            </Button>
            {(index !== 0 || (pagination.current === 1 && index !== 0) || pagination.current !== 1) && (
              <Button
                disabled={
                  !isNew ||
                  lastCategory?.lastLevel !== 1 ||
                  content !== '' ||
                  contentType !== '' ||
                  sensitive !== '' ||
                  status !== '' ||
                  updateBeginTime !== '' ||
                  updateEndTime !== '' ||
                  tip !== ''
                }
                type="link"
                onClick={() => handleSort(record, -1)}
              >
                上移
              </Button>
            )}
            {(pagination.current - 1) * pagination.pageSize + index + 1 !== pagination.total && (
              <Button
                disabled={
                  !isNew ||
                  lastCategory?.lastLevel !== 1 ||
                  content !== '' ||
                  contentType !== '' ||
                  sensitive !== '' ||
                  status !== '' ||
                  updateBeginTime !== '' ||
                  updateEndTime !== '' ||
                  tip !== ''
                }
                type="link"
                onClick={() => handleSort(record, 1)}
              >
                下移
              </Button>
            )}
          </Space>
        );
      }
    }
  ];
};
