import React from 'react';
import { Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import { OperateType } from 'src/utils/interface';
import classNames from 'classnames';

export const searchCols: SearchCol[] = [
  {
    name: 'tplCode',
    type: 'input',
    label: '策略任务模板编号',
    width: '180px',
    placeholder: '请输入'
  },
  {
    name: 'tplName',
    type: 'input',
    label: '策略任务模板名称',
    placeholder: '请输入',
    width: '320px'
  }
];

export interface StrategyTaskProps {
  corpTplId: string;
  tplCode: string;
  corpTplName: string;
  updateTime: string;
  updateBy: string;
  status: number;
}

interface OperateProps {
  onOperate: (corpTplId: string, operateType: OperateType) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<StrategyTaskProps> => {
  return [
    { title: '机构策略任务编号', dataIndex: 'tplCode', key: 'tplCode', width: 200 },
    {
      title: '机构策略任务编号',
      dataIndex: 'corpTplName',
      key: 'corpTplName',
      width: 200
    },
    {
      title: '策略修改时间',
      dataIndex: 'updateTime',
      width: 160,
      key: 'updateTime',
      align: 'center',
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '策略修改人',
      dataIndex: 'updateBy',
      width: 260
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 260,
      render: (status) => {
        return (
          <span>
            <i
              className={classNames('status-point', [
                {
                  'status-point-gray': status === 0,
                  'status-point-green': status === 1
                }
              ])}
            ></i>
            {status === 1 ? '已上架' : '已下架'}
          </span>
        );
      }
    },

    {
      title: '操作',
      dataIndex: 'status',
      width: 180,
      align: 'right',
      render: (status, record) => {
        return (
          <Space size={20}>
            <Button type="link" onClick={() => args.onOperate(record.corpTplId, 'view')}>
              查看
            </Button>
            {status === 1
              ? (
              <Button type="link" onClick={() => args.onOperate(record.corpTplId, 'outline')}>
                下架
              </Button>
                )
              : (
              <>
                <Button type="link" onClick={() => args.onOperate(record.corpTplId, 'putAway')}>
                  上架
                </Button>
                <Button type="link" onClick={() => args.onOperate(record.corpTplId, 'edit')}>
                  编辑
                </Button>
              </>
                )}
          </Space>
        );
      }
    }
  ];
};
