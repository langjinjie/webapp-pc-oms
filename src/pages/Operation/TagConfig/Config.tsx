import React, { useMemo } from 'react';
import { Avatar, Button, Popconfirm, Select } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
export const searchCols: SearchCol[] = [
  {
    name: 'staffName',
    type: 'input',
    label: '员工姓名',
    width: '268px',
    placeholder: '请输入'
  },
  {
    name: 'externalUserid',
    type: 'input',
    label: '外部联系人ID',
    width: '268px',
    placeholder: '请输入'
  },
  {
    name: 'nickName',
    type: 'input',
    label: '客户昵称',
    width: '268px',
    placeholder: '请输入'
  }
];

export interface UserTagProps {
  staffId: string;
  staffName: string;
  nickName: string;
  carNumber: string;
  [prop: string]: any;
}
interface OperateProps {
  onChange: ({ col, value, scored, index }: { col: any; value: string; scored: any; index: number }) => void;
  onConfirm: (scored: UserTagProps, index: number) => void;
  tableCols: any[];
}

export const columns = (args: OperateProps): ColumnsType<UserTagProps> => {
  const { onChange, onConfirm, tableCols } = args;
  const cols = useMemo(() => {
    if (tableCols.length > 0) {
      return tableCols.map((col) => {
        return {
          title: col.groupName,
          dataIndex: col.groupId,
          width: 200,
          render: (text: number, scored: any, index: number) => {
            const dataList = [...scored.tagLists];
            const current = dataList.filter((item) => item.groupId === col.groupId)[0] || {};
            return (
              <Select
                style={{ width: '120px' }}
                value={current.preTagId || current.tagId}
                onChange={(value) => onChange({ col, value, scored, index })}
                disabled={current.tagName === '高'}
              >
                {col.options?.map((option: any) => {
                  return (
                    <Select.Option
                      key={option.tagId}
                      value={option.tagId}
                      disabled={current.tagName === '中' && option.tagName === '低'}
                    >
                      {option.tagName}
                    </Select.Option>
                  );
                })}
              </Select>
            );
          }
        };
      });
    } else {
      return [];
    }
  }, [tableCols]);
  return [
    {
      title: '员工姓名',
      dataIndex: 'staffName',
      width: 200
    },
    {
      title: '客户昵称',
      dataIndex: 'avatar',
      width: 200,
      render: (value, scored) => (
        <div>
          <Avatar src={value} />
          <span className="ml5">{scored.nickName}</span>
        </div>
      )
    },
    {
      title: '车牌号',
      width: 120,
      dataIndex: 'carNumber'
    },
    ...cols,

    {
      title: '操作',
      dataIndex: 'status',
      width: 80,
      align: 'left',
      fixed: 'right',
      render: (value: any, scored: any, index: number) => (
        <Popconfirm
          placement="bottomLeft"
          title="标签值修改为高后系统将会推送促成任务消息给员工?"
          onConfirm={() => onConfirm(scored, index)}
        >
          <Button type="link">推送</Button>
        </Popconfirm>
      )
    }
  ];
};
