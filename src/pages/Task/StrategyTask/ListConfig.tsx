import React from 'react';
import { Button, Space, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import classNames from 'classnames';
import { OperateType } from 'src/utils/interface';

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
    width: '180px'
  }
];

// 机构属性
interface CorpProps {
  onlineCorpId: string;
  onlineCorpName: string;
}
export interface StrategyTaskProps {
  tplId: string;
  tplCode: string;
  tplName: string;
  staffScope: number;
  clientScope: number;
  updateTime: string;
  updateBy: string;
  status: number;
  displayCoverImg: string;
  resultDesc: string;
  taskDesc: string;
  sceneDesc: string;
  onlineCorps: CorpProps[];
}
interface OperateProps {
  onOperate: (operateType: OperateType, record: StrategyTaskProps) => void;
}
export const tableColumnsFun = (args: OperateProps): ColumnsType<StrategyTaskProps> => {
  return [
    { title: '策略任务模板编号', dataIndex: 'tplCode', key: 'tplCode', width: 200 },
    {
      title: '策略任务模板名称',
      dataIndex: 'tplName',
      key: 'tplName',
      width: 200
    },
    {
      title: '策略修改时间',
      dataIndex: 'updateTime',
      width: 160,
      key: 'updateTime',
      align: 'center',
      render: (updateTime: string) => updateTime || UNKNOWN
    },
    {
      title: '修改人',
      dataIndex: 'updateBy',
      key: 'updateBy',
      width: 260,
      align: 'center'
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 260,
      align: 'center',

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
      title: '上架机构',
      dataIndex: 'onlineCorps',
      width: 260,
      ellipsis: {
        showTitle: false
      },
      render: (onlineCorps: CorpProps[]) => (
        <Tooltip
          placement="topLeft"
          title={
            <>
              {onlineCorps.map((item, index) => (
                <div key={index + 'corp'}>
                  <span key={item.onlineCorpId + index}>{item.onlineCorpName}</span>
                  {index < onlineCorps.length && <br></br>}
                </div>
              ))}
            </>
          }
        >
          <div>
            {onlineCorps?.map((corp, index) => {
              if (index <= 1) {
                return (
                  <span key={corp.onlineCorpId + index}>
                    <span>{corp.onlineCorpName}</span>
                    {index === 0 ? <br></br> : ''}
                  </span>
                );
              }
              return '';
            })}
            {onlineCorps.length > 2 ? '...' : null}
          </div>
        </Tooltip>
      )
    },
    {
      title: '操作',
      dataIndex: 'status',
      width: 240,
      fixed: 'right',
      render: (status, record) => {
        return (
          <Space size={0}>
            <Button type="link" onClick={() => args.onOperate('view', record)}>
              查看
            </Button>
            {status === 1 && (
              <Button type="link" onClick={() => args.onOperate('outline', record)}>
                下架
              </Button>
            )}

            {status === 0 && (
              <>
                <Button type="link" onClick={() => args.onOperate('putAway', record)}>
                  上架
                </Button>
              </>
            )}
            <Button type="link" onClick={() => args.onOperate('edit', record)}>
              编辑
            </Button>

            <Button type="link" onClick={() => args.onOperate('other', record)}>
              配置展示信息
            </Button>
          </Space>
        );
      }
    }
  ];
};
