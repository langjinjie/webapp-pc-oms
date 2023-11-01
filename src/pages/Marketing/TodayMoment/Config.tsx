import React from 'react';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol, AuthBtn } from 'src/components';
import { Button } from 'antd';
import classNames from 'classnames';
import style from './style.module.less';
import { UNKNOWN } from 'src/utils/base';

export interface ITodayMomentRow {
  momentId: string; // 是 朋友圈ID
  mainMomentId: string; // 是 主朋友圈ID
  momentName: string; // 是 朋友圈名称
  syncFromMain: number; // 是 否从公有云同步过来的，0-不是，1-是，默认为0
  state: number; // 是 状态：0=未上架; 1=已上架;2=已下架
  groupId: string; // 否 用户组id
  createBy: string; // 是 创建人
  dateCreated: string; // 是  创建时间格式：yyyy.MM.dd HH:mm:ss
  updateBy: string; // 是 更新人
  updateTime: string; // 是 修改时间，格式：yyyy.MM.dd HH:mm:ss
  upCorps: IUpCorp[]; // 是 上架的机构
}

export const stateOptions = [
  { id: 0, name: '未上架' },
  { id: 1, name: '已上架' },
  { id: 2, name: '已下架' }
];

export const searchCol: SearchCol[] = [
  { name: 'momentName', label: '今日朋友圈名称', type: 'input', placeholder: '请输入' },
  { name: 'state', label: '状态', type: 'select', options: stateOptions }
];

interface ITableColumnsFunProps {
  // 上下架
  onlineHandle: (row: ITodayMomentRow) => void;
  // 编辑
  editHandle: (row: ITodayMomentRow) => void;
  // 设置可见范围
  setRight: (row: ITodayMomentRow) => void;
}

export interface IUpCorp {
  corpId: string; // 机构ID
  corpName: String; // 机构名
}

export const tableColumnsFun: (props: ITableColumnsFunProps) => ColumnsType<any> = ({
  onlineHandle,
  editHandle,
  setRight
}) => {
  const columnsList: ColumnsType<any> = [
    { title: '今日朋友圈ID', dataIndex: 'momentId' },
    {
      title: '今日朋友圈名称',
      dataIndex: 'momentName',
      render (momentName) {
        return (
          <span title={momentName}>
            {(momentName || '').length <= 20 ? momentName || '' : (momentName || '').slice(0, 20) + '...'}
          </span>
        );
      }
    },
    { title: '创建时间', dataIndex: 'dateCreated' },
    { title: '修改时间', dataIndex: 'updateTime' },
    { title: '修改人', dataIndex: 'updateBy', render: (updateBy: string) => <>{updateBy || UNKNOWN}</> },
    {
      title: '状态',
      dataIndex: 'state',
      render (state: number) {
        return (
          <>
            <i
              className={classNames('status-point', {
                'status-point-gray': state === 0,
                'status-point-red': state === 2
              })}
            />
            <span>{stateOptions.find(({ id }) => id === state)?.name}</span>
          </>
        );
      }
    },
    {
      title: '上架机构',
      dataIndex: 'upCorps',
      render (upCorps: IUpCorp[]) {
        const upCorpsName =
          (upCorps || [])
            .map(({ corpName }) => corpName)
            .toString()
            .replace(/,/g, '，') || UNKNOWN;
        return (
          <span className={classNames(style.upCorps, 'ellipsis')} title={upCorpsName}>
            {upCorpsName}
          </span>
        );
      }
    },
    {
      title: '操作',
      fixed: 'right',
      render (row: ITodayMomentRow) {
        return (
          <>
            <AuthBtn path="/operate">
              <Button type="link" onClick={() => onlineHandle(row)}>
                {row.state === 1 ? '下架' : '上架'}
              </Button>
            </AuthBtn>
            <AuthBtn path="/edit">
              <Button type="link" onClick={() => editHandle(row)}>
                编辑
              </Button>
            </AuthBtn>
            <AuthBtn path="/userGroup">
              <Button type="link" onClick={() => setRight(row)}>
                配置可见范围
              </Button>
            </AuthBtn>
          </>
        );
      }
    }
  ];

  return columnsList;
};
