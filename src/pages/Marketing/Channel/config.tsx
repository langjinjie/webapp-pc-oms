import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { OnOperateType } from 'src/utils/interface';
import { Button } from 'antd';

interface ChannelType {
  id: string;
}

export const tableColumnsFun = (onOperate: OnOperateType): ColumnsType<ChannelType> => {
  return [
    {
      title: '序号',
      dataIndex: '',
      width: 80
    },
    {
      title: '机构名称',
      dataIndex: '',
      width: 80
    },
    {
      title: '渠道代码',
      dataIndex: '',
      width: 80
    },
    {
      title: '总访问次数',
      dataIndex: '',
      width: 80
    },
    {
      title: '截止目前访问次数',
      dataIndex: '',
      width: 80
    },
    {
      title: '访问百分比',
      dataIndex: '',
      width: 80
    },
    {
      title: '操作',
      width: 150,
      render: () => {
        return (
          <>
            <Button type="link" onClick={() => onOperate('edit')}>
              编辑
            </Button>
            <Button type="link" onClick={() => onOperate('edit')}>
              添加通知人
            </Button>
          </>
        );
      }
    }
  ];
};
