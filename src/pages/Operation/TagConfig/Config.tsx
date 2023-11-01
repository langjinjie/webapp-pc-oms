import React, { useMemo } from 'react';
import { Avatar, Button, Popconfirm, Select, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol, AuthBtn } from 'src/components';

export const searchCols: SearchCol[] = [
  {
    name: 'staffName',
    type: 'input',
    label: '员工姓名',
    width: '120px',
    maxLength: 10,
    placeholder: '请输入'
  },
  {
    name: 'externalUserid',
    type: 'input',
    maxLength: 40,
    label: '外部联系人ID',
    width: '268px',
    placeholder: '请输入'
  },
  {
    name: 'nickName',
    type: 'input',
    label: '客户昵称',
    maxLength: 30,
    width: '120px',
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
  onChange: ({
    col,
    value,
    scored,
    index,
    data
  }: {
    col: any;
    value: string;
    scored: any;
    index: number;
    data: any[];
  }) => void;
  onConfirm: (scored: UserTagProps, index: number) => void;
  tableCols: any[];
  dataSource: any[];
  tableType: number;
  saveBuffer?: (scored: UserTagProps) => void;
}

export const columns = (args: OperateProps): ColumnsType<UserTagProps> => {
  const { onChange, onConfirm, tableCols, dataSource, tableType, saveBuffer } = args;
  // 动态table header
  const cols: ColumnsType<UserTagProps> = useMemo(() => {
    if (tableCols.length > 0) {
      return tableCols.map((col: { label: string; groupId: string; [propKey: string]: any }) => {
        return {
          title: col.label,
          dataIndex: col.groupId,
          width: 120,
          align: 'center',
          render: (text: number, scored: any, index: number) => {
            const dataList = [...scored.tagLists];
            const current = dataList.filter((item) => item.groupId === col.groupId)[0] || {};
            return (
              <div>
                {current.tagId && tableType !== 3
                  ? (
                  <Select
                    style={{ width: '80px' }}
                    value={current.preTagId || current.tagId}
                    onChange={(value) => onChange({ col, value, scored, index, data: dataSource })}
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
                    )
                  : tableType === 3
                    ? (
                  <span>{current.tagName || '/'}</span>
                      )
                    : (
                        '/'
                      )}
              </div>
            );
          }
        };
      });
    } else {
      return [];
    }
  }, [tableCols, dataSource]);
  return [
    {
      title: '员工姓名',
      dataIndex: 'staffName',
      width: 100
    },
    {
      title: '客户昵称',
      dataIndex: 'avatar',
      width: 130,
      ellipsis: {
        showTitle: false
      },
      render: (value, scored: any) => (
        <Tooltip placement="topLeft" title={scored.nickName}>
          <Avatar src={value} />
          <span className="ml5">{scored.nickName}</span>
        </Tooltip>
      )
    },
    {
      title: '车牌号',
      width: 120,
      dataIndex: 'carNumber',
      render: (text) => <span>{text || '无'}</span>
    },
    ...cols,
    {
      title: tableType === 3 ? '操作时间' : '操作',
      dataIndex: 'status',
      width: 120,
      align: 'left',
      fixed: 'right',
      render: (value: any, scored: any, index: number) => (
        <>
          <AuthBtn path="/save">
            {tableType === 1 && (
              <Button type="link" onClick={() => saveBuffer?.(scored)}>
                保存
              </Button>
            )}
          </AuthBtn>
          <AuthBtn path="/send">
            {tableType !== 3 && (
              <Popconfirm
                placement="bottomLeft"
                title="标签值修改为高后系统将会推送促成任务消息给员工?"
                onConfirm={() => onConfirm(scored, index)}
              >
                <Button type="link">推送</Button>
              </Popconfirm>
            )}
            {<span>{scored.pushTime}</span>}
          </AuthBtn>
        </>
      )
    }
  ];
};
