import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';

export interface IChatTagItem {
  analyseId: string; // 是 会存解析ID
  clientName: string; // 是 客户昵称
  externalUserid: string; // 是 外部联系人id
  staffId: string; // 是 员工id
  staffName: string; // 是 客户经理姓名
  userid: string; // 是 客户经理企微账号
  msgContent: string; // 是 聊天内容
  hitKeywords: string; // 是 命中的关键词
  tagGroupNames: string; // 是 生成标签
  tagNames: string; // 是 生成标签值
  createTime: string; // 是 标签生成时间，格式：yyyy.MM.dd HH:mm:ss
  updateTagGroupNames: string; // 否 更新标签
  updateTagNames: string; // 否 更新标签值
  updateTime: string; // 否 更新时间，格式：yyyy.MM.dd HH:mm:ss
  updateBy: string; // 否 更新人
  updateAllTag: number; // 是 是否已全部更新标签，0-否；1-是
}

export const searchCols: SearchCol[] = [
  { name: 'clientName', label: '客户昵称', type: 'input' },
  { name: 'externalUserid', label: '外部联系人id', type: 'input' },
  { name: 'tagGroupName', label: '标签名称', type: 'input' },
  { name: 'staffName', label: '客户经理姓名', type: 'input' },
  { name: 'createTimeBegin-createTimeEnd', label: '标签生成时间', type: 'rangePicker' }
];

type TTableColumns = (param: {
  updateAllTag: () => void;
  selectivelyUpdate: (rowItem: IChatTagItem) => void;
}) => ColumnsType<IChatTagItem>;

export const tableColumns: TTableColumns = ({ updateAllTag, selectivelyUpdate }) => {
  return [
    { title: '客户昵称', dataIndex: 'clientName' },
    { title: '外部联系人id', dataIndex: 'externalUserid' },
    { title: '客户经理姓名', dataIndex: 'staffName' },
    { title: '客户经理企业微信账号', dataIndex: 'userid' },
    { title: '聊天内容', dataIndex: 'msgContent' },
    { title: '关键词', dataIndex: 'hitKeywords' },
    { title: '生成标签', dataIndex: 'tagGroupNames' },
    { title: '生成标签值', dataIndex: 'tagNames' },
    { title: '标签生成时间', dataIndex: 'createTime' },
    { title: '更新标签', dataIndex: 'updateTagGroupNames' },
    { title: '更新标签值', dataIndex: 'updateTagNames' },
    { title: '更新时间', dataIndex: 'updateTime' },
    { title: '更新人', dataIndex: 'updateBy' },
    {
      title: '操作',
      width: 400,
      render (value: IChatTagItem) {
        return (
          <>
            <Button type="link" onClick={updateAllTag}>
              全部更新
            </Button>
            <Button type="link" onClick={() => selectivelyUpdate(value)}>
              选择标签更新
            </Button>
            <Button type="link">查看客户详情</Button>
            <Button type="link">查看聊天记录</Button>
          </>
        );
      }
    }
  ];
};
