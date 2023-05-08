import React from 'react';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { SearchCol } from 'src/components/SearchComponent/SearchComponent';
import { UNKNOWN } from 'src/utils/base';
import classNames from 'classnames';

const stateOptions = [
  { id: 0, name: '未上架' },
  { id: 1, name: '已上架' },
  { id: 2, name: '已下架' }
];

export const tplTypeOptions = [
  {
    id: 1,
    name: '文章'
  },
  {
    id: 2,
    name: '产品'
  },
  {
    id: 3,
    name: '活动'
  },
  {
    id: 4,
    name: '单张海报'
  },
  {
    id: 5,
    name: '9宫格海报'
  }
];
export const searchColsFun = (): SearchCol[] => {
  return [
    {
      name: 'name',
      type: 'input',
      label: '内容名称',
      width: '180px',
      placeholder: '请输入'
    },
    {
      name: 'tplType',
      type: 'select',
      label: '展示模板',
      placeholder: '请输入',
      width: 180,
      options: tplTypeOptions
    },
    {
      name: 'state',
      type: 'select',
      label: '状态',
      placeholder: '请输入',
      width: 180,
      options: [
        { id: 0, name: '未上架' },
        { id: 1, name: '已上架' },
        { id: 2, name: '已下架' }
      ]
    }
  ];
};

export interface MomentColumns {
  feedId: string;
  nodeCode: string;
  typeName: string;
  nodeName: string;
  createBy: string;
  createTime: string;
  state: number;
  tplType: number;
}

interface OperateProps {
  onOperate: (feedId: string) => void;
  manageItem: (value: MomentColumns) => void;
}
export const tableColumnsFun = ({ onOperate, manageItem }: OperateProps): ColumnsType<MomentColumns> => {
  return [
    { title: '内容Id', dataIndex: 'feedId', key: 'feedId', width: 200 },
    {
      title: '展示模版',
      dataIndex: 'tplType',
      key: 'tplType',
      width: 200,
      render: (tplType) => {
        return tplTypeOptions.filter((option) => option.id === tplType)[0]?.name;
      }
    },
    {
      title: '内容名称',
      dataIndex: 'name',
      width: 180,
      key: 'name',
      ellipsis: true,
      render: (categoryName: string) => categoryName || UNKNOWN
    },
    {
      title: '营销话术',
      dataIndex: 'speechcraft',
      width: 180,
      key: 'speechcraft',
      ellipsis: true
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      width: 100,
      render (createBy: string) {
        return <>{createBy || UNKNOWN}</>;
      }
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 260
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 100,
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
      ellipsis: true,
      width: 300,
      render (upCorps: { corpName: string }[]) {
        const upCorpsName =
          (upCorps || [])
            .map(({ corpName }) => corpName)
            .toString()
            .replace(/,/g, '，') || UNKNOWN;
        return <>{upCorpsName}</>;
      }
    },
    {
      title: '操作',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (value) => {
        return (
          <>
            <Button type="link" onClick={() => onOperate(value.feedId)}>
              编辑
            </Button>
            <Button type="link" onClick={() => manageItem(value)}>
              {`${value.state === 1 ? '下架' : '上架'}`}
            </Button>
          </>
        );
      }
    }
  ];
};
